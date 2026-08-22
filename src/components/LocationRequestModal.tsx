import React from 'react';
import { MapPin, ShieldAlert, Clock, X, Check, XCircle } from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';
import { LocationRequestRecord } from '../types';

interface LocationRequestModalProps {
  request: LocationRequestRecord | null;
  onClose: () => void;
}

export const LocationRequestModal: React.FC<LocationRequestModalProps> = ({ request, onClose }) => {
  const { respondToLocationRequest } = useCrisis();

  if (!request) return null;

  const handleDecision = async (decision: 'once' | '30m' | '1h' | 'declined') => {
    await respondToLocationRequest(request.id, decision);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border-2 border-blue-500/80 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative overflow-hidden">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500 flex items-center justify-center mx-auto mb-3 text-blue-400">
            <MapPin className="w-7 h-7 animate-bounce" />
          </div>

          <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-800 mb-2">
            Consent-Based Location System
          </div>

          <h3 className="text-lg font-bold text-white mb-1.5">
            Location Request Notification
          </h3>

          <p className="text-sm text-slate-200 mb-4 px-2">
            <strong className="text-blue-400 font-bold">{request.requesterName}</strong> is requesting your location. Do you want to share it?
          </p>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-left text-xs space-y-1.5 mb-5">
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strictly On-Demand: <strong>NO PERMANENT 24/7 TRACKING</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Location automatically expires once the selected timer lapses.</span>
            </div>
          </div>

          {/* Action Decision Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => handleDecision('once')}
              className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Allow Once</span>
            </button>

            <button
              onClick={() => handleDecision('30m')}
              className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Allow For 30 Minutes</span>
            </button>

            <button
              onClick={() => handleDecision('1h')}
              className="py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Allow For 1 Hour</span>
            </button>

            <button
              onClick={() => handleDecision('declined')}
              className="py-2.5 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Decline</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
