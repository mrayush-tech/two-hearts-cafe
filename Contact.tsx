import { motion } from 'motion/react';
import { MapPin, Phone, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-brand-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-3 block"
          >
            Visit Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif text-gray-900 font-bold mb-6"
          >
            Get In Touch
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-1 bg-brand-primary mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-xl"
          >
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">Contact Information</h3>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-brand-primary flex-shrink-0 mt-1">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Location</h4>
                  <p className="text-gray-600 font-light leading-relaxed">
                    Shivam Vihar Colony, Phase-I, Muradnagar, <br />
                    Asalat Nagar, Uttar Pradesh 201206, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-brand-primary flex-shrink-0 mt-1">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Phone Number</h4>
                  <p className="text-gray-600 font-light leading-relaxed mb-3">
                    +91 90270 12158
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="tel:+919027012158"
                      className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      <Phone className="w-4 h-4" /> Call Now
                    </a>
                    <a
                      href="https://wa.me/919027012158"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-full min-h-[400px] rounded-3xl overflow-hidden shadow-xl"
          >
           <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13988.587399898!2d77.4925!3d28.769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf5a5b51268b1%3A0x6ca36b222c070c7e!2sMuradnagar%2C%20Uttar%20Pradesh%20201206!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen={true} 
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
             className="w-full h-full object-cover min-h-[400px]"
           ></iframe>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
