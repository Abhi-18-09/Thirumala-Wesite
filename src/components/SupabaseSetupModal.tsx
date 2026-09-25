import React, { useState, useEffect } from 'react';
import { X, Database, Check, Copy, ExternalLink, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase, SUPABASE_PROJECT_ID, SUPABASE_URL, SUPABASE_SQL_SETUP, fetchSupabaseReservations } from '../lib/supabase';
import { Reservation } from '../data/restaurantData';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'table_missing' | 'error';
    message: string;
    count?: number;
  }>({ status: 'idle', message: '' });
  const [recentRows, setRecentRows] = useState<Reservation[]>([]);

  useEffect(() => {
    if (isOpen) {
      testConnection();
    }
  }, [isOpen]);

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      // Test querying the reservations table
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .limit(5);

      if (!error) {
        setTestResult({
          status: 'success',
          message: `Successfully connected to Supabase table "reservations". Found ${data?.length || 0} recent record(s).`,
          count: data?.length || 0
        });
        const rows = await fetchSupabaseReservations();
        setRecentRows(rows);
      } else if (error.code === '42P01' || error.message?.includes('does not exist')) {
        setTestResult({
          status: 'table_missing',
          message: `Connected to Supabase project "${SUPABASE_PROJECT_ID}", but the "reservations" table has not been created yet in your database.`
        });
      } else {
        setTestResult({
          status: 'error',
          message: `Connection error: ${error.message} (Code: ${error.code})`
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: err?.message || 'Failed to communicate with Supabase API'
      });
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121217] border border-[#2b2b36] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs sm:text-sm">
        
        {/* Header */}
        <div className="p-5 border-b border-[#22222c] flex items-center justify-between bg-[#15151b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#f5f5f0] font-semibold">
                Supabase Backend Integration
              </h3>
              <p className="text-[11px] text-[#8e8e98]">
                Connected to Project: <span className="font-mono text-[#e8c679]">{SUPABASE_PROJECT_ID}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9595a0] hover:text-white p-1 rounded-lg hover:bg-[#202028]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Connection Overview */}
          <div className="p-4 rounded-xl bg-[#16161d] border border-[#262632] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#a0a0ab] font-semibold">
                Configuration Details
              </span>
              <button
                onClick={testConnection}
                disabled={testing}
                className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:underline cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
                <span>Test Live Connection</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#757582] block">Project URL</span>
                <span className="font-mono text-[#ededeb] text-[11px] truncate block">
                  {SUPABASE_URL}
                </span>
              </div>
              <div>
                <span className="text-[#757582] block">API Key Status</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Configured & Active</span>
                </span>
              </div>
            </div>

            {/* Test Status Feedback */}
            {testResult.status !== 'idle' && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                  testResult.status === 'success'
                    ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                    : testResult.status === 'table_missing'
                    ? 'bg-amber-950/40 border-amber-600/40 text-amber-300'
                    : 'bg-red-950/40 border-red-600/40 text-red-300'
                }`}
              >
                {testResult.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                )}
                <div className="flex-1">
                  <p>{testResult.message}</p>
                  {testResult.status === 'table_missing' && (
                    <p className="mt-1 text-[11px] opacity-90">
                      Run the SQL script below in your Supabase SQL Editor to initialize the database tables.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick SQL Schema Setup Script */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                  Database Table Setup (SQL Script)
                </h4>
                <p className="text-[11px] text-[#8e8e98]">
                  Run this once in your Supabase Dashboard &gt; SQL Editor to create the tables and allow anonymous bookings:
                </p>
              </div>
              <button
                onClick={copySql}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1f1f28] hover:bg-[#282834] border border-[#323240] rounded-lg text-xs font-medium text-[#ededeb] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="p-3.5 bg-[#0a0a0c] border border-[#22222a] rounded-xl text-[11px] font-mono text-[#a6e22e] overflow-x-auto max-h-48 scrollbar-thin">
              {SUPABASE_SQL_SETUP}
            </pre>
          </div>

          {/* Recent Synced Bookings */}
          {recentRows.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-[#ededeb] font-semibold">
                Live Bookings in Supabase ({recentRows.length})
              </h4>
              <div className="divide-y divide-[#202028] max-h-40 overflow-y-auto rounded-lg border border-[#22222a] bg-[#0e0e12]">
                {recentRows.map((item) => (
                  <div key={item.id} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-[#e8c679] font-medium mr-2">{item.id}</span>
                      <span className="text-[#ededeb] font-medium">{item.customerName}</span>
                      <span className="text-[#757582] ml-2">({item.guests} guests · {item.date} {item.time})</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-[#15151c] rounded-xl border border-[#22222a] flex items-center justify-between text-xs">
            <span className="text-[#888894]">
              Open your Supabase project dashboard to view and manage all rows:
            </span>
            <a
              href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/editor`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#d4af37] hover:underline font-medium"
            >
              <span>Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#22222c] bg-[#15151b] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-black bg-[#d4af37] hover:bg-[#e8c679] rounded-lg cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
