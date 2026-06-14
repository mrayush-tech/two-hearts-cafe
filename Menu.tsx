import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const menuItems = [
  { name: 'Dal Tadka', halfInfo: '₹139', fullInfo: '₹199', desc: 'Yellow lentils tempered with ghee, cumin, and spices.' },
  { name: 'Dal Makhani', halfInfo: '₹169', fullInfo: '₹239', desc: 'Creamy black lentils slow-cooked overnight with butter.' },
  { name: 'Matar Paneer', halfInfo: '₹169', fullInfo: '₹239', desc: 'Cottage cheese and green peas in a savory tomato gravy.' },
  { name: 'Shahi Paneer', halfInfo: '₹159', fullInfo: '₹249', desc: 'Paneer in a thick gravy made of cream, tomatoes and spices.' },
  { name: 'Kadhai Paneer', halfInfo: '₹159', fullInfo: '₹219', desc: 'Spicy paneer cooked with bell peppers and onions in a kadhai.' },
  { name: 'Paneer Butter Masala', halfInfo: '₹189', fullInfo: '₹279', desc: 'Rich and creamy curry made with paneer, spices, and butter.' },
  { name: 'Paneer Lababdar', halfInfo: '₹179', fullInfo: '₹279', desc: 'Luscious paneer cubes in a creamy and tangy tomato-onion sauce.' },
  { name: 'Paneer Do Pyaza', halfInfo: '₹169', fullInfo: '₹249', desc: 'Paneer cooked with an abundance of onions in a semi-dry gravy.' },
  { name: 'Classic Mix Veg', halfInfo: '₹169', fullInfo: '₹239', desc: 'Assorted fresh vegetables tossed in aromatic Indian spices.' },
];

export default function Menu() {
  return (
    <section id="menu" className="py-24 bg-brand-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Featured Dish Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row shadow-brand-primary/10"
        >
          <div className="md:w-1/2 relative h-64 md:h-auto">
            <img 
              src="https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3" 
              alt="Special Steamed Momos" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-brand-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3 fill-white" /> Chef's Special
            </div>
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-orange-50">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Special Steamed Momos</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6 font-light">
              Delicate, hand-crafted steamed dumplings filled with a savory mixture of fresh cabbage, carrots, and special herbs. Served piping hot with our signature spicy red chili garlic dip for an unforgettable flavor explosion. Perfect as a quick bite or a shared appetizer!
            </p>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-brand-primary">₹149</span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider line-through">₹189</span>
            </div>
            <a href="#reservation" className="inline-block self-start bg-brand-secondary hover:bg-brand-primary text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg shadow-brand-secondary/30">
              Order Now
            </a>
          </div>
        </motion.div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-3 block"
          >
            Discover
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif text-gray-900 font-bold mb-6"
          >
            Our Popular Curries
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-1 bg-brand-primary mx-auto rounded-full mb-8"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-serif font-bold text-gray-900">{item.name}</h3>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-brand-primary bg-orange-50 px-2 py-0.5 rounded">Half: {item.halfInfo}</span>
                  <span className="text-sm font-bold text-brand-secondary bg-orange-100 px-2 py-0.5 rounded">Full: {item.fullInfo}</span>
                </div>
              </div>
              <div className="w-full border-b border-dashed border-gray-200 my-3"></div>
              <p className="text-gray-500 font-light text-sm mt-auto">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
             <a
              href="#contact"
              className="inline-block border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              View Full Menu In-Store
            </a>
        </div>
      </div>
    </section>
  );
}
