import React, { useMemo } from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Navigation,
  Mail,
  Car,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { RestaurantSettings } from '../data/restaurantData';
import { isCurrentlyOpen } from '../utils/storage';

interface ContactAndMapSectionProps {
  settings: RestaurantSettings;
  onOpenAdmin: () => void;
}

export const ContactAndMapSection: React.FC<ContactAndMapSectionProps> = ({ settings, onOpenAdmin }) => {
  const status = useMemo(() => isCurrentlyOpen(settings), [settings]);

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#0a0a0d] border-t border-[#1a1a22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium block mb-2">
            Location & Contact
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f5f5f0] font-normal mb-3">
            Visit Thirumala in Bharamasagara
          </h2>
          <p className="text-sm sm:text-base text-[#9e9ea8] leading-relaxed">
            Conveniently accessible off National Highway 48 (Pune–Bengaluru corridor) at Dyapanahalli cross, Chitradurga district.
          </p>
        </div>

        {/* Contact Info & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Operational Status Box */}
            <div className="p-4 rounded-xl bg-[#14141a] border border-[#23232c] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <div>
                  <div className="text-xs font-semibold text-[#ededeb]">
                    {status.isOpen ? "Open for Dine-In & Bar Service" : "Currently Closed"}
                  </div>
                  <div className="text-[11px] text-[#8e8e98]">
                    {status.nextStatusText}
                  </div>
                </div>
              </div>
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-[#d4af37] hover:underline"
              >
                Edit Info
              </button>
            </div>

            {/* Address Card */}
            <div className="bg-[#121217] border border-[#1e1e26] rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#181820] text-[#d4af37] flex items-center justify-center shrink-0 border border-[#262632]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif text-[#f5f5f0] font-medium">
                    {settings.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9c9ca6] mt-1 leading-relaxed">
                    {settings.address}
                    <br />
                    {settings.landmark}
                    <br />
                    {settings.city}, {settings.district} District, {settings.state} – {settings.pincode}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1a1a22] flex flex-wrap gap-2 text-xs">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#d4af37] text-black font-semibold hover:bg-[#e8c679] transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions on Google Maps</span>
                </a>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="p-4 rounded-xl bg-[#121217] border border-[#1e1e26] hover:border-[#33333f] flex items-center gap-3 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#181820] text-[#d4af37] flex items-center justify-center shrink-0 border border-[#262632] group-hover:bg-[#d4af37] group-hover:text-black transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#757582] block">
                    Call Directly
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#ededeb]">
                    {settings.phone}
                  </span>
                </div>
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Hello Thirumala Bar & Restaurant, I have a dining inquiry.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#121217] border border-[#1e1e26] hover:border-[#33333f] flex items-center gap-3 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#181820] text-emerald-400 flex items-center justify-center shrink-0 border border-[#262632] group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#757582] block">
                    WhatsApp Chat
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#ededeb]">
                    Quick Inquiry
                  </span>
                </div>
              </a>
            </div>

            {/* Travel & Highway Amenities */}
            <div className="p-5 rounded-xl bg-[#121217] border border-[#1e1e26] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                Visitor & Highway Access Tips
              </h4>
              <div className="space-y-2 text-xs text-[#8e8e98]">
                <div className="flex items-start gap-2">
                  <Car className="w-4 h-4 text-[#a0a0aa] shrink-0 mt-0.5" />
                  <span>Ample road-side and designated parking available for cars and motorcycles.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a0a0aa] shrink-0 mt-0.5" />
                  <span>Located approximately 25 km north of Chitradurga Fort / city center on NH 48.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#a0a0aa] shrink-0 mt-0.5" />
                  <span>Kitchen accepts last food orders up to 10:30 PM daily.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Embedded Google Maps Column */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl overflow-hidden border border-[#23232e] bg-[#14141a] shadow-2xl relative aspect-[4/3] lg:aspect-[16/11]">
              <iframe
                title="Thirumala Bar and Restaurant Bharamasagara Chitradurga Google Map"
                src="https://maps.google.com/maps?q=Bharamasagara,+Chitradurga,+Karnataka&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter grayscale-[40%] contrast-[110%] invert-[90%] hue-rotate-180"
                loading="lazy"
                allowFullScreen
              />
              
              {/* Overlay card for verified listing */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-[#0c0c0e]/95 backdrop-blur-md p-4 rounded-xl border border-[#2b2b36] shadow-xl">
                <div className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold flex items-center justify-between">
                  <span>Verified Maps Landmark</span>
                  <span>3.9 ★</span>
                </div>
                <div className="font-serif text-sm font-semibold text-[#f5f5f0] mt-1">
                  Thirumala Bar and Restaurant
                </div>
                <div className="text-[11px] text-[#90909c] mt-0.5">
                  Bharamasagara / Dyapanahalli corridor, Chitradurga
                </div>
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-[#e8c679] hover:underline font-medium"
                >
                  <span>Open in Google Maps App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
