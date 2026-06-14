import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Clock, User, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';

export default function Reservation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: '',
    date: '',
    time: '',
    message: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        throw new Error('Razorpay SDK failed to load. Are you online?');
      }

      // Create Order
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST'
      });
      if (!orderRes.ok) {
        throw new Error('Failed to create payment order');
      }
      const order = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T1TEXnUlHe8aH5', // fallback
        amount: order.amount,
        currency: order.currency,
        name: "Two Hearts Cafe",
        description: "Table Reservation Advance (₹200)",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const bookingRes = await fetch('/api/bookings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...formData,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            
            if (!bookingRes.ok) {
              throw new Error('Failed to confirm booking after payment.');
            }
            
            setIsSubmitting(false);
            setShowSuccess(true);
            
            setTimeout(() => {
              setShowSuccess(false);
              setFormData({
                name: '', phone: '', email: '', guests: '', date: '', time: '', message: ''
              });
            }, 5000);
          } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message);
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#8B5A2B" // brand-primary matching
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: any){
        setErrorMsg(`Payment failed: ${response.error.description}`);
        setIsSubmitting(false);
      });

      paymentObject.open();

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservation" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-bg rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          
          <div className="lg:w-5/12 bg-brand-primary p-12 text-white relative flex flex-col justify-center">
            <div className="absolute inset-0 bg-black/20" />
            <div
              className="absolute inset-0 opacity-20 mix-blend-overlay bg-cover bg-center"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1374&ixlib=rb-4.0.3")' }}
            />
            
            <div className="relative z-10">
              <span className="text-brand-accent font-semibold tracking-wider uppercase text-sm mb-3 block">
                Reservation
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                Book Your Table
              </h2>
              <p className="text-white/80 font-light leading-relaxed mb-8">
                Reserve a table in advance and let us prepare for your wonderful dining experience at Two Hearts Cafe. We look forward to serving you!
              </p>
              
              <div className="space-y-6 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Call Us Anytime</p>
                    <p className="font-serif font-semibold text-xl">+91 90270 12158</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Opening Hours</p>
                    <p className="font-serif font-semibold text-xl">10:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-7/12 p-8 md:p-12 lg:p-16 bg-white relative">
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center rounded-r-3xl"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">Reservation Confirmed!</h3>
                  <p className="text-gray-600 text-lg">
                    Your advance payment of ₹200 was successful. Your table is now reserved. We have sent you a confirmation via email & WhatsApp.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                  {errorMsg}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-brand-primary focus:border-brand-primary bg-gray-50 focus:bg-white transition-all outline-none"
                    placeholder="Your Name"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9\-\+\s\(\)]{10,}"
                    title="Please enter a valid phone number"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-brand-primary focus:border-brand-primary bg-gray-50 focus:bg-white transition-all outline-none"
                    placeholder="Phone Number"
                  />
                </div>

                <div className="relative group md:col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-brand-primary focus:border-brand-primary bg-gray-50 focus:bg-white transition-all outline-none"
                    placeholder="Email Address (Optional)"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                  </div>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-brand-primary focus:border-brand-primary bg-gray-50 focus:bg-white transition-all outline-none appearance-none"
                  >
                    <option value="" disabled>Number of Guests</option>
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5+ People</option>
                  </select>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-brand-primary focus:border-brand-primary bg-gray-50 focus:bg-white transition-all outline-none text-gray-600"
                  />
                </div>

                <div className="relative group md:col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                  </div>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-brand-primary focus:border-brand-primary bg-gray-50 focus:bg-white transition-all outline-none text-gray-600"
                  />
                </div>
                
                <div className="relative group md:col-span-2">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-brand-primary focus:border-brand-primary bg-gray-50 focus:bg-white transition-all outline-none resize-none"
                    placeholder="Special Requests or Message"
                  ></textarea>
                </div>

              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-primary flex items-center justify-center gap-2 hover:bg-brand-secondary text-white font-medium py-4 px-6 rounded-xl transition-colors transform hover:-translate-y-1 duration-300 shadow-lg shadow-brand-primary/30 text-lg disabled:opacity-70 disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>Book Your Table</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
