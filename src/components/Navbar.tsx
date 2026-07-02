import React from 'react';
import { Scissors, LayoutDashboard } from 'lucide-react';
import { businessData } from '../config/business-config';

interface NavbarProps {
  onBookClick: () => void;
  onDashboardClick: () => void;
  isDashboard: boolean;
}

export const Navbar = ({ onBookClick, onDashboardClick, isDashboard }: NavbarProps) => {
  return (
    <nav className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 mix-blend-difference">
      <div className="pointer-events-auto flex items-center gap-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-2 rounded-lg px-2 focus:ring-2 focus:ring-amber-500"
          aria-label={`${businessData.name} Home`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/20 transition-transform group-hover:rotate-12">
            <Scissors className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter text-white">
            {businessData.name}
          </span>
        </button>

        <div className="hidden gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 md:flex">
          <a href="#services" className="transition-colors hover:text-white">
            Usluge
          </a>
          <a href="#team" className="transition-colors hover:text-white">
            Tim
          </a>
          <a href="#gallery" className="transition-colors hover:text-white">
            Galerija
          </a>
          <button
            onClick={onDashboardClick}
            className="flex items-center gap-2 text-amber-500 transition-colors hover:text-white"
          >
            <LayoutDashboard className="h-3 w-3" />
            {isDashboard ? 'Po\u010detna' : 'Nadzorna plo\u010da'}
          </button>
        </div>
      </div>

      <button
        onClick={onBookClick}
        className="pointer-events-auto rounded-full bg-amber-500 px-6 py-2 text-sm font-bold uppercase tracking-widest text-black shadow-lg shadow-amber-500/20 transition-all active:scale-95 hover:bg-amber-600 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
        aria-label="Book an appointment now"
      >
        Rezerviraj
      </button>
    </nav>
  );
};
