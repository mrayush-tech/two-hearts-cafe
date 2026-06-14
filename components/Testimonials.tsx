import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    rating: 5,
    text: "Everyone in the cafe is nice and the food is very delicious.",
    tags: ["Dine In", "Food: 5/5", "Service: 5/5", "Atmosphere: 5/5"],
    author: "Happy Customer"
  },
  {
    id: 2,
    rating: 4,
    text: "Good atmosphere and friendly staff.",
    tags: ["Quiet environment", "Kid Friendly", "Vegetarian Friendly"],
    author: "Local Guest"
  },
  {
    id: 3,
    rating: 4,
    text: "Burger tasted good and service was decent.",
    tags: ["Dine In Experience"],
    author: "Food Lover"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-bg/50 skew-y-3 origin-bottom-right scale-110 -z-10" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-3 block"
        >
          Customer Reviews
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-serif text-gray-900 font-bold mb-16"
        >
          What People Say
        </motion.h2>

        <div className="relative bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <Quote className="absolute top-6 left-6 w-12 h-12 text-brand-primary/10" />
          <Quote className="absolute bottom-6 right-6 w-12 h-12 text-brand-primary/10 rotate-180" />
          
          <div className="relative h-64 md:h-48 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < testimonials[currentIndex].rating ? 'text-brand-accent fill-brand-accent' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-xl md:text-2xl font-serif text-gray-800 italic mb-8">
                  "{testimonials[currentIndex].text}"
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {testimonials[currentIndex].tags.map((tag, i) => (
                    <span key={i} className="text-xs font-semibold uppercase tracking-wider text-brand-secondary bg-orange-100/50 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex ? 'bg-brand-primary w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
