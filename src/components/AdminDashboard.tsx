import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Search,
  RefreshCw,
  Edit2,
  XCircle,
  CheckCircle2,
  Trash2,
  Download,
  Plus,
  ExternalLink,
  Phone,
  MessageSquare,
  AlertCircle,
  Database,
  ArrowLeft,
  X,
  Save,
  Check,
  Filter,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { Reservation, RestaurantSettings } from '../data/restaurantData';
import {
  fetchSupabaseReservations,
  updateReservationInSupabase,
  updateReservationStatusInSupabase,
  deleteReservationFromSupabase,
  saveReservationToSupabase,
  fetchSupabaseInquiries,
  GroupInquiry,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_SQL_SETUP
} from '../lib/supabase';
import {
  getStoredReservations,
  saveReservation,
  updateReservationInStorage,
  deleteReservationFromStorage,
  generateBookingId
} from '../utils/storage';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RestaurantSettings;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'inquiries' | 'database'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inquiries, setInquiries] = useState<GroupInquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'local_fallback' | 'connecting'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'seated' | 'completed' | 'cancelled'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'upcoming' | 'past'>('all');

  // Edit Modal State
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  
  // New Booking Modal State
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [newBookingData, setNewBookingData] = useState<{
    customerName: string;
    mobile: string;
    email: string;
    date: string;
    time: string;
    guests: number;
    seatingPreference: 'Indoor' | 'Outdoor' | 'Any Available';
    specialRequests: string;
  }>({
    customerName: '',
    mobile: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guests: 4,
    seatingPreference: 'Indoor',
    specialRequests: ''
  });

  // SQL Copy state
  const [copiedSql, setCopiedSql] = useState(false);

  // Today and Tomorrow strings
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  // Initial Load & Refresh
  const loadData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      // 1. Fetch from Supabase
      const [remoteRows, remoteInquiries] = await Promise.all([
        fetchSupabaseReservations(),
        fetchSupabaseInquiries()
      ]);

      setInquiries(remoteInquiries);

      // 2. Fetch local storage rows as well
      const localRows = getStoredReservations();

      if (remoteRows.length > 0) {
        // Merge Supabase rows with local rows (preferring remote if id matches)
        const map = new Map<string, Reservation>();
        localRows.forEach(r => map.set(r.id, r));
        remoteRows.forEach(r => map.set(r.id, r));
        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()
        );
        setReservations(merged);
        setSyncStatus('synced');
      } else {
        // Fallback to local storage if remote table is empty or not yet seeded
        setReservations(localRows);
        setSyncStatus('local_fallback');
      }
    } catch (err: any) {
      console.warn('Error loading admin data:', err);
      setReservations(getStoredReservations());
      setSyncStatus('local_fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Change Status Handler
  const handleStatusChange = async (id: string, newStatus: 'confirmed' | 'seated' | 'completed' | 'cancelled') => {
    // 1. Optimistic UI update
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
    updateReservationInStorage(id, { status: newStatus });

    // 2. Supabase backend update
    const res = await updateReservationStatusInSupabase(id, newStatus);
    if (res.success) {
      showNotification(`Reservation ${id} updated to "${newStatus}".`);
    } else {
      showNotification(`Updated locally. Supabase note: ${res.error || 'Saved'}`);
    }
  };

  // Delete Handler
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the reservation for ${name} (${id})?`)) {
      return;
    }

    setReservations(prev => prev.filter(r => r.id !== id));
    deleteReservationFromStorage(id);
    const res = await deleteReservationFromSupabase(id);
    if (res.success) {
      showNotification(`Reservation ${id} deleted.`);
    } else {
      showNotification(`Deleted locally.`);
    }
  };

  // Save Edit Handler
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReservation) return;

    const id = editingReservation.id;
    // 1. Optimistic update
    setReservations(prev =>
      prev.map(r => (r.id === id ? editingReservation : r))
    );
    updateReservationInStorage(id, editingReservation);

    // 2. Supabase update
    const res = await updateReservationInSupabase(id, editingReservation);
    setEditingReservation(null);

    if (res.success) {
      showNotification(`Reservation ${id} successfully updated in database.`);
    } else {
      showNotification(`Saved locally. Supabase update note: ${res.error || 'Updated'}`);
    }
  };

  // Create Manual Booking Handler
  const handleCreateNewBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingData.customerName.trim() || newBookingData.mobile.replace(/[^0-9]/g, '').length < 10) {
      alert('Please provide a valid customer name and a 10-digit mobile number.');
      return;
    }

    const cleanPhone = newBookingData.mobile.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `+91 ${cleanPhone}` : `+${cleanPhone}`;

    const newRes: Reservation = {
      id: generateBookingId(),
      customerName: newBookingData.customerName.trim(),
      mobile: formattedPhone,
      email: newBookingData.email.trim() || 'walkin@thirumalarestaurant.in',
      date: newBookingData.date,
      time: newBookingData.time,
      guests: Number(newBookingData.guests) || 2,
      seatingPreference: newBookingData.seatingPreference,
      specialRequests: newBookingData.specialRequests.trim() || undefined,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    saveReservation(newRes);
    setReservations(prev => [newRes, ...prev]);
    setIsNewBookingOpen(false);

    // Sync to Supabase
    const res = await saveReservationToSupabase(newRes);
    if (res.success) {
      showNotification(`New booking ${newRes.id} created and saved to Supabase.`);
    } else {
      showNotification(`New booking ${newRes.id} created locally.`);
    }

    // Reset form
    setNewBookingData({
      customerName: '',
      mobile: '',
      email: '',
      date: todayStr,
      time: '19:30',
      guests: 4,
      seatingPreference: 'Indoor',
      specialRequests: ''
    });
  };

  // Export to CSV for kitchen/front desk
  const handleExportCSV = () => {
    if (reservations.length === 0) return;
    const headers = ['Booking ID', 'Customer Name', 'Mobile', 'Email', 'Date', 'Time', 'Guests', 'Seating', 'Status', 'Special Requests', 'Created At'];
    const rows = filteredReservations.map(r => [
      `"${r.id}"`,
      `"${r.customerName.replace(/"/g, '""')}"`,
      `"${r.mobile}"`,
      `"${r.email}"`,
      `"${r.date}"`,
      `"${r.time}"`,
      r.guests,
      `"${r.seatingPreference}"`,
      `"${r.status}"`,
      `"${(r.specialRequests || '').replace(/"/g, '""')}"`,
      `"${r.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `thirumala_bookings_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered List
  const filteredReservations = useMemo(() => {
    return reservations.filter(r => {
      // 1. Status Filter
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;

      // 2. Date Filter
      if (dateFilter === 'today' && r.date !== todayStr) return false;
      if (dateFilter === 'tomorrow' && r.date !== tomorrowStr) return false;
      if (dateFilter === 'upcoming' && r.date < todayStr) return false;
      if (dateFilter === 'past' && r.date >= todayStr) return false;

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          r.id.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.mobile.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.specialRequests && r.specialRequests.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [reservations, statusFilter, dateFilter, searchQuery, todayStr, tomorrowStr]);

  // Metrics
  const metrics = useMemo(() => {
    const total = reservations.length;
    const todayCount = reservations.filter(r => r.date === todayStr && r.status !== 'cancelled').length;
    const todayGuests = reservations
      .filter(r => r.date === todayStr && r.status !== 'cancelled')
      .reduce((sum, r) => sum + r.guests, 0);
    const confirmedCount = reservations.filter(r => r.status === 'confirmed').length;
    const seatedCount = reservations.filter(r => r.status === 'seated').length;
    const completedCount = reservations.filter(r => r.status === 'completed').length;
    const cancelledCount = reservations.filter(r => r.status === 'cancelled').length;

    return {
      total,
      todayCount,
      todayGuests,
      confirmedCount,
      seatedCount,
      completedCount,
      cancelledCount
    };
  }, [reservations, todayStr]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0d] text-[#ededeb] overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Header Bar */}
      <header className="bg-[#121217] border-b border-[#22222d] px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 text-[#9595a0] hover:text-white bg-[#181820] hover:bg-[#252530] border border-[#2e2e38] rounded-lg transition-colors cursor-pointer"
            title="Back to Website"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg sm:text-xl font-bold text-[#f5f5f0] tracking-wide">
                Thirumala Management Dashboard
              </h1>
              <span className="text-[10px] font-mono uppercase bg-[#241f14] text-[#e8c679] border border-[#4a3b1a] px-2 py-0.5 rounded">
                Admin Console
              </span>
            </div>
            <p className="text-[11px] text-[#8e8e98] flex items-center gap-2 mt-0.5">
              <span>Bharamasagara, Chitradurga</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span className="font-mono text-[#b0b0b8]">{SUPABASE_PROJECT_ID}</span>
                {syncStatus === 'synced' ? (
                  <span className="text-emerald-400 font-medium">● Connected</span>
                ) : (
                  <span className="text-amber-400 font-medium">● Local Mode</span>
                )}
              </span>
            </p>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            title="Refresh database data"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#ededeb] bg-[#181822] hover:bg-[#22222e] border border-[#2b2b38] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#d4af37]' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <button
            onClick={handleExportCSV}
            title="Export filtered records to CSV"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#ededeb] bg-[#181822] hover:bg-[#22222e] border border-[#2b2b38] rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-[#d4af37] hover:bg-[#e8c679] rounded-lg shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Booking</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-300 text-xs px-4 py-2 text-center flex items-center justify-center gap-2 shrink-0 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-5 shrink-0">
          <div className="bg-[#121217] border border-[#20202a] rounded-xl p-3 sm:p-4">
            <span className="text-[11px] uppercase tracking-wider text-[#8e8e98] block mb-1">
              Today's Bookings
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-[#e8c679]">
                {metrics.todayCount}
              </span>
              <span className="text-[11px] text-[#70707a]">
                ({metrics.todayGuests} guests)
              </span>
            </div>
          </div>

          <div className="bg-[#121217] border border-[#20202a] rounded-xl p-3 sm:p-4">
            <span className="text-[11px] uppercase tracking-wider text-[#8e8e98] block mb-1">
              Confirmed Active
            </span>
            <div className="font-serif text-2xl font-bold text-emerald-400">
              {metrics.confirmedCount}
            </div>
          </div>

          <div className="bg-[#121217] border border-[#20202a] rounded-xl p-3 sm:p-4">
            <span className="text-[11px] uppercase tracking-wider text-[#8e8e98] block mb-1">
              Seated / Dining
            </span>
            <div className="font-serif text-2xl font-bold text-amber-400">
              {metrics.seatedCount}
            </div>
          </div>

          <div className="bg-[#121217] border border-[#20202a] rounded-xl p-3 sm:p-4">
            <span className="text-[11px] uppercase tracking-wider text-[#8e8e98] block mb-1">
              Completed
            </span>
            <div className="font-serif text-2xl font-bold text-blue-400">
              {metrics.completedCount}
            </div>
          </div>

          <div className="bg-[#121217] border border-[#20202a] rounded-xl p-3 sm:p-4 col-span-2 sm:col-span-4 lg:col-span-1">
            <span className="text-[11px] uppercase tracking-wider text-[#8e8e98] block mb-1">
              Total Database
            </span>
            <div className="font-serif text-2xl font-bold text-[#f5f5f0]">
              {metrics.total} <span className="text-xs text-[#70707a] font-sans font-normal">({metrics.cancelledCount} canc.)</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-between border-b border-[#20202a] pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'reservations'
                  ? 'bg-[#d4af37] text-black shadow-sm'
                  : 'text-[#9c9ca8] hover:text-white bg-[#14141a]'
              }`}
            >
              Table Reservations ({filteredReservations.length})
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#d4af37] text-black shadow-sm'
                  : 'text-[#9c9ca8] hover:text-white bg-[#14141a]'
              }`}
            >
              Group Inquiries ({inquiries.length})
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-[#d4af37] text-black shadow-sm'
                  : 'text-[#9c9ca8] hover:text-white bg-[#14141a]'
              }`}
            >
              Supabase Status & SQL
            </button>
          </div>

          {loading && (
            <span className="text-[11px] text-[#d4af37] flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Syncing with Supabase...</span>
            </span>
          )}
        </div>

        {/* TAB 1: Table Reservations */}
        {activeTab === 'reservations' && (
          <div className="flex-1 flex flex-col overflow-hidden space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="bg-[#121217] border border-[#22222d] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
              
              {/* Search input */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-[#70707a] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, guest name, mobile..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#181822] border border-[#282834] rounded-lg text-xs text-[#ededeb] placeholder-[#60606a] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Date Filters */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {(['all', 'today', 'tomorrow', 'upcoming', 'past'] as const).map((df) => (
                  <button
                    key={df}
                    onClick={() => setDateFilter(df)}
                    className={`px-2.5 py-1 text-[11px] capitalize rounded-md transition-colors cursor-pointer ${
                      dateFilter === df
                        ? 'bg-[#2a2416] text-[#e8c679] border border-[#4d3d1e] font-semibold'
                        : 'text-[#80808c] hover:text-[#d0d0d8] bg-[#181822]'
                    }`}
                  >
                    {df === 'all' ? 'All Dates' : df}
                  </button>
                ))}
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1">
                {(['all', 'confirmed', 'seated', 'completed', 'cancelled'] as const).map((sf) => (
                  <button
                    key={sf}
                    onClick={() => setStatusFilter(sf)}
                    className={`px-2.5 py-1 text-[11px] capitalize rounded-md transition-colors cursor-pointer ${
                      statusFilter === sf
                        ? 'bg-[#d4af37] text-black font-semibold'
                        : 'text-[#80808c] hover:text-[#d0d0d8] bg-[#181822]'
                    }`}
                  >
                    {sf}
                  </button>
                ))}
              </div>

            </div>

            {/* Reservations Table / Cards */}
            <div className="flex-1 overflow-y-auto rounded-xl border border-[#22222d] bg-[#101015]">
              {filteredReservations.length === 0 ? (
                <div className="py-20 text-center text-[#70707a] space-y-3">
                  <Calendar className="w-10 h-10 mx-auto text-[#40404a]" />
                  <p className="text-sm">No reservations match the selected search or filter.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setDateFilter('all');
                      setStatusFilter('all');
                    }}
                    className="text-xs text-[#d4af37] hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#14141c] text-[#8e8e98] border-b border-[#20202b] sticky top-0 z-10 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Ref ID</th>
                      <th className="py-3 px-4 font-semibold">Guest Name</th>
                      <th className="py-3 px-4 font-semibold">Date & Time</th>
                      <th className="py-3 px-4 font-semibold">Party</th>
                      <th className="py-3 px-4 font-semibold">Contact Details</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1c26]">
                    {filteredReservations.map((item) => {
                      const isToday = item.date === todayStr;
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-[#15151e] transition-colors group"
                        >
                          {/* Ref ID */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-mono text-[#e8c679] font-medium">
                              {item.id}
                            </span>
                            {isToday && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950/80 border border-amber-600/50 text-amber-300">
                                TODAY
                              </span>
                            )}
                          </td>

                          {/* Guest Name */}
                          <td className="py-3 px-4">
                            <div className="font-medium text-[#ededeb]">{item.customerName}</div>
                            {item.specialRequests && (
                              <div className="text-[11px] text-[#90909c] truncate max-w-xs mt-0.5 italic">
                                Note: "{item.specialRequests}"
                              </div>
                            )}
                          </td>

                          {/* Date & Time */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="text-[#ededeb] font-medium">{item.date}</div>
                            <div className="text-[11px] text-[#80808c] font-mono flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-[#d4af37]" />
                              <span>{item.time}</span>
                            </div>
                          </td>

                          {/* Guests & Seating */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="text-[#ededeb] font-medium">
                              {item.guests} {item.guests === 1 ? 'Guest' : 'Guests'}
                            </div>
                            <div className="text-[10px] text-[#787884] uppercase">
                              {item.seatingPreference}
                            </div>
                          </td>

                          {/* Contact Details */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${item.mobile.replace(/[^0-9+]/g, '')}`}
                                className="text-[#ededeb] hover:text-[#d4af37] font-mono flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3 text-[#70707a]" />
                                <span>{item.mobile}</span>
                              </a>
                              <a
                                href={`https://wa.me/${item.mobile.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp chat"
                                className="text-emerald-400 hover:text-emerald-300"
                              >
                                <MessageSquare className="w-3 h-3" />
                              </a>
                            </div>
                            <div className="text-[11px] text-[#70707a] truncate max-w-[180px]">
                              {item.email}
                            </div>
                          </td>

                          {/* Status Badge & Quick Change */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                  item.status === 'confirmed'
                                    ? 'bg-emerald-950/70 border border-emerald-600/50 text-emerald-300'
                                    : item.status === 'seated'
                                    ? 'bg-amber-950/70 border border-amber-600/50 text-amber-300'
                                    : item.status === 'completed'
                                    ? 'bg-blue-950/70 border border-blue-600/50 text-blue-300'
                                    : 'bg-red-950/70 border border-red-600/50 text-red-300'
                                }`}
                              >
                                {item.status}
                              </span>

                              {/* Quick status dropdown */}
                              <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                                className="bg-[#181822] text-[#80808c] hover:text-white border border-[#2b2b36] rounded text-[10px] py-0.5 px-1 focus:outline-none cursor-pointer"
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="seated">Seated</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingReservation({ ...item })}
                                title="Edit Reservation"
                                className="p-1.5 text-[#9595a0] hover:text-white bg-[#181822] hover:bg-[#262634] border border-[#292936] rounded-md transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {item.status !== 'cancelled' ? (
                                <button
                                  onClick={() => handleStatusChange(item.id, 'cancelled')}
                                  title="Cancel Appointment"
                                  className="p-1.5 text-amber-400 hover:text-amber-200 bg-[#181822] hover:bg-amber-950/50 border border-[#292936] rounded-md transition-colors cursor-pointer"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStatusChange(item.id, 'confirmed')}
                                  title="Reactivate Appointment"
                                  className="p-1.5 text-emerald-400 hover:text-emerald-200 bg-[#181822] hover:bg-emerald-950/50 border border-[#292936] rounded-md transition-colors cursor-pointer"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => handleDelete(item.id, item.customerName)}
                                title="Delete Record"
                                className="p-1.5 text-red-400 hover:text-red-200 bg-[#181822] hover:bg-red-950/50 border border-[#292936] rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: Group Event Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="bg-[#121217] border border-[#22222d] rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#f5f5f0]">
                  Group Celebrations & Road-Trip Convoy Requests
                </h3>
                <p className="text-xs text-[#8e8e98]">
                  Submissions from the "Planning a Celebration?" enquiry form synced with Supabase table "inquiries".
                </p>
              </div>
              <span className="text-xs text-[#d4af37] font-mono">
                {inquiries.length} Inquiries
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="py-20 text-center text-[#70707a] bg-[#101015] border border-[#20202a] rounded-xl space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-[#40404a]" />
                <p className="text-sm">No group inquiries received yet.</p>
                <p className="text-xs text-[#60606a]">Submissions from visitors will automatically appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-[#121217] border border-[#20202a] rounded-xl p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif text-base font-semibold text-[#ededeb]">
                          {inq.name}
                        </h4>
                        <span className="text-xs text-[#e8c679] font-medium">
                          {inq.eventType} · {inq.guests} Guests
                        </span>
                      </div>
                      <span className="text-[10px] text-[#70707a] font-mono">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {inq.targetDate && (
                      <div className="text-xs text-[#a0a0ab] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Requested Date: {inq.targetDate}</span>
                      </div>
                    )}

                    {inq.message && (
                      <p className="text-xs text-[#8e8e98] bg-[#16161f] p-3 rounded-lg border border-[#22222d] italic">
                        "{inq.message}"
                      </p>
                    )}

                    <div className="pt-2 border-t border-[#1c1c24] flex items-center justify-between">
                      <a
                        href={`tel:${inq.phone.replace(/[^0-9+]/g, '')}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#ededeb] hover:text-[#d4af37]"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{inq.phone}</span>
                      </a>

                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${inq.name}, this is Thirumala Bar & Restaurant regarding your group dining inquiry.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 hover:bg-emerald-950"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Database & SQL Schema */}
        {activeTab === 'database' && (
          <div className="flex-1 overflow-y-auto space-y-6">
            
            <div className="bg-[#121217] border border-[#22222d] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-semibold text-[#f5f5f0]">
                      Supabase Cloud Database Status
                    </h3>
                    <p className="text-xs text-[#8e8e98]">
                      Project ID: <span className="font-mono text-[#e8c679]">{SUPABASE_PROJECT_ID}</span>
                    </p>
                  </div>
                </div>

                <a
                  href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/editor`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#ededeb] bg-[#1a1a24] hover:bg-[#252532] border border-[#2c2c3a] rounded-lg transition-colors"
                >
                  <span>Open Supabase Table Editor</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-3 bg-[#16161f] rounded-lg border border-[#22222c]">
                  <span className="text-[#757582] block">Database Endpoint</span>
                  <span className="font-mono text-[#ededeb] truncate block mt-0.5">
                    {SUPABASE_URL}
                  </span>
                </div>

                <div className="p-3 bg-[#16161f] rounded-lg border border-[#22222c]">
                  <span className="text-[#757582] block">Client Status</span>
                  <span className="text-emerald-400 font-medium block mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active & Configured</span>
                  </span>
                </div>

                <div className="p-3 bg-[#16161f] rounded-lg border border-[#22222c]">
                  <span className="text-[#757582] block">Live Synced Rows</span>
                  <span className="font-mono text-[#e8c679] font-bold text-sm block mt-0.5">
                    {reservations.length} Bookings
                  </span>
                </div>
              </div>
            </div>

            {/* SQL Script Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                    Complete Database Table Migration Script
                  </h4>
                  <p className="text-xs text-[#8e8e98]">
                    Ensure your Supabase project tables and policies are applied:
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#181822] hover:bg-[#242430] border border-[#2e2e3c] rounded-lg text-xs font-medium text-[#ededeb] cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#0c0c0e] border border-[#202028] rounded-xl text-xs font-mono text-[#a6e22e] overflow-x-auto max-h-72 scrollbar-thin">
                {SUPABASE_SQL_SETUP}
              </pre>
            </div>

          </div>
        )}

      </div>

      {/* EDIT RESERVATION MODAL */}
      {editingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121217] border border-[#2b2b38] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#22222d]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#f5f5f0]">
                  Edit Appointment #{editingReservation.id}
                </h3>
                <span className="text-xs text-[#8e8e98]">
                  Update appointment parameters in database
                </span>
              </div>
              <button
                onClick={() => setEditingReservation(null)}
                className="text-[#888894] hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={editingReservation.customerName}
                    onChange={(e) =>
                      setEditingReservation({ ...editingReservation, customerName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={editingReservation.mobile}
                    onChange={(e) =>
                      setEditingReservation({ ...editingReservation, mobile: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={editingReservation.date}
                    onChange={(e) =>
                      setEditingReservation({ ...editingReservation, date: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Time Slot *</label>
                  <input
                    type="time"
                    required
                    value={editingReservation.time}
                    onChange={(e) =>
                      setEditingReservation({ ...editingReservation, time: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Guests *</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={editingReservation.guests}
                    onChange={(e) =>
                      setEditingReservation({
                        ...editingReservation,
                        guests: parseInt(e.target.value, 10) || 1
                      })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Seating Area</label>
                  <select
                    value={editingReservation.seatingPreference}
                    onChange={(e) =>
                      setEditingReservation({
                        ...editingReservation,
                        seatingPreference: e.target.value as any
                      })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Indoor">Indoor (Main Hall)</option>
                    <option value="Outdoor">Outdoor (Veranda)</option>
                    <option value="Any Available">Any Available</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Status</label>
                  <select
                    value={editingReservation.status}
                    onChange={(e) =>
                      setEditingReservation({
                        ...editingReservation,
                        status: e.target.value as any
                      })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="seated">Seated</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#a0a0ab] font-medium mb-1">Special Requests</label>
                <textarea
                  rows={2}
                  value={editingReservation.specialRequests || ''}
                  onChange={(e) =>
                    setEditingReservation({
                      ...editingReservation,
                      specialRequests: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#22222d] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingReservation(null)}
                  className="px-4 py-2 bg-[#181822] hover:bg-[#252532] text-[#8e8e98] hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-black bg-[#d4af37] hover:bg-[#e8c679] rounded-lg cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW BOOKING MODAL */}
      {isNewBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121217] border border-[#2b2b38] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#22222d]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#f5f5f0]">
                  Create Manual / Phone Booking
                </h3>
                <span className="text-xs text-[#8e8e98]">
                  Immediately reserves a table and writes to Supabase
                </span>
              </div>
              <button
                onClick={() => setIsNewBookingOpen(false)}
                className="text-[#888894] hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Guest name"
                    value={newBookingData.customerName}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, customerName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={newBookingData.mobile}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, mobile: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newBookingData.date}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Time Slot *</label>
                  <input
                    type="time"
                    required
                    value={newBookingData.time}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, time: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Guests *</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={newBookingData.guests}
                    onChange={(e) =>
                      setNewBookingData({
                        ...newBookingData,
                        guests: parseInt(e.target.value, 10) || 2
                      })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Seating Area</label>
                  <select
                    value={newBookingData.seatingPreference}
                    onChange={(e) =>
                      setNewBookingData({
                        ...newBookingData,
                        seatingPreference: e.target.value as any
                      })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Indoor">Indoor (Main Hall)</option>
                    <option value="Outdoor">Outdoor (Veranda)</option>
                    <option value="Any Available">Any Available</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#a0a0ab] font-medium mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={newBookingData.email}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a0a0ab] font-medium mb-1">Special Requests / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. VIP table, road traveler stopover..."
                  value={newBookingData.specialRequests}
                  onChange={(e) =>
                    setNewBookingData({ ...newBookingData, specialRequests: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#181822] border border-[#282834] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#22222d] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewBookingOpen(false)}
                  className="px-4 py-2 bg-[#181822] hover:bg-[#252532] text-[#8e8e98] hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-black bg-[#d4af37] hover:bg-[#e8c679] rounded-lg cursor-pointer shadow-md"
                >
                  Confirm & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
