import { defaultRestaurantSettings, initialMenuItems, initialReviews, galleryItems, sampleReservations, RestaurantSettings, MenuItem, Reservation } from '../data/restaurantData';

const SETTINGS_KEY = 'thirumala_settings';
const RESERVATIONS_KEY = 'thirumala_reservations';
const MENU_KEY = 'thirumala_menu';

export function getStoredSettings(): RestaurantSettings {
  if (typeof window === 'undefined') return defaultRestaurantSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultRestaurantSettings;
    return { ...defaultRestaurantSettings, ...JSON.parse(raw) };
  } catch {
    return defaultRestaurantSettings;
  }
}

export function saveStoredSettings(settings: RestaurantSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getStoredReservations(): Reservation[] {
  if (typeof window === 'undefined') return sampleReservations;
  try {
    const raw = localStorage.getItem(RESERVATIONS_KEY);
    if (!raw) {
      localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(sampleReservations));
      return sampleReservations;
    }
    return JSON.parse(raw);
  } catch {
    return sampleReservations;
  }
}

export function saveReservation(reservation: Reservation): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getStoredReservations();
    // Double booking check: Check if same phone has an active booking on that date and within 60 mins
    const exists = current.some(
      r => r.status === 'confirmed' &&
           r.mobile === reservation.mobile &&
           r.date === reservation.date &&
           r.time === reservation.time
    );
    if (exists) {
      return false; // duplicate booking detected
    }
    const updated = [reservation, ...current];
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export function updateReservationInStorage(id: string, updates: Partial<Reservation>): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getStoredReservations();
    const index = current.findIndex(r => r.id === id);
    if (index === -1) return false;
    current[index] = { ...current[index], ...updates };
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(current));
    return true;
  } catch {
    return false;
  }
}

export function cancelReservationInStorage(id: string): boolean {
  return updateReservationInStorage(id, { status: 'cancelled' });
}

export function deleteReservationFromStorage(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getStoredReservations();
    const filtered = current.filter(r => r.id !== id);
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function getStoredMenu(): MenuItem[] {
  if (typeof window === 'undefined') return initialMenuItems;
  try {
    const raw = localStorage.getItem(MENU_KEY);
    if (!raw) return initialMenuItems;
    return JSON.parse(raw);
  } catch {
    return initialMenuItems;
  }
}

export function updateStoredMenu(items: MenuItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MENU_KEY, JSON.stringify(items));
}

export function generateBookingId(): string {
  const chars = '0123456789ABCDEF';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `THR-${code}`;
}

export function isCurrentlyOpen(settings: RestaurantSettings): { isOpen: boolean; nextStatusText: string } {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeVal = currentHour * 60 + currentMinute;
  
  const openTimeVal = settings.openTimeHour * 60 + settings.openTimeMinute;
  const closeTimeVal = settings.closeTimeHour * 60 + settings.closeTimeMinute;

  const isOpen = currentTimeVal >= openTimeVal && currentTimeVal < closeTimeVal;
  
  if (isOpen) {
    return {
      isOpen: true,
      nextStatusText: `Open now · Closes at ${formatTime12Hour(settings.closeTimeHour, settings.closeTimeMinute)}`
    };
  } else {
    return {
      isOpen: false,
      nextStatusText: `Closed now · Opens at ${formatTime12Hour(settings.openTimeHour, settings.openTimeMinute)}`
    };
  }
}

function formatTime12Hour(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute < 10 ? `0${minute}` : minute;
  return `${displayHour}:${displayMinute} ${period}`;
}
