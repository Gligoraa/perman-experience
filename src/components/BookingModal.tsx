"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Scissors, ArrowRight } from 'lucide-react';
import { Appointment, businessData } from '../config/business-config';
import DatePopover from './DatePopover';
import { getAvailableTimeSlots, TIME_SLOTS } from '../lib/availability';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: (newBooking: Appointment) => void;
}

export const BookingModal = ({ isOpen, onClose, onBookingComplete }: BookingModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedStylist, setSelectedStylist] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  const services = businessData.services;
  const stylists = businessData.stylists;
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  const selectedStylistData = stylists.find((stylist) => stylist.id === selectedStylist);
  const availableTimes = useMemo(
    () => getAvailableTimeSlots(bookedTimes),
    [bookedTimes]
  );

  useEffect(() => {
    if (!selectedDate || !selectedStylistData) {
      setBookedTimes([]);
      return;
    }

    let ignore = false;

    const loadAvailability = async () => {
      setIsLoadingAvailability(true);
      setErrorMessage('');

      try {
        const params = new URLSearchParams({
          date: selectedDate,
          stylist: selectedStylistData.name,
        });
        const response = await fetch(`/api/availability?${params.toString()}`);
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(payload?.error ?? 'Nije moguće dohvatiti slobodne termine.');
        }

        if (!ignore) {
          const nextBookedTimes = Array.isArray(payload?.bookedTimes) ? payload.bookedTimes : [];
          setBookedTimes(nextBookedTimes);
          setSelectedTime((current) =>
            current && nextBookedTimes.includes(current) ? '' : current
          );
        }
      } catch (availabilityError) {
        if (!ignore) {
          setBookedTimes([]);
          setErrorMessage(
            availabilityError instanceof Error
              ? availabilityError.message
              : 'Nije moguće dohvatiti slobodne termine.'
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingAvailability(false);
        }
      }
    };

    void loadAvailability();

    return () => {
      ignore = true;
    };
  }, [selectedDate, selectedStylistData]);

  const resetForm = () => {
    setStep(1);
    setSelectedService('');
    setSelectedStylist('');
    setSelectedDate('');
    setSelectedTime('');
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setErrorMessage('');
    setIsSubmitting(false);
    setBookedTimes([]);
    setIsLoadingAvailability(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleComplete = async () => {
    const stylist = stylists.find((s) => s.id === selectedStylist);
    const service = services.find((s) => s.id === selectedService);

    if (!stylist || !service) {
      setErrorMessage('Odaberite uslugu i frizera prije potvrde rezervacije.');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setErrorMessage('Odaberite datum i vrijeme termina.');
      return;
    }

    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      setErrorMessage('Unesite ime, e-mail i broj telefona za potvrdu rezervacije.');
      return;
    }

    const normalizedPrice = Number.parseFloat(
      service.price.replace(',', '.').replace(/[^\d.]/g, '')
    );
    const priceInCents = Number.isFinite(normalizedPrice)
      ? Math.round(normalizedPrice * 100)
      : 0;
    const reservationDate = new Date(`${selectedDate}T${selectedTime}:00`);

    if (Number.isNaN(reservationDate.getTime())) {
      setErrorMessage('Odabrani datum ili vrijeme nisu ispravni.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          service: service.name,
          price: priceInCents,
          date: reservationDate.toISOString(),
          notes: `Frizer: ${stylist.name}`,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(
          payload?.error || 'Do\u0161lo je do gre\u0161ke pri rezervaciji. Molimo poku\u0161ajte ponovo.'
        );
        return;
      }

      onBookingComplete({
        id: payload?.id ?? `${selectedDate}-${selectedTime}-${selectedStylist}`,
        date: selectedDate,
        time: selectedTime,
        service: service.name,
        stylistId: stylist.id,
        stylistName: stylist.name,
        price: service.price,
        status: 'upcoming',
      });
      handleClose();
    } catch (error) {
      console.error('Gre\u0161ka pri rezervaciji:', error);
      setErrorMessage('Do\u0161lo je do gre\u0161ke pri rezervaciji. Molimo poku\u0161ajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[40px] border border-white/10 bg-zinc-950 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 p-8">
              <div>
                <h2 className="text-2xl font-light text-white">Rezerviraj termin</h2>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`h-1 w-8 rounded-full transition-colors ${s <= step ? 'bg-amber-500' : 'bg-white/10'}`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-white/10"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="custom-scrollbar h-[500px] overflow-y-auto p-8">
              {errorMessage && (
                <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {errorMessage}
                </div>
              )}

              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="mb-6 px-2 text-xs font-bold uppercase tracking-widest text-amber-500">
                    Odaberi uslugu
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => {
                          setErrorMessage('');
                          setSelectedService(service.id);
                          setStep(2);
                        }}
                        className={`group rounded-3xl border p-6 text-left transition-all ${selectedService === service.id ? 'border-amber-500 bg-amber-500 text-black' : 'border-white/5 bg-white/5 text-white hover:bg-white/10'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold tracking-tight">{service.name}</span>
                          <span className="font-mono">{service.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="mb-6 px-2 text-xs font-bold uppercase tracking-widest text-amber-500">
                    Odaberi majstora
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {stylists.map((stylist) => (
                      <button
                        key={stylist.id}
                        onClick={() => {
                          setErrorMessage('');
                          setSelectedStylist(stylist.id);
                          setStep(3);
                        }}
                        className={`group flex items-center gap-4 rounded-3xl border p-4 transition-all ${selectedStylist === stylist.id ? 'border-amber-500 bg-amber-500 text-black' : 'border-white/5 bg-white/5 text-white hover:bg-white/10'}`}
                      >
                        <Image
                          src={stylist.image}
                          alt={stylist.name}
                          width={56}
                          height={56}
                          sizes="56px"
                          className="h-14 w-14 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-left">
                          <p className="font-bold">{stylist.name}</p>
                          <p
                            className={`text-xs uppercase tracking-widest ${selectedStylist === stylist.id ? 'text-black/60' : 'text-amber-500'}`}
                          >
                            {stylist.specialty}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="mb-6 px-2 text-xs font-bold uppercase tracking-widest text-amber-500">
                    Odaberi datum i vrijeme
                  </h3>
                  <div className="grid gap-8">
                    <DatePopover
                      value={selectedDate}
                      minDate={minDate}
                      onChange={(value) => {
                        setErrorMessage('');
                        setSelectedDate(value);
                        setSelectedTime('');
                      }}
                      label="Datum termina"
                    />
                    {selectedDate ? (
                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                            Slobodna vremena
                          </p>
                          {isLoadingAvailability && (
                            <span className="text-xs text-white/40">Učitavanje...</span>
                          )}
                        </div>
                        {availableTimes.length > 0 ? (
                          <div className="grid grid-cols-4 gap-2">
                            {availableTimes.map((time) => (
                              <button
                                key={time}
                                onClick={() => {
                                  setErrorMessage('');
                                  setSelectedTime(time);
                                  setStep(4);
                                }}
                                className={`rounded-xl border p-3 text-center transition-all ${selectedTime === time ? 'border-amber-500 bg-amber-500 text-black' : 'border-white/5 bg-white/5 text-white hover:bg-white/10'}`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-white/45">
                            {isLoadingAvailability
                              ? 'Provjeravamo dostupnost termina za odabrani datum.'
                              : 'Nema slobodnih termina za taj datum. Odaberi drugi dan.'}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-white/40">
                        Nakon odabira datuma prikazat ćemo slobodna vremena.
                      </div>
                    )}
                    {selectedDate && (
                      <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                        Ukupno slotova u danu: {TIME_SLOTS.length}, slobodno: {availableTimes.length}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="py-10 text-center">
                  <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
                    <Scissors className="h-10 w-10 text-amber-500" />
                  </div>
                  <h3 className="mb-4 text-3xl font-light text-white">Potvrdi odabir</h3>
                  <div className="mx-auto max-w-sm space-y-4 rounded-[32px] border border-white/5 bg-white/5 p-8">
                    <p className="text-sm text-white/60">{services.find((s) => s.id === selectedService)?.name}</p>
                    <p className="text-xl font-bold text-amber-500">
                      s {stylists.find((s) => s.id === selectedStylist)?.name}
                    </p>
                    <div className="flex justify-center gap-4 text-sm text-white/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {selectedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {selectedTime}
                      </span>
                    </div>
                    <p className="mt-4 font-mono text-3xl text-white">
                      {services.find((s) => s.id === selectedService)?.price}
                    </p>
                  </div>

                  <div className="mx-auto mt-8 grid max-w-md gap-4 text-left">
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ime i prezime"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="E-mail adresa"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Broj telefona"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="mt-12 flex w-full items-center justify-center gap-3 rounded-full bg-amber-500 py-5 font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Spremanje...' : 'Potvrdi rezervaciju'}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </div>

            {step > 1 && step < 4 && (
              <div className="flex justify-start border-t border-white/5 p-8">
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white"
                >
                  Nazad
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
