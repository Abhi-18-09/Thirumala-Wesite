import { createClient } from '@supabase/supabase-js';
import { Reservation } from '../data/restaurantData';

export const SUPABASE_PROJECT_ID = 'luiugpgtznbcszvlyrck';
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://luiugpgtznbcszvlyrck.supabase.co';
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZK_Pe_cI9FBcigqfCMyLlw_jPHN1aGL';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseSyncResult {
  success: boolean;
  error?: string;
  table?: string;
  data?: any;
}

export interface GroupInquiry {
  id: number | string;
  name: string;
  phone: string;
  eventType: string;
  targetDate?: string;
  guests: number;
  message?: string;
  createdAt: string;
}

/**
 * Inserts a reservation into the Supabase database.
 * Supports standard table names ('reservations' or 'bookings').
 */
export async function saveReservationToSupabase(reservation: Reservation): Promise<SupabaseSyncResult> {
  const payload = {
    id: reservation.id,
    booking_id: reservation.id,
    customer_name: reservation.customerName,
    mobile: reservation.mobile,
    email: reservation.email,
    reservation_date: reservation.date,
    reservation_time: reservation.time,
    guests: reservation.guests,
    seating_preference: reservation.seatingPreference,
    special_requests: reservation.specialRequests || '',
    status: reservation.status || 'confirmed',
    created_at: reservation.createdAt || new Date().toISOString()
  };

  try {
    // Attempt 1: Standard 'reservations' table
    const { data, error } = await supabase
      .from('reservations')
      .insert([payload])
      .select();

    if (!error) {
      return { success: true, table: 'reservations', data };
    }

    // If 'reservations' table is not found or has different schema, attempt fallback to 'bookings'
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      const { data: bData, error: bError } = await supabase
        .from('bookings')
        .insert([payload])
        .select();

      if (!bError) {
        return { success: true, table: 'bookings', data: bData };
      }
      return { success: false, error: error.message };
    }

    return { success: false, error: error.message };
  } catch (err: any) {
    console.error('Supabase reservation insertion error:', err);
    return { success: false, error: err?.message || 'Network error connecting to Supabase' };
  }
}

/**
 * Updates an existing reservation in Supabase
 */
export async function updateReservationInSupabase(
  id: string,
  updates: Partial<Reservation>
): Promise<SupabaseSyncResult> {
  const payload: any = {};
  if (updates.customerName !== undefined) payload.customer_name = updates.customerName;
  if (updates.mobile !== undefined) payload.mobile = updates.mobile;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.date !== undefined) payload.reservation_date = updates.date;
  if (updates.time !== undefined) payload.reservation_time = updates.time;
  if (updates.guests !== undefined) payload.guests = updates.guests;
  if (updates.seatingPreference !== undefined) payload.seating_preference = updates.seatingPreference;
  if (updates.specialRequests !== undefined) payload.special_requests = updates.specialRequests;
  if (updates.status !== undefined) payload.status = updates.status;

  try {
    const { data, error } = await supabase
      .from('reservations')
      .update(payload)
      .or(`id.eq.${id},booking_id.eq.${id}`)
      .select();

    if (!error) {
      return { success: true, table: 'reservations', data };
    }

    // Fallback to bookings
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      const { data: bData, error: bError } = await supabase
        .from('bookings')
        .update(payload)
        .or(`id.eq.${id},booking_id.eq.${id}`)
        .select();

      if (!bError) return { success: true, table: 'bookings', data: bData };
      return { success: false, error: bError.message };
    }

    return { success: false, error: error.message };
  } catch (err: any) {
    console.error('Supabase reservation update error:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Sets reservation status (confirmed, seated, completed, cancelled)
 */
export async function updateReservationStatusInSupabase(
  id: string,
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled'
): Promise<SupabaseSyncResult> {
  return updateReservationInSupabase(id, { status });
}

/**
 * Deletes a reservation from Supabase
 */
export async function deleteReservationFromSupabase(id: string): Promise<SupabaseSyncResult> {
  try {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .or(`id.eq.${id},booking_id.eq.${id}`);

    if (!error) {
      return { success: true, table: 'reservations' };
    }
    return { success: false, error: error.message };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Inserts group event or celebration inquiry into Supabase
 */
export async function saveInquiryToSupabase(inquiry: {
  name: string;
  phone: string;
  eventType: string;
  targetDate?: string;
  guests: number;
  message?: string;
}): Promise<SupabaseSyncResult> {
  const payload = {
    name: inquiry.name,
    phone: inquiry.phone,
    event_type: inquiry.eventType,
    target_date: inquiry.targetDate || null,
    guests: inquiry.guests,
    message: inquiry.message || '',
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([payload])
      .select();

    if (!error) {
      return { success: true, table: 'inquiries', data };
    }

    return { success: false, error: error.message };
  } catch (err: any) {
    console.error('Supabase inquiry insertion error:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Fetches recent reservations from Supabase
 */
export async function fetchSupabaseReservations(): Promise<Reservation[]> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.booking_id || row.id,
      customerName: row.customer_name || row.customerName || 'Guest',
      mobile: row.mobile || '',
      email: row.email || '',
      date: row.reservation_date || row.date || '',
      time: row.reservation_time || row.time || '',
      guests: Number(row.guests) || 2,
      seatingPreference: row.seating_preference || row.seatingPreference || 'Indoor',
      specialRequests: row.special_requests || row.specialRequests || '',
      createdAt: row.created_at || new Date().toISOString(),
      status: (row.status as any) || 'confirmed'
    }));
  } catch (err) {
    console.warn('Failed to fetch from Supabase:', err);
    return [];
  }
}

/**
 * Fetches group event inquiries from Supabase
 */
export async function fetchSupabaseInquiries(): Promise<GroupInquiry[]> {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      name: row.name || 'Anonymous',
      phone: row.phone || '',
      eventType: row.event_type || 'General Celebration',
      targetDate: row.target_date || undefined,
      guests: Number(row.guests) || 10,
      message: row.message || '',
      createdAt: row.created_at || new Date().toISOString()
    }));
  } catch (err) {
    console.warn('Failed to fetch inquiries from Supabase:', err);
    return [];
  }
}

/**
 * SQL Schema migration statement for user's convenience
 */
export const SUPABASE_SQL_SETUP = `-- Copy and execute this in your Supabase SQL Editor (Project: ${SUPABASE_PROJECT_ID})

-- 1. Table: reservations (for table bookings)
CREATE TABLE IF NOT EXISTS public.reservations (
    id TEXT PRIMARY KEY,
    booking_id TEXT,
    customer_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    reservation_date TEXT NOT NULL,
    reservation_time TEXT NOT NULL,
    guests INTEGER NOT NULL DEFAULT 2,
    seating_preference TEXT NOT NULL DEFAULT 'Indoor',
    special_requests TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table: inquiries (for group dining & events)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    event_type TEXT,
    target_date TEXT,
    guests INTEGER DEFAULT 10,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 4. Enable full read, insert, update, and delete policies
CREATE POLICY "Enable all for reservations" ON public.reservations
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all for inquiries" ON public.inquiries
    FOR ALL USING (true) WITH CHECK (true);
`;
