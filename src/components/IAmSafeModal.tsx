import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Users, Radio, X, HeartHandshake, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCrisis } from '../context/CrisisContext';

interface IAmSafeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IAmSafeModal: React.FC<IAmSafeModalProps> = ({ isOpen, onClose }) => {
  const { userProfile } = useAuth();
  const { markMyselfSafe, civilDefenseSafeCount, familyMembers } = useCrisis();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirmSafe = async () => {
    setLoading(true);
    try {
      await markMyselfSafe();
      setConfirmed(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleDone}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmed ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
              Mark Yourself Safe
            </h2>
            
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Confirming your safety relieves cellular network congestion and reassures your connected family members during disaster events.
            </p>

            {/* What Happens Panel */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 text-left text-xs space-y-2.5 mb-6">
              <div className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-white">Family Notification:</span>
                  <p className="text-slate-300 text-[11px]">
                    "{userProfile?.name || 'You'} has marked themselves safe." sent to all {familyMembers.length} accepted family members.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Radio className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-white">Government & Civil Defense:</span>
                  <p className="text-slate-300 text-[11px]">
                    Receives safe confirmation count only. <strong>No GPS location or personal details</strong> are transmitted.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              
              <button
                id="btn-confirm-i-am-safe"
                type="button"
                disabled={loading}
                onClick={handleConfirmSafe}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {loading ? 'Transmitting...' : 'Confirm: I AM SAFE'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4 animate-bounce">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <h2 className="text-xl font-bold text-emerald-400 mb-1">
              Safety Status Confirmed!
            </h2>
            <p className="text-xs text-slate-300 mb-4">
              Your family network has been notified. Civil Defense regional safety counter updated.
            </p>

            <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-xl p-3.5 mb-5 text-xs text-emerald-200">
              <div className="font-mono text-xl font-extrabold text-white mb-0.5">
                {civilDefenseSafeCount.toLocaleString()} Citizens Safe
              </div>
              <span className="text-[11px] text-emerald-300">
                National Disaster Registry Active Count
              </span>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
            >
              Return to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
