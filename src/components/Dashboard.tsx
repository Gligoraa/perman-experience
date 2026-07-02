import React from 'react';
import { Calendar, History } from 'lucide-react';
import { Appointment } from '../config/business-config';

export const Dashboard = ({ bookings }: { bookings: Appointment[] }) => {
  return (
    <div className="min-h-screen bg-black px-6 pb-24 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-start gap-8 lg:flex-row">
          <div className="flex-1">
            <h1 className="mb-2 text-4xl font-light text-white">{'Nadzorna plo\u010da'}</h1>
            <p className="text-white/40">{'Upravljajte svojim terminima i povije\u0161\u0107u dolazaka.'}</p>
          </div>
          <div className="flex items-center gap-4 rounded-3xl border border-white/5 bg-zinc-900/50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-xl font-bold text-black">
              G
            </div>
            <div>
              <p className="font-bold text-white">Gost</p>
              <p className="text-xs text-white/40">GUEST@EXAMPLE.COM</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-white/5 bg-zinc-950 p-8">
              <div className="mb-8 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-amber-500" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                  {'Predstoje\u0107e'}
                </h2>
              </div>
              <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/5 bg-black/40 p-8 text-center">
                <p className="mb-4 font-light italic text-white/20">
                  {'Nema zakazanih predstoje\u0107ih termina.'}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/5 bg-zinc-950 p-8">
              <div className="mb-8 flex items-center gap-3">
                <History className="h-5 w-5 text-amber-500" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                  Povijest
                </h2>
              </div>
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/40 p-8">
                <p className="font-light italic text-white/20">{'Nema pro\u0161lih termina.'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-white/5 bg-zinc-900 p-8">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
                Brza statistika
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-white/40">
                    Ukupno dolazaka
                  </span>
                  <span className="font-mono text-xl text-white">{bookings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-white/40">
                    Bodovi vjernosti
                  </span>
                  <span className="font-mono text-xl text-amber-500">{bookings.length * 150}</span>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[60%] bg-amber-500" />
                  </div>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-white/40">
                    {'Jo\u0161 4 dolaska do besplatnog \u0161i\u0161anja'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
