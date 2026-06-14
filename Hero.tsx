import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=2047&ixlib=rb-4.0.3"
          alt="Two Hearts Cafe Exterior Night View"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-brand-accent tracking-[0.2em] text-sm md:text-base font-semibold uppercase mb-4 block">
            Welcome to Two Hearts
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 max-w-4xl mx-auto leading-tight text-white drop-shadow-md">
            Where Every Meal Creates Memories
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Experience delicious food, cozy ambiance, and unforgettable moments at Two Hearts Cafe.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#menu"
              className="px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-full font-medium transition-all transform hover:scale-105 w-full sm:w-auto text-center"
            >
              View Menu
            </a>
            <a
              href="#reservation"
              className="px-8 py-4 bg-white/10 hover:bg-white border border-white/30 hover:border-white hover:text-gray-900 text-white backdrop-blur-sm rounded-full font-medium transition-all transform hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Reserve Table <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <a href="#about" className="text-white/70 hover:text-white transition-colors">
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1">
            <div className="w-1.5 h-2 bg-current rounded-full" />
          </div>
        </a>
      </motion.div>
    </section>
  );
}
