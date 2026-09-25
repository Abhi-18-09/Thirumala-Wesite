import React from 'react';
import { Star, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import { initialReviews, RestaurantSettings } from '../data/restaurantData';

interface ReviewsSectionProps {
  settings: RestaurantSettings;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ settings }) => {
  return (
    <section className="py-20 bg-[#0a0a0c] border-t border-[#18181f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Rating Overview */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-14 bg-[#111116] border border-[#202028] rounded-2xl p-6 sm:p-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium block mb-2">
              Customer Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f5f0] font-normal mb-2">
              Ratings & Road-Trip Impressions
            </h2>
            <p className="text-xs sm:text-sm text-[#9595a0] max-w-xl">
              Authentic reviews from travelers, locals, and patrons visiting our Bharamasagara highway location.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#1f1f28]">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-serif font-bold text-[#e8c679]">
                {settings.googleRating}
              </div>
              <div>
                <div className="flex items-center text-[#d4af37]">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-[#d4af37]" />
                  ))}
                  <Star className="w-4 h-4 fill-[#d4af37]/40" />
                </div>
                <div className="text-xs text-[#8c8c98] mt-0.5">
                  Based on {settings.reviewCount}+ Google reviews
                </div>
              </div>
            </div>

            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#f5f5f0] bg-[#181820] hover:bg-[#22222c] border border-[#2c2c38] transition-colors whitespace-nowrap"
            >
              <span>See us on Google</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
            </a>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#111116] border border-[#1e1e26] rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-[#d4af37]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#70707a] font-mono">
                    {rev.date}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#b0b0b8] leading-relaxed mb-6 italic">
                  "{rev.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#1a1a22] flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#ededeb]">
                    {rev.author}
                  </div>
                  <div className="text-[11px] text-[#6d6d7a] flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
                    <span>Verified Highway Patron</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Honest Review Disclaimer */}
        <div className="mt-8 text-center text-xs text-[#70707a]">
          Reviews reflect genuine public feedback. We continually refine our service timing and kitchen speed during peak highway hours.
        </div>

      </div>
    </section>
  );
};
