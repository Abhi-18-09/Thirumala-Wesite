import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Menu as MenuIcon, X, SlidersHorizontal, MapPin, Database, LayoutDashboard } from 'lucide-react';
import { RestaurantSettings } from '../data/restaurantData';

interface NavbarProps {
  settings: RestaurantSettings;
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
  onOpenSupabase: () => void;
  onOpenDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenAdmin,
  onOpenBooking,
  onOpenSupabase,
  onOpenDashboard
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Menu', href: '#menu' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reserve', href: '#reserve' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0c0c0e]/95 backdrop-blur-md border-b border-[#25252b] py-3.5 shadow-xl shadow-black/40'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <a
          href="#home"
          className="group flex flex-col text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#d4af37]"
        >
          <span className="font-serif text-2xl sm:text-3xl tracking-wider text-[#f5f5f0] group-hover:text-[#e8c679] transition-colors uppercase font-semibold">
            THIRUMALA
          </span>
          <span className="text-[10px] tracking-[0.25em] text-[#a0a0a8] uppercase font-sans -mt-1 font-medium">
            BAR & RESTAURANT
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#c4c4cc]">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-[#f5f5f0] transition-colors relative py-1 focus:outline-none focus-visible:text-[#d4af37]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onOpenDashboard}
            title="Open Admin Dashboard (View & Manage Bookings)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#f5f5f0] bg-[#1a1a24] hover:bg-[#252532] border border-[#343444] rounded-lg transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Admin Panel</span>
          </button>

          <button
            onClick={onOpenSupabase}
            title="Supabase Database Status (Project: luiugpgtznbcszvlyrck)"
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-[#a0a0ab] hover:text-white bg-[#14141a] hover:bg-[#1c1c24] border border-[#252530] rounded-lg transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={onOpenAdmin}
            title="Edit business information & settings"
            className="p-1.5 text-[#9999a3] hover:text-[#d4af37] hover:bg-[#1a1a20] rounded-lg transition-colors border border-transparent hover:border-[#2a2a32]"
            aria-label="Edit business settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          
          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#e2e2e8] bg-[#18181d] hover:bg-[#22222a] border border-[#2b2b34] rounded-lg transition-colors whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Call</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#e8c679] to-[#c59e47] hover:from-[#f0d48f] hover:to-[#d4af37] rounded-lg shadow-md shadow-[#c59e47]/15 transition-all duration-200 active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Table</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            onClick={onOpenDashboard}
            className="p-1.5 text-[#d4af37]"
            title="Admin Dashboard"
            aria-label="Admin Dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSupabase}
            className="p-1.5 text-emerald-400"
            aria-label="Supabase Status"
          >
            <Database className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenAdmin}
            className="p-1.5 text-[#a0a0a8] hover:text-[#d4af37]"
            aria-label="Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#e2e2e8] hover:text-[#f5f5f0] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0c0e]/98 border-b border-[#222228] px-5 py-6 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs text-[#a0a0a8] pb-3 border-b border-[#1c1c24]">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{settings.address}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-[#d4d4dc] hover:text-white hover:bg-[#1a1a22] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-[#1c1c24] flex gap-2">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="flex-1 py-2.5 text-center text-xs font-medium text-[#e2e2e8] bg-[#1a1a22] border border-[#2e2e38] rounded-lg"
            >
              Call Restaurant
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="flex-1 py-2.5 text-center text-xs font-semibold text-black bg-[#d4af37] rounded-lg"
            >
              Reserve Table
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
