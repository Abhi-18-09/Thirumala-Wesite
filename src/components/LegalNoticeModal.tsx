import React from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { RestaurantSettings } from '../data/restaurantData';

interface LegalNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RestaurantSettings;
}

export const LegalNoticeModal: React.FC<LegalNoticeModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121217] border border-[#2b2b36] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#22222c]">
          <div className="flex items-center gap-2.5 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-serif text-lg text-[#f5f5f0] font-semibold">
              Responsible Service & Legal Compliance Notice
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9595a0] hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#a0a0ab] leading-relaxed">
          <p className="p-3.5 bg-[#181822] border border-[#262634] rounded-xl text-[#ededeb]">
            {settings.legalNotice}
          </p>

          <div className="space-y-2.5">
            <h4 className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
              Key Compliance Guidelines:
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Legal Age:</strong> In the state of Karnataka, consumption of alcoholic beverages is strictly restricted to individuals aged 21 years and above.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Identification:</strong> Staff reserve the right to verify government-recognized photo ID (Aadhaar, Passport, Voter ID, Driving License) prior to service.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Highway Safety:</strong> We actively discourage drinking and driving. Designate a sober driver for safe travels along NH 48.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Family Seating:</strong> Separate family and dining sections are maintained to ensure a comfortable dining environment for all guests.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-[#22222c] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-black bg-[#d4af37] hover:bg-[#e8c679] rounded-lg cursor-pointer"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
