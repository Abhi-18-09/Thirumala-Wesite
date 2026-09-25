import React from 'react';
import { Calendar, Phone, Navigation } from 'lucide-react';
import { RestaurantSettings } from '../data/restaurantData';

interface StickyMobileBarProps {
  settings: RestaurantSettings;
  onBookClick: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({ settings, onBookClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0c0c0e]/95 backdrop-blur-lg border-t border-[#252530] px-3 py-2.5 shadow-2xl">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Call button */}
        <a
          href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#181820] active:bg-[#252530] text-[#e0e0e6] border border-[#2e2e3a] rounded-lg text-xs font-medium"
        >
          <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Call</span>
        </a>

        {/* Directions button */}
        <a
          href={settings.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#181820] active:bg-[#252530] text-[#e0e0e6] border border-[#2e2e3a] rounded-lg text-xs font-medium"
        >
          <Navigation className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Map</span>
        </a>

        {/* Reserve button */}
        <button
          onClick={onBookClick}
          className="flex-[2] flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gradient-to-r from-[#e8c679] to-[#c59e47] active:scale-[0.98] text-black rounded-lg text-xs font-bold uppercase tracking-wider shadow-md shadow-[#c59e47]/20"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Table</span>
        </button>
      </div>
    </div>
  );
};
