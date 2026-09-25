import React from 'react';
import { UtensilsCrossed, Wine, CalendarCheck, Users, ShoppingBag, PartyPopper } from 'lucide-react';

interface ServicesProps {
  onReserveClick: () => void;
  onMenuClick: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onReserveClick, onMenuClick }) => {
  const services = [
    {
      icon: UtensilsCrossed,
      title: "Restaurant Dining",
      description: "Daily lunch and dinner service featuring authentic Karnataka-style non-veg fries, gravies, tandoori preparations, and vegetarian thali options.",
      actionLabel: "View Menu",
      action: onMenuClick
    },
    {
      icon: Wine,
      title: "Bar Service",
      description: "Chilled draught and bottled beers, spirits, and traditional roadside dhaba snacks served strictly in compliance with Karnataka excise laws (21+).",
      actionLabel: "Drink Policy",
      action: onReserveClick
    },
    {
      icon: CalendarCheck,
      title: "Table Reservations",
      description: "Advance table booking to guarantee immediate seating for your party during busy evening dinner hours and weekend road trips.",
      actionLabel: "Book Now",
      action: onReserveClick
    },
    {
      icon: Users,
      title: "Group Dining",
      description: "Spacious combined seating arrangements for groups of 6 to 16+ guests, office outings, and road-trip convoy stopovers.",
      actionLabel: "Plan Group",
      action: onReserveClick
    },
    {
      icon: ShoppingBag,
      title: "Highway Takeaway",
      description: "Speedy parcel and takeaway service for travelers passing through the Bharamasagara NH 48 highway corridor.",
      actionLabel: "Call to Order",
      action: onMenuClick
    },
    {
      icon: PartyPopper,
      title: "Special Occasions",
      description: "Personalized arrangements for birthdays, informal celebrations, and family anniversary dinners with advance table reservations.",
      actionLabel: "Enquire",
      action: onReserveClick
    }
  ];

  return (
    <section className="py-20 bg-[#0a0a0c] border-t border-[#18181f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium block mb-2">
              Our Offerings
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f5f0] font-normal">
              Hospitality Services & Dining Experiences
            </h2>
          </div>
          <p className="text-sm text-[#8c8c96] max-w-sm">
            Designed for travelers on NH 48 and local diners in Chitradurga seeking prompt hospitality and wholesome food.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-[#101014] border border-[#1e1e26] hover:border-[#33333f] rounded-xl p-6 transition-all duration-200 flex flex-col justify-between hover:translate-y-[-2px]"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#181820] text-[#d4af37] flex items-center justify-center mb-4 border border-[#262632]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-serif text-[#f0f0ee] font-medium mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8f8f99] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={item.action}
                  className="inline-flex items-center text-xs font-semibold text-[#d4af37] hover:text-[#f0d48f] transition-colors gap-1.5 focus:outline-none cursor-pointer self-start"
                >
                  <span>{item.actionLabel}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
