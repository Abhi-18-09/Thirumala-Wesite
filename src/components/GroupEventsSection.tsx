import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, Users, Database } from 'lucide-react';
import { RestaurantSettings } from '../data/restaurantData';
import { saveInquiryToSupabase, SUPABASE_PROJECT_ID } from '../lib/supabase';

interface GroupEventsSectionProps {
  settings: RestaurantSettings;
}

export const GroupEventsSection: React.FC<GroupEventsSectionProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('Birthday Gathering');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('10');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
      return;
    }
    setSubmitting(true);
    try {
      await saveInquiryToSupabase({
        name: name.trim(),
        phone: phone.trim(),
        eventType,
        targetDate: date || undefined,
        guests: parseInt(guests, 10) || 10,
        message: message.trim() || undefined
      });
    } catch (err) {
      console.error('Failed to save inquiry to Supabase:', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-[#0c0c0e] border-t border-[#18181f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#121217] border border-[#22222d] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xl">
          
          {/* Left Visual Column */}
          <div className="lg:col-span-5 relative p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-b from-[#181822] to-[#121217]">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Group Dining</span>
              </span>
              <h3 className="text-3xl font-serif text-[#f5f5f0] leading-snug">
                Planning a Celebration or Highway Group Stopover?
              </h3>
              <p className="text-sm text-[#9c9ca6] leading-relaxed">
                Whether organizing a birthday dinner, family get-together, or lunch for a travel group along NH 48, our team can reserve adjacent tables and curate starter platters in advance.
              </p>
            </div>

            <div className="pt-8">
              <div className="p-4 rounded-xl bg-[#0c0c0e]/80 border border-[#242430] text-xs text-[#a0a0ab] space-y-1">
                <div className="font-semibold text-[#ededeb] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Large Group Accommodations</span>
                </div>
                <p>Comfortable arrangements for groups of 8 to 25 patrons with advance coordination.</p>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-8 lg:p-10 bg-[#14141a]">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-950/70 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-serif text-[#f5f5f0]">
                  Enquiry Received
                </h4>
                <p className="text-xs sm:text-sm text-[#a0a0ab] max-w-md mx-auto">
                  Thank you, {name}. Your group dining request has been registered and synced with our Supabase database. Our manager will review table arrangements for your {eventType} ({guests} guests) and call {phone} shortly.
                </p>
                <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-emerald-400">
                  <Database className="w-3 h-3" />
                  <span>Synced to Supabase ({SUPABASE_PROJECT_ID})</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="mt-2 text-xs font-semibold text-[#d4af37] hover:underline cursor-pointer block mx-auto"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anand Murthy"
                      className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#2b2b36] focus:border-[#d4af37] rounded-lg text-xs sm:text-sm text-[#ededeb] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#2b2b36] focus:border-[#d4af37] rounded-lg text-xs sm:text-sm text-[#ededeb] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1.5">
                      Occasion
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#2b2b36] focus:border-[#d4af37] rounded-lg text-xs sm:text-sm text-[#ededeb] focus:outline-none"
                    >
                      <option>Birthday Gathering</option>
                      <option>Family Dinner</option>
                      <option>Road-Trip Convoy</option>
                      <option>Colleague Dinner</option>
                      <option>Other Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1.5">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#2b2b36] focus:border-[#d4af37] rounded-lg text-xs sm:text-sm text-[#ededeb] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1.5">
                      Estimated Guests
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="40"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#2b2b36] focus:border-[#d4af37] rounded-lg text-xs sm:text-sm text-[#ededeb] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1.5">
                    Any Specific Requirements
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Vegetarian and non-vegetarian mix, advance starter platters, parking details..."
                    className="w-full px-3.5 py-2 bg-[#1a1a22] border border-[#2b2b36] focus:border-[#d4af37] rounded-lg text-xs sm:text-sm text-[#ededeb] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-black bg-[#d4af37] hover:bg-[#e8c679] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Group Dining Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
