import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { businessData } from '../config/business-config';

export const GallerySection = () => {
  return (
    <section id="gallery" className="bg-zinc-950 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 justify-between md:flex md:items-end">
          <div className="mb-8 md:mb-0">
            <h2 className="mb-4 text-4xl font-light text-white">Galerija</h2>
            <p className="font-light italic text-white/50">
              Stvarni klijenti, stvarni rezultati. Izvrsnost u svakom detalju.
            </p>
          </div>
          <a
            href={businessData.contact.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center gap-2 px-2 text-sm font-bold uppercase tracking-widest text-amber-500 transition-all hover:gap-4 focus:outline-none focus:underline"
            aria-label="Follow our work on Instagram"
          >
            Pogledaj Instagram <Instagram className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
          {businessData.gallery.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="group relative aspect-square overflow-hidden rounded-3xl shadow-2xl"
            >
              <Image
                src={img}
                alt={`Portfolio ${idx + 1}`}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Instagram className="h-8 w-8 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
