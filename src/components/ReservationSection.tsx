import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  CalendarPlus,
  Navigation,
  Phone,
  MessageSquare,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  Database,
  CloudCheck
} from 'lucide-react';
import { RestaurantSettings, Reservation } from '../data/restaurantData';
import { generateBookingId, saveReservation, getStoredReservations } from '../utils/storage';
import { saveReservationToSupabase, SUPABASE_PROJECT_ID, SupabaseSyncResult } from '../lib/supabase';

interface ReservationSectionProps {
  settings: RestaurantSettings;
  onOpenSupabaseModal?: () => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ settings, onOpenSupabaseModal }) => {
  // Step indicator: 1 = Date & Party, 2 = Contact, 3 = Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const [date, setDate] = useState<string>(todayStr);
  const [time, setTime] = useState<string>('19:30');
  const [guests, setGuests] = useState<number>(4);
  const [seatingPreference, setSeatingPreference] = useState<'Indoor' | 'Outdoor' | 'Any Available'>('Indoor');
  
  // Contact State
  const [customerName, setCustomerName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Status & Confirmation
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Reservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [supabaseResult, setSupabaseResult] = useState<SupabaseSyncResult | null>(null);

  // Available Time Slots (11:00 AM to 10:30 PM, every 30 mins)
  const timeSlots = useMemo(() => {
    const slots: { time: string; label: string }[] = [];
    for (let h = 11; h <= 22; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 22 && m > 30) continue;
        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 === 0 ? 12 : h % 12;
        const displayMinute = m === 0 ? '00' : m;
        slots.push({
          time: timeStr,
          label: `${displayHour}:${displayMinute} ${period}`
        });
      }
    }
    return slots;
  }, []);

  // Check capacity and existing bookings for selected date & time
  const currentSlotOccupancy = useMemo(() => {
    const existing = getStoredReservations();
    const matches = existing.filter(r => r.date === date && r.time === time && r.status === 'confirmed');
    const totalBookedGuests = matches.reduce((sum, item) => sum + item.guests, 0);
    const capacity = settings.totalTableCapacity || 80;
    const remaining = Math.max(0, capacity - totalBookedGuests);
    return {
      bookedGuests: totalBookedGuests,
      remainingSeats: remaining,
      isAvailable: remaining >= guests
    };
  }, [date, time, guests, settings.totalTableCapacity]);

  // Validation handlers
  const handleProceedToContact = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Prevent past date
    const selectedDateObj = new Date(`${date}T${time}:00`);
    const now = new Date();
    if (selectedDateObj < now) {
      setErrorMessage("Selected date and time is in the past. Please select an upcoming dining slot.");
      return;
    }

    if (guests < 1 || guests > settings.maxGuestsPerBooking) {
      setErrorMessage(`Please select between 1 and ${settings.maxGuestsPerBooking} guests.`);
      return;
    }

    if (!currentSlotOccupancy.isAvailable) {
      setErrorMessage("Sorry, this time slot is currently fully occupied. Please select an alternate time.");
      return;
    }

    setCurrentStep(2);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Name check
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage("Please enter a valid customer name (at least 2 characters).");
      return;
    }

    // Phone check (Indian phone: 10 digits, optional +91 prefix)
    const cleanPhone = mobile.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number for SMS / WhatsApp confirmation.");
      return;
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address for your booking voucher.");
      return;
    }

    setIsSubmitting(true);

    const formattedMobile = cleanPhone.length === 10 ? `+91 ${cleanPhone}` : `+${cleanPhone}`;
    const newReservation: Reservation = {
      id: generateBookingId(),
      customerName: customerName.trim(),
      mobile: formattedMobile,
      email: email.trim(),
      date,
      time,
      guests,
      seatingPreference,
      specialRequests: specialRequests.trim() || undefined,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    const saved = saveReservation(newReservation);

    if (!saved) {
      setIsSubmitting(false);
      setErrorMessage("A table is already reserved under this contact number for the selected time slot. Please choose another time or use an alternate phone.");
      return;
    }

    // Direct real-time sync to Supabase backend
    saveReservationToSupabase(newReservation)
      .then((res) => {
        setSupabaseResult(res);
      })
      .catch((err) => {
        console.error("Supabase sync error:", err);
        setSupabaseResult({ success: false, error: err?.message });
      })
      .finally(() => {
        setIsSubmitting(false);
        setConfirmedBooking(newReservation);
        setCurrentStep(3);
      });
  };

  const handleResetBooking = () => {
    setCurrentStep(1);
    setConfirmedBooking(null);
    setSupabaseResult(null);
    setCustomerName('');
    setMobile('');
    setEmail('');
    setSpecialRequests('');
    setErrorMessage(null);
  };

  // Format date for readable display (e.g. "Saturday, 27 September 2026")
  const formattedDate = useMemo(() => {
    if (!date) return '';
    try {
      const d = new Date(`${date}T12:00:00`);
      return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return date;
    }
  }, [date]);

  // Calendar .ics download generator
  const handleDownloadCalendar = () => {
    if (!confirmedBooking) return;
    const startHour = parseInt(confirmedBooking.time.split(':')[0], 10);
    const startMin = parseInt(confirmedBooking.time.split(':')[1], 10);
    const startDateTime = new Date(`${confirmedBooking.date}T${confirmedBooking.time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + settings.reservationDurationMinutes * 60000);

    const formatDateForICS = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Thirumala Bar and Restaurant//Table Reservation//EN',
      'BEGIN:VEVENT',
      `UID:${confirmedBooking.id}@thirumalarestaurant.in`,
      `DTSTAMP:${formatDateForICS(new Date())}`,
      `DTSTART:${formatDateForICS(startDateTime)}`,
      `DTEND:${formatDateForICS(endDateTime)}`,
      `SUMMARY:Dinner Reservation at Thirumala Bar & Restaurant (${confirmedBooking.guests} guests)`,
      `DESCRIPTION:Table Reservation ID: ${confirmedBooking.id}\\nGuests: ${confirmedBooking.guests}\\nSeating: ${confirmedBooking.seatingPreference}\\nContact: ${settings.phone}`,
      `LOCATION:${settings.address}, ${settings.city}, ${settings.state}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Thirumala-Booking-${confirmedBooking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp confirmation text link
  const getWhatsAppBookingLink = () => {
    if (!confirmedBooking) return '';
    const text = encodeURIComponent(
      `Hello Thirumala Bar & Restaurant, I have a confirmed table reservation:\n\n` +
      `📌 Booking ID: ${confirmedBooking.id}\n` +
      `👤 Name: ${confirmedBooking.customerName}\n` +
      `📅 Date: ${confirmedBooking.date}\n` +
      `⏰ Time: ${confirmedBooking.time}\n` +
      `👥 Guests: ${confirmedBooking.guests}\n` +
      `🪑 Seating: ${confirmedBooking.seatingPreference}\n\n` +
      `Looking forward to our visit!`
    );
    return `https://wa.me/${settings.whatsapp}?text=${text}`;
  };

  return (
    <section id="reserve" className="py-20 lg:py-28 bg-[#0a0a0d] border-t border-[#1a1a22] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium block mb-2">
            Table Reservations
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f5f5f0] font-normal mb-3">
            Reserve Your Table
          </h2>
          <p className="text-sm text-[#9595a0]">
            Guaranteed seating for road-trips, family dinners, and relaxed evening gatherings. Instant digital confirmation.
          </p>
        </div>

        {/* Step Progress Tracker */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10 text-xs font-medium">
          <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-[#e8c679]' : 'text-[#60606a]'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${currentStep >= 1 ? 'bg-[#d4af37] text-black font-bold' : 'bg-[#181820] text-[#70707a] border border-[#2b2b36]'}`}>
              1
            </span>
            <span>Date & Party</span>
          </div>

          <div className="w-8 h-px bg-[#262630]" />

          <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-[#e8c679]' : 'text-[#60606a]'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${currentStep >= 2 ? 'bg-[#d4af37] text-black font-bold' : 'bg-[#181820] text-[#70707a] border border-[#2b2b36]'}`}>
              2
            </span>
            <span>Contact Details</span>
          </div>

          <div className="w-8 h-px bg-[#262630]" />

          <div className={`flex items-center gap-2 ${currentStep === 3 ? 'text-[#e8c679]' : 'text-[#60606a]'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${currentStep === 3 ? 'bg-emerald-500 text-black font-bold' : 'bg-[#181820] text-[#70707a] border border-[#2b2b36]'}`}>
              ✓
            </span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="bg-[#121217] border border-[#23232e] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Date, Time, Guests, Seating */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToContact} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Picker */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#b0b0ba] font-medium mb-2 flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Select Date</span>
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[#181820] border border-[#292934] focus:border-[#d4af37] rounded-xl text-sm text-[#ededeb] focus:outline-none transition-colors"
                  />
                  <span className="block text-[11px] text-[#757582] mt-1.5">
                    Selected: {formattedDate}
                  </span>
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#b0b0ba] font-medium mb-2 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Number of Guests</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-11 h-11 rounded-xl bg-[#1a1a22] border border-[#292934] text-lg font-bold text-[#ededeb] hover:bg-[#252530] flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      -
                    </button>
                    <div className="flex-1 py-2.5 px-4 bg-[#181820] border border-[#292934] rounded-xl text-center">
                      <span className="font-mono text-base font-semibold text-[#f5f5f0]">
                        {guests} {guests === 1 ? 'Guest' : 'Guests'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGuests(Math.min(settings.maxGuestsPerBooking, guests + 1))}
                      className="w-11 h-11 rounded-xl bg-[#1a1a22] border border-[#292934] text-lg font-bold text-[#ededeb] hover:bg-[#252530] flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      +
                    </button>
                  </div>
                  <span className="block text-[11px] text-[#757582] mt-1.5">
                    Max online booking: {settings.maxGuestsPerBooking} guests (for larger groups, please use group dining enquiry)
                  </span>
                </div>
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#b0b0ba] font-medium mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Preferred Time Slot</span>
                  </span>
                  <span className="text-[11px] text-[#a0a0ab] font-mono">
                    {currentSlotOccupancy.remainingSeats} seats available at {time}
                  </span>
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = time === slot.time;
                    return (
                      <button
                        type="button"
                        key={slot.time}
                        onClick={() => setTime(slot.time)}
                        className={`py-2 px-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20 border border-[#d4af37]'
                            : 'bg-[#181820] text-[#a0a0aa] hover:text-white hover:bg-[#20202a] border border-[#262632]'
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seating Preference */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#b0b0ba] font-medium mb-2.5">
                  Seating Area Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['Indoor', 'Outdoor', 'Any Available'] as const).map((pref) => (
                    <button
                      type="button"
                      key={pref}
                      onClick={() => setSeatingPreference(pref)}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        seatingPreference === pref
                          ? 'bg-[#1f1d17] border-[#d4af37] text-[#f5f5f0]'
                          : 'bg-[#16161c] border-[#252530] text-[#8e8e98] hover:text-[#d0d0d8]'
                      }`}
                    >
                      <div className="text-xs font-semibold mb-1">{pref}</div>
                      <div className="text-[11px] text-[#70707a]">
                        {pref === 'Indoor' && 'Airy main dining hall'}
                        {pref === 'Outdoor' && 'Semi-open ambient veranda'}
                        {pref === 'Any Available' && 'First available table upon arrival'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="pt-4 border-t border-[#1e1e28] flex items-center justify-between">
                <div className="text-xs text-[#80808c]">
                  Duration: ~{settings.reservationDurationMinutes} mins · Free cancellation
                </div>
                <button
                  type="submit"
                  className="px-7 py-3 text-xs font-semibold uppercase tracking-wider text-black bg-[#d4af37] hover:bg-[#e8c679] rounded-xl transition-all cursor-pointer shadow-lg shadow-[#d4af37]/15"
                >
                  Continue to Contact Details →
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Contact Information */}
          {currentStep === 2 && (
            <form onSubmit={handleConfirmReservation} className="space-y-6">
              <div className="p-4 bg-[#181820] border border-[#272733] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[#80808c]">Booking for: </span>
                  <span className="text-[#f5f5f0] font-semibold">{formattedDate} at {time}</span>
                  <span className="text-[#80808c]"> · {guests} {guests === 1 ? 'Guest' : 'Guests'} ({seatingPreference})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-[#d4af37] hover:underline font-medium cursor-pointer"
                >
                  Modify Selection
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#b0b0ba] font-medium mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Gowda"
                    className="w-full px-4 py-3 bg-[#181820] border border-[#292934] focus:border-[#d4af37] rounded-xl text-sm text-[#ededeb] placeholder-[#60606b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#b0b0ba] font-medium mb-1.5">
                    Mobile Number (SMS / WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 bg-[#181820] border border-[#292934] focus:border-[#d4af37] rounded-xl text-sm text-[#ededeb] placeholder-[#60606b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#b0b0ba] font-medium mb-1.5">
                  Email Address (for Digital Voucher) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  className="w-full px-4 py-3 bg-[#181820] border border-[#292934] focus:border-[#d4af37] rounded-xl text-sm text-[#ededeb] placeholder-[#60606b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#b0b0ba] font-medium mb-1.5">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Quiet corner table, high chair, birthday greeting, dietary preferences..."
                  className="w-full px-4 py-2.5 bg-[#181820] border border-[#292934] focus:border-[#d4af37] rounded-xl text-sm text-[#ededeb] placeholder-[#60606b] focus:outline-none"
                />
              </div>

              {/* Responsible Drinking & Legal Notice Accordion */}
              <div className="p-3.5 bg-[#17171d] border border-[#24242e] rounded-xl text-xs text-[#8e8e98] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>
                  Alcohol service requires patrons to be 21 years of age or older with valid photo ID as per Karnataka State Excise guidelines. Table held for 15 minutes past reservation time.
                </span>
              </div>

              {/* Step 2 Actions */}
              <div className="pt-4 border-t border-[#1e1e28] flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 text-xs font-medium text-[#b0b0ba] hover:text-white bg-[#1a1a22] border border-[#282834] rounded-xl transition-colors cursor-pointer"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 text-xs font-semibold uppercase tracking-wider text-black bg-[#d4af37] hover:bg-[#e8c679] rounded-xl transition-all cursor-pointer shadow-lg shadow-[#d4af37]/15 disabled:opacity-50"
                >
                  {isSubmitting ? "Confirming Table..." : "Confirm Reservation ✓"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Reservation Confirmed Screen */}
          {currentStep === 3 && confirmedBooking && (
            <div className="text-center py-4 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold">
                  Reservation Confirmed
                </span>
                <h3 className="text-3xl font-serif text-[#f5f5f0] mt-1 mb-2">
                  Your Table Is Reserved
                </h3>
                <p className="text-sm text-[#9e9ea8]">
                  Thank you for choosing Thirumala Bar & Restaurant. We have reserved your table.
                </p>

                {/* Supabase Realtime Sync Badge */}
                <div className="mt-3 flex items-center justify-center">
                  {supabaseResult?.success ? (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 text-xs">
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Saved to Supabase Database (Project: {SUPABASE_PROJECT_ID})</span>
                    </div>
                  ) : supabaseResult?.error ? (
                    <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-600/40 text-amber-300 text-xs">
                      <Database className="w-3.5 h-3.5 text-amber-400" />
                      <span>Saved locally · Supabase sync: {supabaseResult.error}</span>
                      {onOpenSupabaseModal && (
                        <button
                          type="button"
                          onClick={onOpenSupabaseModal}
                          className="underline text-[#e8c679] hover:text-white font-medium ml-1 cursor-pointer"
                        >
                          Setup Database Table
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181822] border border-[#2b2b38] text-[#a0a0ab] text-xs">
                      <Database className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Connected to Supabase ({SUPABASE_PROJECT_ID})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirmation Ticket Card */}
              <div className="bg-[#17171e] border border-[#2b2b38] rounded-xl p-6 text-left max-w-lg mx-auto space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#23232e]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#80808c] block">
                      Booking Reference ID
                    </span>
                    <span className="font-mono text-lg font-bold text-[#e8c679]">
                      {confirmedBooking.id}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[11px] font-medium bg-emerald-950/70 border border-emerald-700/60 text-emerald-300">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#80808c] block mb-0.5">Guest Name</span>
                    <span className="text-[#ededeb] font-medium">{confirmedBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[#80808c] block mb-0.5">Contact</span>
                    <span className="text-[#ededeb] font-medium">{confirmedBooking.mobile}</span>
                  </div>
                  <div>
                    <span className="text-[#80808c] block mb-0.5">Date & Time</span>
                    <span className="text-[#ededeb] font-medium">{confirmedBooking.date} · {confirmedBooking.time}</span>
                  </div>
                  <div>
                    <span className="text-[#80808c] block mb-0.5">Guests & Seating</span>
                    <span className="text-[#ededeb] font-medium">{confirmedBooking.guests} Guests ({confirmedBooking.seatingPreference})</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#23232e] text-xs text-[#a0a0ab] flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                  <span>
                    {settings.name}, {settings.address}, {settings.city}, Chitradurga
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadCalendar}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#ededeb] bg-[#1a1a22] hover:bg-[#252530] border border-[#2e2e38] rounded-lg transition-colors cursor-pointer"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Add to Calendar</span>
                </button>

                <a
                  href={getWhatsAppBookingLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/60 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Confirmation</span>
                </a>

                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#ededeb] bg-[#1a1a22] hover:bg-[#252530] border border-[#2e2e38] rounded-lg transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#ededeb] bg-[#1a1a22] hover:bg-[#252530] border border-[#2e2e38] rounded-lg transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Call Restaurant</span>
                </a>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleResetBooking}
                  className="inline-flex items-center gap-1.5 text-xs text-[#80808c] hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Make another reservation</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
