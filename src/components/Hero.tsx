import React from 'react';
import { Calendar, Navigation, MapPin, ChevronDown, Clock, ShieldCheck } from 'lucide-react';
import { RestaurantSettings } from '../data/restaurantData';

interface HeroProps {
  settings: RestaurantSettings;
  heroImage: string;
  onReserveClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, heroImage, onReserveClick }) => {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0a0a0c]"
    >
      {/* Background Image with Dark Cinematic Overlay */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src={heroImage}
          alt="Thirumala Bar and Restaurant interior ambiance"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 animate-in fade-in duration-1000"
          onError={(e) => {
            // Elegant CSS gradient fallback
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Measured dark gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/75 to-black/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0c0c0e]/50 to-[#0c0c0e]/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Location & Highway Trust Marker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18181f]/80 backdrop-blur-md border border-[#2e2e38] text-[#d4af37] text-xs font-medium tracking-wide mb-6">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#e8c679]" />
          <span>Bharamasagara, Chitradurga, Karnataka</span>
          <span className="text-[#686872] hidden sm:inline">·</span>
          <span className="text-[#a6a6b2] hidden sm:inline">NH 48 Corridor</span>
        </div>

        {/* Business Name */}
        <h1 className="text-xs uppercase tracking-[0.3em] text-[#b8b8c2] font-medium mb-3">
          THIRUMALA BAR & RESTAURANT
        </h1>

        {/* Main Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#f8f8f6] font-normal leading-[1.12] tracking-tight mb-5 max-w-3xl text-balance">
          Good Food. Great Company. Memorable Evenings.
        </h2>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg md:text-xl text-[#c7c7cf] font-light max-w-2xl leading-relaxed mb-8 text-balance">
          A welcoming destination for food, drinks and relaxed dining in Bharamasagara. Serving signature Karnataka specialties, dhaba flavors, and cold refreshments.
        </p>

        {/* Primary and Secondary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 w-full sm:w-auto">
          <button
            onClick={onReserveClick}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#e8c679] via-[#d4af37] to-[#c59e47] hover:from-[#f3da97] hover:to-[#d4af37] rounded-lg shadow-lg shadow-[#c59e47]/20 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Reserve a Table</span>
          </button>

          <a
            href={settings.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-medium text-[#e2e2e8] bg-[#1a1a22]/90 hover:bg-[#252530] border border-[#30303c] rounded-lg transition-all duration-200 hover:border-[#4a4a58]"
          >
            <Navigation className="w-4 h-4 text-[#d4af37]" />
            <span>Get Directions</span>
          </a>
        </div>

        {/* Quick Trust Highlights */}
        <div className="mt-10 pt-6 border-t border-[#23232c]/80 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#9a9aa5]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{settings.openingHours}</span>
          </div>
          <span className="hidden sm:inline text-[#3a3a44]">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#e8c679] font-medium">★ {settings.googleRating}</span>
            <span>Google Reviews ({settings.reviewCount}+ ratings)</span>
          </div>
          <span className="hidden sm:inline text-[#3a3a44]">·</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#a0a0a8]" />
            <span>Age 21+ for Bar Service</span>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <a
        href="#about"
        aria-label="Scroll down to About section"
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-[#80808c] hover:text-[#d4af37] transition-colors focus:outline-none"
      >
        <span className="text-[10px] tracking-widest uppercase font-mono">SCROLL</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
};
