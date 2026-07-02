import React from 'react';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';
import { businessData } from '../config/business-config';

export const ServicesSection = () => {
  return (
    <section id="services" className="bg-zinc-950 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20">
          <h2 className="mb-6 text-4xl font-light text-white md:text-5xl">
            {'Na\u0161e '}<span className="font-serif italic text-amber-500">usluge</span>
          </h2>
          <p className="max-w-xl font-light leading-relaxed text-white/40">
            {'Od preciznog oblikovanja brade do potpunih modernih transformacija, na\u0161e usluge su prilago\u0111ene jedinstvenim crtama svakog klijenta.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {businessData.services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group flex items-end justify-between border-b border-white/5 pb-8 transition-colors hover:border-amber-500/30"
              role="article"
            >
              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-all group-hover:bg-amber-500 group-hover:text-black">
                  <Scissors className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-medium text-white">{service.name}</h3>
                  <span className="text-xs uppercase tracking-widest text-white/30">
                    {service.duration}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl text-amber-500/80 transition-colors group-hover:text-amber-500">
                  {service.price}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
