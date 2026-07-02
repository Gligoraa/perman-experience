import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { businessData } from '../config/business-config';

export const TeamSection = () => {
  return (
    <section id="team" className="bg-black px-6 py-24">
      <div className="mx-auto max-w-7xl text-center">
        <div className="mb-16">
          <h2 className="mb-4 text-4xl font-light text-white">Upoznajte majstore</h2>
          <p className="mx-auto max-w-xl font-light leading-relaxed text-white/50">
            {'Na\u0161i majstori donose desetlje\u0107a iskustva i strast prema savr\u0161enstvu.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {businessData.stylists.map((stylist, idx) => (
            <motion.div
              key={stylist.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group text-center"
              role="article"
            >
              <div className="relative mb-6 inline-block h-48 w-48">
                <div className="absolute -inset-2 rounded-full bg-amber-500 opacity-0 transition-all duration-500 group-hover:opacity-20" />
                <Image
                  src={stylist.image}
                  alt={stylist.name}
                  fill
                  sizes="192px"
                  className="mx-auto rounded-full border-4 border-zinc-900 object-cover grayscale shadow-2xl transition-all duration-700 group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 right-2 rounded-full bg-amber-500 p-2 text-black shadow-xl">
                  <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                </div>
              </div>
              <h3 className="mb-1 text-xl font-bold text-white">{stylist.name}</h3>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-amber-500">
                {stylist.specialty}
              </p>
              <p className="mx-auto max-w-xs text-sm font-light italic leading-relaxed text-white/40">
                &quot;{stylist.bio}&quot;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
