import React from 'react';
import { Utensils, Wine, Users2, ShieldAlert } from 'lucide-react';
import { RestaurantSettings } from '../data/restaurantData';

interface AboutProps {
  settings: RestaurantSettings;
}

export const About: React.FC<AboutProps> = ({ settings }) => {
  const cards = [
    {
      icon: Utensils,
      title: "Dining",
      description: "Comfortable restaurant dining featuring freshly prepared Karnataka and Dhaba culinary specialties, seasoned gravies, crispy chicken starters, and hot vegetarian fare.",
      badge: "Traditional Flavors"
    },
    {
      icon: Wine,
      title: "Drinks",
      description: "Bar service offering chilled beers, spirits, and refreshing accompaniments, strictly subject to applicable Karnataka excise regulations and availability.",
      badge: "Licensed Bar"
    },
    {
      icon: Users2,
      title: "Good Times",
      description: "A relaxed, welcoming environment to meet friends, family, or unwind after highway travel across Chitradurga and Davanagere routes.",
      badge: "Social & Relaxed"
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#0c0c0e] relative border-t border-[#18181f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium mb-3">
            About Thirumala
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f5f5f0] font-normal leading-tight mb-6">
            A Place to Eat, Unwind & Connect.
          </h2>
          <p className="text-base sm:text-lg text-[#b0b0b8] leading-relaxed">
            Established in the Bharamasagara and Dyapanahalli region along the Chitradurga highway corridor, Thirumala Bar and Restaurant is dedicated to authentic tastes, hearty hospitality, and an unpretentious atmosphere where patrons can enjoy fresh food, cold beverages, and genuine comfort.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-[#121216] border border-[#202028] hover:border-[#383844] rounded-xl p-7 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-lg bg-[#1a1a22] border border-[#2a2a35] flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] text-[#8e8e98] tracking-wider uppercase font-mono">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif text-[#f2f2ee] font-medium mb-3 group-hover:text-[#e8c679] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#9c9ca6] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1a1a22] text-xs text-[#a0a0aa] font-medium">
                  {card.badge}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interior Highlight Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#111115] border border-[#1e1e26] rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-medium">
              Atmosphere & Hospitality
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#f5f5f0] leading-snug">
              Unassuming Comfort in Chitradurga
            </h3>
            <p className="text-sm text-[#a4a4b0] leading-relaxed">
              Whether you are stopping by during a journey along NH 48 or gathering with friends for an evening dinner, our dining spaces are laid out for relaxed seating and prompt table service.
            </p>
            <div className="pt-2 text-xs text-[#80808c] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Dedicated family and general seating sections available.</span>
            </div>
          </div>

          <div className="lg:col-span-7 overflow-hidden rounded-xl border border-[#262632] aspect-[16/10] bg-[#16161c]">
            <img
              src="/src/assets/images/about_hospitality_interior_1790318061709.jpg"
              alt="Thirumala Bar and Restaurant dining room"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
