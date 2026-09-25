import React, { useState, useMemo } from 'react';
import { Search, Flame, Sparkles, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { MenuItem } from '../data/restaurantData';

interface MenuSectionProps {
  menuItems: MenuItem[];
  onReserveClick: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ menuItems, onReserveClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFullMenuModal, setShowFullMenuModal] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'starters', label: 'Starters & Fries' },
    { id: 'biryani', label: 'Rice & Biryani' },
    { id: 'non-veg', label: 'Non-Vegetarian' },
    { id: 'veg', label: 'Vegetarian' },
    { id: 'snacks', label: 'Dhaba Snacks' },
    { id: 'beverages', label: 'Beverages & Bar' },
    { id: 'desserts', label: 'Desserts' },
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesVeg = !vegOnly || item.isVeg;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesVeg && matchesSearch;
    });
  }, [menuItems, selectedCategory, vegOnly, searchQuery]);

  return (
    <section id="menu" className="py-20 lg:py-28 bg-[#0c0c0e] relative border-t border-[#18181f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium mb-3">
            Culinary Offerings
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f5f5f0] font-normal mb-4">
            Our Digital Menu
          </h2>
          <p className="text-sm sm:text-base text-[#a0a0aa] leading-relaxed">
            From the beloved Karnataka Chicken Pepper Fry and fragrant biryani to vegetarian specials and quick Dhaba snacks. Prices are indicative client placeholders subject to seasonal availability.
          </p>
        </div>

        {/* Signature Dish Highlight Box */}
        <div className="mb-14 bg-gradient-to-r from-[#141419] to-[#101014] border border-[#23232c] rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-8 shadow-xl">
          <div className="w-full lg:w-5/12 aspect-[4/3] rounded-xl overflow-hidden border border-[#2b2b36] bg-[#0c0c0e]">
            <img
              src="/src/assets/images/dish_chicken_pepper_fry_1790318074413.jpg"
              alt="Karnataka Chicken Pepper Fry signature dish"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="w-full lg:w-7/12 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold bg-[#2a2315] px-2.5 py-1 rounded border border-[#4d3c1d]">
                Customer Favorite · Verified Rating
              </span>
              <span className="text-xs text-[#80808c]">• Non-Vegetarian</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#f5f5f0]">
              Karnataka Country Chicken Pepper Fry
            </h3>
            <p className="text-sm text-[#9c9ca8] leading-relaxed">
              Tender chicken dry-roasted in roasted black peppercorns, fresh curry leaves from the garden, crushed ginger-garlic, and local Chitradurga highway spices. Crisp on the outside, succulent inside.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <div className="text-xl font-medium text-[#e8c679] font-mono">
                ₹240 <span className="text-xs text-[#70707a] font-sans">/ portion</span>
              </div>
              <button
                onClick={onReserveClick}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#d4af37] text-black hover:bg-[#e8c679] rounded-lg transition-colors cursor-pointer"
              >
                Reserve Table for Dinner
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#757582] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes (e.g. Pepper Fry, Biryani, Paneer)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#121217] border border-[#22222c] focus:border-[#d4af37] rounded-lg text-sm text-[#e4e4eb] placeholder-[#60606b] focus:outline-none transition-colors"
              />
            </div>

            {/* Veg Only Toggle & View Full Menu Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  vegOnly
                    ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-400'
                    : 'bg-[#14141a] border-[#252530] text-[#a0a0ab] hover:text-white'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full border border-emerald-500 flex items-center justify-center p-0.5">
                  <span className={`w-1 h-1 rounded-full ${vegOnly ? 'bg-emerald-400' : 'bg-transparent'}`} />
                </span>
                <span>Pure Veg Only</span>
              </button>

              <button
                onClick={() => setShowFullMenuModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-[#181820] hover:bg-[#22222a] border border-[#2e2e38] text-[#e0e0e6] transition-colors cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>View Full Menu</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#d4af37] text-black font-semibold shadow-sm'
                    : 'bg-[#121217] text-[#90909c] hover:text-[#e0e0e6] hover:bg-[#1a1a22] border border-[#1e1e26]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#101014] border border-[#1d1d24] rounded-xl p-8">
            <AlertCircle className="w-8 h-8 text-[#80808c] mx-auto mb-3" />
            <p className="text-[#a0a0aa] text-sm">No dishes match your selected filter or search term.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setVegOnly(false);
                setSearchQuery('');
              }}
              className="mt-4 text-xs font-semibold text-[#d4af37] hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#111116] border border-[#1e1e26] hover:border-[#323240] rounded-xl p-5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {/* Standard FSSAI Indian Veg / Non-Veg Indicator */}
                      <span
                        className={`w-4 h-4 rounded-sm border flex items-center justify-center p-0.5 shrink-0 ${
                          item.isVeg ? 'border-emerald-600' : 'border-red-600'
                        }`}
                        title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        />
                      </span>
                      
                      <h4 className="font-serif text-lg text-[#f0f0ee] font-medium leading-snug">
                        {item.name}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-sm font-semibold text-[#e8c679]">
                        ₹{item.price}
                      </span>
                      {item.isPricePlaceholder && (
                        <span className="block text-[10px] text-[#787884] font-sans">
                          Indicative
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#8e8e99] leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1a1a22] text-[11px] text-[#757582]">
                  <div className="flex items-center gap-2">
                    {item.tag && (
                      <span className="text-[#d4af37] font-medium">
                        {item.tag}
                      </span>
                    )}
                    {item.spicyLevel && item.spicyLevel > 1 && (
                      <span className="flex items-center gap-0.5 text-amber-500/80">
                        <Flame className="w-3 h-3" />
                        <span>Spicy</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[#555560] uppercase tracking-wider text-[10px]">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Full Menu CTA Card */}
        <div className="mt-14 text-center p-8 bg-[#101015] border border-[#20202a] rounded-2xl max-w-2xl mx-auto space-y-4">
          <Sparkles className="w-6 h-6 text-[#d4af37] mx-auto" />
          <h4 className="text-xl font-serif text-[#f5f5f0]">
            Looking for something specific?
          </h4>
          <p className="text-xs sm:text-sm text-[#9595a0] max-w-lg mx-auto">
            Our kitchen prepares fresh batches daily. Specialty fish, seasonal game, and select cuts are available based on market supply.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setShowFullMenuModal(true)}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#d4af37] hover:bg-[#e8c679] rounded-lg transition-colors cursor-pointer"
            >
              Open Full Menu Sheet
            </button>
            <button
              onClick={onReserveClick}
              className="px-5 py-2.5 text-xs font-medium text-[#e0e0e6] bg-[#1a1a22] hover:bg-[#252530] border border-[#2e2e38] rounded-lg transition-colors cursor-pointer"
            >
              Reserve for Lunch or Dinner
            </button>
          </div>
        </div>

      </div>

      {/* Full Menu Modal */}
      {showFullMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121217] border border-[#2b2b36] rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#22222c] flex items-center justify-between bg-[#15151b]">
              <div>
                <h3 className="font-serif text-xl text-[#f5f5f0]">
                  Thirumala Bar & Restaurant — Complete Digital Menu
                </h3>
                <p className="text-xs text-[#8e8e98]">
                  Bharamasagara, Chitradurga · All taxes inclusive where applicable
                </p>
              </div>
              <button
                onClick={() => setShowFullMenuModal(false)}
                className="text-[#9595a0] hover:text-white p-1 text-sm rounded-lg hover:bg-[#202028]"
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="p-3.5 bg-[#181820] border border-[#282834] rounded-lg text-xs text-[#a0a0aa] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>
                  Items are cooked fresh to order. Please allow 15–20 minutes preparation time for roasted specialities.
                </span>
              </div>

              <div className="divide-y divide-[#1e1e28]">
                {menuItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center p-0.5 shrink-0 ${
                          item.isVeg ? 'border-emerald-600' : 'border-red-600'
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        />
                      </span>
                      <div>
                        <div className="text-sm font-medium text-[#ededeb]">{item.name}</div>
                        <div className="text-xs text-[#80808c]">{item.description}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 font-mono text-sm text-[#e8c679]">
                      ₹{item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#22222c] bg-[#15151b] flex items-center justify-between">
              <span className="text-xs text-[#70707a]">
                Alcoholic beverages strictly 21+ only as per Karnataka laws.
              </span>
              <button
                onClick={() => {
                  setShowFullMenuModal(false);
                  onReserveClick();
                }}
                className="px-4 py-2 text-xs font-semibold text-black bg-[#d4af37] hover:bg-[#e8c679] rounded-lg cursor-pointer"
              >
                Proceed to Table Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
