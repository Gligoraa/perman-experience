import React from 'react';
import { motion } from 'framer-motion';
import { businessData } from '../config/business-config';

export const PromiseSection = () => {
  return (
    <section id="promise" className="py-24 bg-black border-y border-white/5 scroll-mt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {businessData.philosophy.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-amber-500 font-bold uppercase tracking-[0.2em] mb-4 text-sm">{p.title}</h3>
              <p className="text-white/70 text-lg font-light leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
