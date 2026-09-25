import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { MenuSection } from './components/MenuSection';
import { ReservationSection } from './components/ReservationSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { GroupEventsSection } from './components/GroupEventsSection';
import { ContactAndMapSection } from './components/ContactAndMapSection';
import { Footer } from './components/Footer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { AdminEditModal } from './components/AdminEditModal';
import { LegalNoticeModal } from './components/LegalNoticeModal';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { AdminDashboard } from './components/AdminDashboard';
import {
  RestaurantSettings,
  defaultRestaurantSettings,
  MenuItem,
  initialMenuItems
} from './data/restaurantData';
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredMenu
} from './utils/storage';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<RestaurantSettings>(defaultRestaurantSettings);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  useEffect(() => {
    setSettings(getStoredSettings());
    setMenuItems(getStoredMenu());
  }, []);

  const handleSaveSettings = (updated: RestaurantSettings) => {
    setSettings(updated);
    saveStoredSettings(updated);
  };

  const scrollToReserve = () => {
    const el = document.getElementById('reserve');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#ededeb] flex flex-col font-sans selection:bg-[#d4af37] selection:text-black">
      
      {/* Top Navbar */}
      <Navbar
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBooking={scrollToReserve}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
        onOpenDashboard={() => setIsAdminDashboardOpen(true)}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          settings={settings}
          heroImage="/src/assets/images/hero_restaurant_dining_1790318044335.jpg"
          onReserveClick={scrollToReserve}
        />

        {/* Responsible Service Notice Ribbon */}
        <div className="bg-[#121217] border-y border-[#1e1e26] py-2 px-4 text-center text-xs text-[#8e8e98] flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
          <span>
            Compliant with Karnataka Excise Regulations · Bar service strictly 21+ with photo ID · Please drink responsibly
          </span>
          <button
            onClick={() => setIsLegalOpen(true)}
            className="text-[#d4af37] hover:underline ml-1 font-medium cursor-pointer"
          >
            Details
          </button>
        </div>

        {/* About Section */}
        <About settings={settings} />

        {/* Services & Experience */}
        <Services
          onReserveClick={scrollToReserve}
          onMenuClick={scrollToMenu}
        />

        {/* Digital Menu Section */}
        <MenuSection
          menuItems={menuItems}
          onReserveClick={scrollToReserve}
        />

        {/* Gallery Section */}
        <GallerySection />

        {/* Table Reservation System */}
        <ReservationSection
          settings={settings}
          onOpenSupabaseModal={() => setIsSupabaseOpen(true)}
        />

        {/* Group Events & Celebrations */}
        <GroupEventsSection settings={settings} />

        {/* Verified Google Reviews */}
        <ReviewsSection settings={settings} />

        {/* Contact & Google Maps */}
        <ContactAndMapSection
          settings={settings}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLegal={() => setIsLegalOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
        onOpenDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Mobile Sticky Bar (<15% viewport height) */}
      <StickyMobileBar
        settings={settings}
        onBookClick={scrollToReserve}
      />

      {/* Admin / Owner Customizer Modal */}
      <AdminEditModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

      {/* Legal & Compliance Modal */}
      <LegalNoticeModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        settings={settings}
      />

      {/* Supabase Integration & Setup Guide Modal */}
      <SupabaseSetupModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />

      {/* Complete Admin Booking Dashboard */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        settings={settings}
      />

    </div>
  );
}
