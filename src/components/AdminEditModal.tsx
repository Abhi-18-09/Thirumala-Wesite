import React, { useState } from 'react';
import { X, Save, RotateCcw, CheckCircle2 } from 'lucide-react';
import { RestaurantSettings, defaultRestaurantSettings } from '../data/restaurantData';

interface AdminEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RestaurantSettings;
  onSave: (updated: RestaurantSettings) => void;
}

export const AdminEditModal: React.FC<AdminEditModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [formData, setFormData] = useState<RestaurantSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all settings to initial defaults?")) {
      setFormData(defaultRestaurantSettings);
      onSave(defaultRestaurantSettings);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121217] border border-[#2c2c38] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#22222c] flex items-center justify-between bg-[#16161c]">
          <div>
            <h3 className="font-serif text-lg text-[#f5f5f0] font-semibold">
              Business Information & Settings (Editable Placeholders)
            </h3>
            <p className="text-xs text-[#8e8e98]">
              Modify details live. Information persists across sessions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9595a0] hover:text-white p-1 rounded-lg hover:bg-[#202028]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {savedSuccess && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-600/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings saved and updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1">
                Business Display Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#1a1a22] border border-[#2a2a35] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1">
                Phone Number (Direct Call)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-[#1a1a22] border border-[#2a2a35] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1">
                WhatsApp Number (with Country Code e.g. 919448052310)
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3 py-2 bg-[#1a1a22] border border-[#2a2a35] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-[#1a1a22] border border-[#2a2a35] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1">
              Opening Hours Display String
            </label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              className="w-full px-3 py-2 bg-[#1a1a22] border border-[#2a2a35] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1">
              Address & Highway Landmark
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-[#1a1a22] border border-[#2a2a35] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1">
                Max Party Size
              </label>
              <input
                type="number"
                min="2"
                max="30"
                value={formData.maxGuestsPerBooking}
                onChange={(e) => setFormData({ ...formData, maxGuestsPerBooking: parseInt(e.target.value, 10) || 12 })}
                className="w-full px-3 py-2 bg-[#1a1a22] border border-[#2a2a35] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1">
                Total Capacity
              </label>
              <input
                type="number"
                min="20"
                max="300"
                value={formData.totalTableCapacity}
                onChange={(e) => setFormData({ ...formData, totalTableCapacity: parseInt(e.target.value, 10) || 80 })}
                className="w-full px-3 py-2 bg-[#1a1a22] border border-[#2a2a35] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#9e9ea8] font-medium mb-1">
                Google Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.googleRating}
                onChange={(e) => setFormData({ ...formData, googleRating: parseFloat(e.target.value) || 3.9 })}
                className="w-full px-3 py-2 bg-[#1a1a22] border border-[#2a2a35] rounded-lg text-[#ededeb] focus:border-[#d4af37] focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#20202a] flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-[#8e8e98] hover:text-[#d4af37] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#b0b0ba] hover:text-white bg-[#1a1a22] border border-[#282834] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-black bg-[#d4af37] hover:bg-[#e8c679] rounded-lg cursor-pointer shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
