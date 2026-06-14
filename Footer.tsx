import { Instagram, Facebook, Twitter, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <a href="#home" className="flex items-center gap-2 mb-6">
              <span className="font-serif text-3xl font-bold">
                Two Hearts<span className="text-brand-primary">.</span>
              </span>
            </a>
            <p className="text-gray-400 font-light leading-relaxed mb-6">
              Where every meal creates memories. Experience delicious food, cozy ambiance, and unforgettable moments.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors">
                <Facebook className="w-5 h-5 -ml-0.5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-white border-b-2 border-brand-primary inline-block pb-1">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-400 hover:text-brand-accent transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-brand-accent transition-colors">About Us</a></li>
              <li><a href="#menu" className="text-gray-400 hover:text-brand-accent transition-colors">Menu</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-brand-accent transition-colors">Gallery</a></li>
              <li><a href="#reservation" className="text-gray-400 hover:text-brand-accent transition-colors">Reservation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-white border-b-2 border-brand-primary inline-block pb-1">Opening Hours</h4>
            <ul className="space-y-3 text-gray-400 font-light">
              <li className="flex justify-between"><span>Monday:</span> <span>10:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between"><span>Tuesday:</span> <span>10:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between"><span>Wednesday:</span> <span>10:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between text-brand-accent"><span>Thursday:</span> <span>10:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between"><span>Friday:</span> <span>10:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between text-brand-primary font-medium"><span>Weekend:</span> <span>09:00 AM - 11:30 PM</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-white border-b-2 border-brand-primary inline-block pb-1">Contact Us</h4>
            <ul className="space-y-4 text-gray-400 font-light">
              <li>
                <span className="block text-white font-medium mb-1">Address:</span>
                Shivam Vihar Colony, Phase-I, Muradnagar, Asalat Nagar, UP 201206
              </li>
              <li>
                <span className="block text-white font-medium mb-1">Phone:</span>
                <a href="tel:+919027012158" className="hover:text-brand-accent transition-colors">+91 90270 12158</a>
              </li>
              <li>
                <span className="block text-white font-medium mb-1">Email:</span>
                <a href="mailto:hello@twoheartscafe.in" className="hover:text-brand-accent transition-colors">hello@twoheartscafe.in</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Two Hearts Cafe. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-brand-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 z-50 ${
          showScrollTop ? 'translate-y-0 opacity-100 hover:-translate-y-2' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </footer>
  );
}
