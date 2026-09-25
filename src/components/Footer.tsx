import React from 'react';
import { SlidersHorizontal, MapPin, Phone, ShieldAlert, Heart } from 'lucide-react';
import { RestaurantSettings } from '../data/restaurantData';

interface FooterProps {
  settings: RestaurantSettings;
  onOpenAdmin: () => void;
  onOpenLegal: () => void;
  onOpenSupabase: () => void;
  onOpenDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onOpenLegal,
  onOpenSupabase,
  onOpenDashboard
}) => {
  return (
    <footer className="bg-[#08080a] border-t border-[#181820] text-[#a0a0ab] pt-16 pb-24 md:pb-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#181822]">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div>
              <span className="font-serif text-2xl tracking-wider text-[#f5f5f0] uppercase font-semibold block">
                THIRUMALA
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#80808c] uppercase font-sans font-medium">
                BAR & RESTAURANT
              </span>
            </div>
            <p className="text-[#888894] text-xs leading-relaxed">
              Food • Drinks • Good Times
            </p>
            <p className="text-[#787884] text-xs leading-relaxed">
              A welcoming destination for travelers on NH 48 and patrons across Bharamasagara and Chitradurga.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm text-[#ededeb] uppercase tracking-wider font-semibold">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="hover:text-[#d4af37] transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#d4af37] transition-colors">About Experience</a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#d4af37] transition-colors">Digital Menu</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#d4af37] transition-colors">Visual Gallery</a>
              </li>
              <li>
                <a href="#reserve" className="hover:text-[#d4af37] transition-colors">Book a Table</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#d4af37] transition-colors">Find on Google Maps</a>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm text-[#ededeb] uppercase tracking-wider font-semibold">
              Hospitality Hours
            </h4>
            <p className="text-xs text-[#8e8e98] leading-relaxed">
              Monday through Sunday
              <br />
              <span className="text-[#ededeb] font-mono">{settings.openingHours}</span>
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-[#888894]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-[#ededeb]">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Bharamasagara, Chitradurga – 577519</span>
              </div>
            </div>
          </div>

          {/* Legal Advisory & Policy */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm text-[#ededeb] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Legal Notice (Karnataka)</span>
            </h4>
            <p className="text-[11px] text-[#787884] leading-relaxed">
              Alcoholic beverages are strictly served only to patrons who have attained the legal drinking age of 21 years under the Karnataka Excise regulations. Valid photo identification required.
            </p>
            <div className="pt-1 flex flex-wrap gap-3 text-[11px]">
              <button
                onClick={onOpenDashboard}
                className="text-[#f5f5f0] hover:text-[#d4af37] font-semibold flex items-center gap-1 cursor-pointer bg-[#181822] px-2.5 py-1 rounded border border-[#2e2e3c]"
              >
                <span>Admin Dashboard</span>
              </button>
              <button
                onClick={onOpenLegal}
                className="text-[#d4af37] hover:underline cursor-pointer"
              >
                Compliance & Terms
              </button>
              <button
                onClick={onOpenSupabase}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Supabase Live</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              </button>
              <button
                onClick={onOpenAdmin}
                className="text-[#888894] hover:text-[#d4af37] flex items-center gap-1 cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Owner Config</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#60606b]">
          <div>
            © 2026 Thirumala Bar & Restaurant. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#90909c] transition-colors"
            >
              Google Maps Listing
            </a>
            <span>·</span>
            <span>Local Highway Hospitality · Chitradurga, Karnataka</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
