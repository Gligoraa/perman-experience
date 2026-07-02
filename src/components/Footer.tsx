import React from 'react';
import { Scissors, Instagram, Facebook, MapPin, Phone } from 'lucide-react';
import { businessData } from '../config/business-config';

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-black px-6 pb-12 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-24 grid grid-cols-1 gap-16 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-2">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 rotate-12 items-center justify-center rounded-full bg-amber-500 text-black">
                <Scissors className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black uppercase tracking-tighter text-white">
                {businessData.name}
              </span>
            </div>
            <p className="mb-10 max-w-sm text-lg font-light leading-relaxed text-white/40">
              {'Premium usluga za modernog mu\u0161karca. Spajamo tradicionalne tehnike sa suvremenim stilom kako bismo pru\u017eili neponovljivo iskustvo.'}
            </p>
            <div className="flex gap-4">
              <a
                href={businessData.contact.social.instagram}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all hover:border-amber-500 hover:bg-amber-500/10 hover:text-white focus:ring-2 focus:ring-amber-500"
                aria-label={`Follow ${businessData.name} on Instagram`}
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={businessData.contact.social.facebook}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all hover:border-amber-500 hover:bg-amber-500/10 hover:text-white focus:ring-2 focus:ring-amber-500"
                aria-label={`Follow ${businessData.name} on Facebook`}
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-10 text-sm font-bold uppercase tracking-[0.2em] text-amber-500">
              Lokacija
            </h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 text-white/60">
                <MapPin className="h-5 w-5 shrink-0 text-amber-500" />
                <p className="font-light">{businessData.contact.address}</p>
              </div>
              <div className="flex items-center gap-4 text-white/60">
                <Phone className="h-5 w-5 shrink-0 text-amber-500" />
                <p className="font-light">{businessData.contact.phone}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-10 text-sm font-bold uppercase tracking-[0.2em] text-amber-500">
              Radno vrijeme
            </h4>
            <div className="space-y-4 font-mono text-sm font-light leading-relaxed text-white/60">
              <div className="flex justify-between">
                <span>Pon - Pet</span>
                <span>{businessData.hours.mon_fri}</span>
              </div>
              <div className="flex justify-between">
                <span>Subota</span>
                <span>{businessData.hours.sat}</span>
              </div>
              <div className="flex justify-between">
                <span>Nedjelja</span>
                <span className="text-amber-500/50">{businessData.hours.sun}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-12 md:flex-row">
          <p className="text-xs uppercase tracking-widest text-white/20">
            {'\u00a9 2026 '}{businessData.name}{' Frizerski salon. Sva prava pridr\u017eana.'}
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <a href="#" className="transition-colors hover:text-white">
              Pravila privatnosti
            </a>
            <a href="#" className="transition-colors hover:text-white">
              {'Uvjeti kori\u0161tenja'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
