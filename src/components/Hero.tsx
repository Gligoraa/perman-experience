import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { businessData } from '../config/business-config';

interface HeroProps {
  onBookClick: () => void;
}

export const Hero = ({ onBookClick }: HeroProps) => {
  const { tagline, heroPromise } = businessData;

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src={businessData.gallery[0]}
          alt={businessData.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 blur-sm"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      <div className="relative z-10 max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.3em] text-amber-500">
            {tagline}
          </span>
          <h1 className="mb-6 text-6xl font-light leading-none tracking-tight text-white md:text-8xl">
            {heroPromise.main}{" "}
            <span className="font-serif italic text-amber-500">{heroPromise.italics}</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-white/60 md:text-xl">
            {heroPromise.subtext}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={onBookClick}
              className="w-full rounded-full bg-white px-10 py-4 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-500 hover:text-black focus:ring-2 focus:ring-amber-500 sm:w-auto"
              aria-label="Book your appointment today"
            >
              Rezerviraj svoj termin
            </button>
            <a
              href="#promise"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10 sm:w-auto"
              aria-label="Learn about our quality promise"
            >
              {'Na\u0161a filozofija'}
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
        <ChevronRight className="h-6 w-6 rotate-90" />
      </div>
    </section>
  );
};
