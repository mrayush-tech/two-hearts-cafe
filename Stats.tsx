import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Smile, Coffee, ThumbsUp, CalendarHeart } from 'lucide-react';

const stats = [
  { id: 1, label: 'Happy Customers', value: 15000, suffix: '+', icon: <Smile className="w-8 h-8" /> },
  { id: 2, label: 'Delicious Dishes', value: 120, suffix: '+', icon: <Coffee className="w-8 h-8" /> },
  { id: 3, label: 'Positive Reviews', value: 2500, suffix: '+', icon: <ThumbsUp className="w-8 h-8" /> },
  { id: 4, label: 'Years of Service', value: 5, suffix: '+', icon: <CalendarHeart className="w-8 h-8" /> },
];

function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    if (isInView) {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function (easeOutQuart)
        const easeOut = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOut * end));

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(step);
        }
      };

      animationFrame = window.requestAnimationFrame(step);
    }

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function Stats() {
  return (
    <section className="py-20 relative bg-brand-primary overflow-hidden">
      {/* Background texture/overlay */}
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-4 border border-white/30">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-5xl font-serif font-bold text-white mb-2 flex items-center justify-center">
                <Counter end={stat.value} />
                <span>{stat.suffix}</span>
              </div>
              <p className="text-white/80 font-medium uppercase tracking-wider text-xs md:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
