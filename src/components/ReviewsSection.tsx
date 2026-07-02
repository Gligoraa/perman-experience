import React from 'react';
import { Star } from 'lucide-react';
import { businessData } from '../config/business-config';

export const ReviewsSection = () => {
  return (
    <section id="reviews" className="bg-zinc-900 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-light text-white">{'\u0160to ka\u017eu na\u0161i klijenti'}</h2>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 fill-current text-amber-500" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {businessData.reviews.map((review, i) => (
            <div
              key={i}
              className="relative rounded-3xl border border-white/5 bg-black/40 p-10"
            >
              <div className="absolute left-6 top-6 text-4xl font-serif text-amber-500/20">
                &quot;
              </div>
              <p className="relative z-10 mb-8 italic text-white/70">{review.text}</p>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-500">
                  {review.name.charAt(0)}
                </div>
                <span className="font-medium text-white">{review.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
