import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const galleryImages = [
  {
    id: 'exterior',
    src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=2047&ixlib=rb-4.0.3",
    alt: "Cafe Exterior Night View",
    category: "Exterior",
    className: "col-span-2 row-span-2 md:col-span-1 md:row-span-2",
  },
  {
    id: 'interior',
    src: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    alt: "Interior Seating Area",
    category: "Interior",
    className: "col-span-2 row-span-1 md:col-span-2 md:row-span-1",
  },
  {
    id: 'momos',
    src: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    alt: "Special Steamed Momos",
    category: "Food",
    className: "col-span-1 row-span-1",
  },
  {
    id: 'decor',
    src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1498&ixlib=rb-4.0.3",
    alt: "Heart Shaped Decoration",
    category: "Decor",
    className: "col-span-1 row-span-1",
  },
  {
    id: 'flowers',
    src: "https://images.unsplash.com/photo-1490750967868-88cb4ecb07cb?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    alt: "Interior Pink Flowers",
    category: "Decor",
    className: "col-span-2 row-span-2 md:col-span-1 md:row-span-2",
  },
  {
    id: 'food',
    src: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=1472&ixlib=rb-4.0.3",
    alt: "Indian Curry Dishes",
    category: "Food",
    className: "col-span-2 row-span-1 md:col-span-2 md:row-span-1",
  }
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-24 bg-brand-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-3 block"
          >
            Visual Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif text-gray-900 font-bold mb-6"
          >
            Our Gallery
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-1 bg-brand-primary mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {galleryImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${img.className}`}
              onClick={() => setSelectedImage(img.src)}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                <span className="text-brand-accent text-xs uppercase tracking-widest font-bold mb-2">
                  {img.category}
                </span>
                <span className="text-white font-serif font-medium text-lg text-center">
                  {img.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm cursor-zoom-out"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 bg-black/50 rounded-full"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Gallery Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
