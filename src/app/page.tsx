"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, Calendar } from 'lucide-react';

// Config & Types
import { Appointment, businessData } from '../config/business-config';

// Components
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { PromiseSection } from '../components/PromiseSection';
import { ServicesSection } from '../components/ServicesSection';
import { TeamSection } from '../components/TeamSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { GallerySection } from '../components/GallerySection';
import { Dashboard } from '../components/Dashboard';
import { Footer } from '../components/Footer';
import { BookingModal } from '../components/BookingModal';

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);
  const [bookings, setBookings] = useState<Appointment[]>([]);

  // Load bookings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('barber_template_bookings');
    if (saved) {
      setBookings(JSON.parse(saved));
    }
  }, []);

  const handleBookingComplete = (newBooking: Appointment) => {
    const updated = [...bookings, newBooking];
    setBookings(updated);
    localStorage.setItem('barber_template_bookings', JSON.stringify(updated));
    setIsDashboard(true);
  };

  return (
    <div className="bg-black min-h-screen font-sans selection:bg-amber-500 selection:text-black">
      <Navbar
        onBookClick={() => setIsBookingOpen(true)}
        onDashboardClick={() => setIsDashboard(!isDashboard)}
        isDashboard={isDashboard}
      />

      <AnimatePresence mode="wait">
        {isDashboard ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Dashboard bookings={bookings} />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Hero onBookClick={() => setIsBookingOpen(true)} />
            <PromiseSection />
            <ServicesSection />
            <TeamSection />
            <ReviewsSection />
            <GallerySection />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onBookingComplete={handleBookingComplete}
      />

      {/* Mobile Quick Actions */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-40 flex gap-3">
        <a href={`tel:${businessData.contact.phone}`} className="flex-1 bg-zinc-900 border border-white/10 text-white h-14 rounded-2xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs">
          <Phone className="w-4 h-4" /> Nazovi
        </a>
        <button
          onClick={() => setIsBookingOpen(true)}
          className="flex-[2] bg-amber-500 text-black h-14 rounded-2xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs shadow-xl shadow-amber-500/20"
        >
          <Calendar className="w-4 h-4" /> Rezerviraj
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.5);
        }
      `}</style>
    </div>
  );
}
