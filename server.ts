import express from 'express';
import path from 'path';
import 'dotenv/config';
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env.example') && !fs.existsSync('.env')) {
  dotenv.config({ path: '.env.example', override: true });
} else {
  dotenv.config({ override: true });
}
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Booking, Admin } from './src/models.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Database Connection (Lazy) ---
let dbConnected = false;
async function ensureDb() {
  if (dbConnected) return;
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing in environment variables.');
  }
  await mongoose.connect(process.env.MONGO_URI);
  dbConnected = true;
  
  // Seed admin if none exists
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({ email: process.env.ADMIN_EMAIL, password: hashedPassword });
    console.log('Seeded default admin user.');
  }
}

// --- Notifications ---
async function sendWhatsAppNotification(booking: any) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('Twilio credentials missing; skipping WhatsApp notification.');
    return;
  }
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const messageBody = `*New Table Reservation*\n\nName: ${booking.name}\nPhone: ${booking.phone}\nGuests: ${booking.guests}\nDate: ${booking.date}\nTime: ${booking.time}\nSpecial Request: ${booking.message || 'None'}\n\nCustomer has requested a table reservation.`;
  
  let fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
  if (!fromNumber.startsWith('whatsapp:')) {
    fromNumber = `whatsapp:${fromNumber}`;
  }

  try {
    await client.messages.create({
      body: messageBody,
      from: fromNumber,
      to: process.env.TWILIO_ADMIN_WHATSAPP_NUMBER || 'whatsapp:+919170571791'
    });
    console.log('WhatsApp notification sent successfully.');
  } catch (error: any) {
    console.error('Failed to send WhatsApp message:', error.message);
    if (error.code === 63007) {
      console.error('\n-> TWILIO WHATSAPP ACTION REQUIRED: The TWILIO_WHATSAPP_NUMBER is not a valid WhatsApp sender in your Twilio account. If using the sandbox, ensure you send a "join <word>" message to the sandbox number first from your phone, and that you are using the correct sandbox number as the sender. See: https://www.twilio.com/docs/errors/63007\n');
    } else if (error.code === 21910) {
      console.error('\n-> TWILIO WHATSAPP ACTION REQUIRED: Invalid From/To pair. Ensure both numbers start with "whatsapp:+".\n');
    }
  }
}

async function sendEmailConfirmation(booking: any) {
  if (!booking.email || !process.env.SMTP_HOST) {
    console.warn('SMTP configuration missing or customer has no email; skipping email confirmation.');
    return;
  }
  let smtpHost = process.env.SMTP_HOST;
  if (smtpHost && smtpHost.includes('gmail.com') && smtpHost !== 'smtp.gmail.com') {
    console.warn(`SMTP_HOST was set to "${smtpHost}". Falling back to "smtp.gmail.com" as this looks like a Gmail address.`);
    smtpHost = 'smtp.gmail.com';
  }

  const pass = process.env.SMTP_PASS?.replace(/\s+/g, '');
  console.log(`Configuring Nodemailer with user: ${process.env.SMTP_USER}, host: ${smtpHost}, port: ${process.env.SMTP_PORT}, pass length: ${pass?.length}`);

  let transportConfig: any = {
    auth: {
      user: process.env.SMTP_USER,
      pass: pass,
    }
  };

  if (smtpHost === 'smtp.gmail.com') {
    transportConfig.service = 'gmail';
  } else {
    transportConfig.host = smtpHost;
    transportConfig.port = Number(process.env.SMTP_PORT) || 587;
  }

  const transporter = nodemailer.createTransport(transportConfig);

  const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Reservation+at+Two+Hearts+Cafe&dates=${booking.date.replace(/-/g, '')}T${booking.time.replace(':', '')}00Z/${booking.date.replace(/-/g, '')}T${(parseInt(booking.time.split(':')[0]) + 1).toString().padStart(2, '0')}${booking.time.split(':')[1]}00Z&details=Your+table+reservation+for+${booking.guests}+guests.`;

  try {
    await transporter.sendMail({
      from: '"Two Hearts Cafe" <no-reply@twoheartscafe.local>',
      to: booking.email,
      subject: 'Reservation Confirmation - Two Hearts Cafe',
      html: `
        <h2>Your Table Reservation is Pending Confirmation</h2>
        <p>Hi ${booking.name},</p>
        <p>Thank you for submitting a reservation request at Two Hearts Cafe.</p>
        <ul>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time:</strong> ${booking.time}</li>
          <li><strong>Guests:</strong> ${booking.guests}</li>
        </ul>
        <p>We will contact you shortly to confirm your table.</p>
        <p><a href="${calendarLink}">Add to Google Calendar</a></p>
      `
    });
    console.log('Email confirmation sent.');
  } catch (err: any) {
    console.error('Failed to send email:', err.message);
    if (err.message && err.message.includes('535-5.7.8')) {
       console.error('\n-> EMAIL APP PASSWORD REQUIRED: Invalid email login. If using Gmail, you MUST generate and use an "App Password" (not your normal password). Go to Google Account -> Security -> 2-Step Verification -> App passwords.\n');
    }
  }
}

// --- Middleware ---
function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_change_me');
    (req as any).admin = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// --- API Routes ---

// Public: Create Razorpay Order
app.post('/api/razorpay/order', async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.VITE_RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    const options = {
      amount: 20000, // ₹200 advance
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Public: Create Booking (after payment)
app.post('/api/bookings', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, ...bookingData } = req.body;

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    await ensureDb();
    const booking = await Booking.create({
      ...bookingData,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
    
    // Fire notifications asynchronously
    sendWhatsAppNotification(booking).catch(console.error);
    sendEmailConfirmation(booking).catch(console.error);
    
    res.status(201).json(booking);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    await ensureDb();
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'super_secret_key_change_me', { expiresIn: '1d' });
    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all bookings
app.get('/api/admin/bookings', authMiddleware, async (req, res) => {
  try {
    await ensureDb();
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update booking status
app.patch('/api/admin/bookings/:id', authMiddleware, async (req, res) => {
  try {
    await ensureDb();
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(booking);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Delete booking
app.delete('/api/admin/bookings/:id', authMiddleware, async (req, res) => {
  try {
    await ensureDb();
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- Server & Vite Middleware setup ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
