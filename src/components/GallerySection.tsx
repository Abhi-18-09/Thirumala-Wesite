import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { galleryItems } from '../data/restaurantData';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Interior', 'Food', 'Drinks', 'Dining', 'Atmosphere'];

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, showNext, showPrev]);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#0c0c0e] border-t border-[#18181f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium block mb-2">
              Visual Impressions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f5f5f0] font-normal">
              Atmosphere & Specialties
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#d4af37] text-black font-semibold'
                    : 'bg-[#141419] text-[#8e8e98] hover:text-[#ededeb] border border-[#202028]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-xl overflow-hidden bg-[#14141a] border border-[#22222c] cursor-pointer aspect-[4/3] shadow-md"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              
              {/* Overlay with Title & Category */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-5">
                <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1">
                  {item.category}
                </span>
                <h3 className="text-base font-serif text-[#f5f5f0] font-medium flex items-center justify-between">
                  <span>{item.title}</span>
                  <Maximize2 className="w-4 h-4 text-[#a0a0ab] group-hover:text-white transition-colors" />
                </h3>
                <p className="text-xs text-[#a0a0ab] line-clamp-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Photography Reference Note */}
        <div className="mt-8 text-center text-xs text-[#70707a]">
          Visuals depict the genuine dining, signature chicken preparations, and relaxed lounge ambiance at Thirumala Bar & Restaurant.
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
          
          {/* Top Controls */}
          <div className="absolute top-5 right-5 z-20 flex items-center gap-3">
            <span className="text-xs text-[#8e8e98] font-mono">
              {lightboxIndex + 1} / {filteredItems.length}
            </span>
            <button
              onClick={closeLightbox}
              className="w-10 h-10 rounded-full bg-[#181820] text-white hover:bg-[#282834] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close image viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            onClick={showPrev}
            className="absolute left-4 sm:left-6 z-20 w-11 h-11 rounded-full bg-[#181820]/80 hover:bg-[#282834] text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Main Image Container */}
          <div className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center p-2">
            <img
              src={filteredItems[lightboxIndex].image}
              alt={filteredItems[lightboxIndex].title}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
            />
            <div className="mt-4 text-center">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                {filteredItems[lightboxIndex].category}
              </span>
              <h4 className="text-lg font-serif text-[#f5f5f0] mt-0.5">
                {filteredItems[lightboxIndex].title}
              </h4>
              <p className="text-xs text-[#a0a0ab] mt-1 max-w-lg mx-auto">
                {filteredItems[lightboxIndex].description}
              </p>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={showNext}
            className="absolute right-4 sm:right-6 z-20 w-11 h-11 rounded-full bg-[#181820]/80 hover:bg-[#282834] text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};
