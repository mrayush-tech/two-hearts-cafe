import { motion } from 'motion/react';
import { ChefHat, Armchair, Users, Wallet, Clock, Heart } from 'lucide-react';

const features = [
  {
    icon: <ChefHat className="w-8 h-8" />,
    title: 'Freshly Prepared Food',
    description: 'We believe in quality. Every dish is prepared fresh with the finest ingredients.'
  },
  {
    icon: <Armchair className="w-8 h-8" />,
    title: 'Comfortable Seating',
    description: 'Relax in our cozy chairs and spacious dining areas designed for your comfort.'
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Friendly Staff',
    description: 'Our attentive and welcoming staff ensure you have a wonderful dining experience.'
  },
  {
    icon: <Wallet className="w-8 h-8" />,
    title: 'Affordable Pricing',
    description: 'Delicious food that does not break the bank. Great value for your money.'
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Fast Service',
    description: 'We value your time. Enjoy prompt service without compromising on quality.'
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Great Atmosphere',
    description: 'A warm, inviting ambiance perfect for family dinners or a quick coffee.'
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-3 block"
          >
            Why Choose Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif text-gray-900 font-bold mb-6"
          >
            What Makes Us Special
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-1 bg-brand-primary mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-brand-bg rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-transparent hover:border-brand-primary/20 hover:shadow-xl group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
