import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Radio, 
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';
import { PublicAdvisory } from '../types';

interface CitizenEmergencyAlertModalProps {
  advisory: PublicAdvisory;
  onClose: () => void;
  onNavigateToShelters?: () => void;
  onNavigateToAdvisories?: () => void;
}

export const CitizenEmergencyAlertModal: React.FC<CitizenEmergencyAlertModalProps> = ({
  advisory,
  onClose,
  onNavigateToShelters,
  onNavigateToAdvisories,
}) => {
  const { 
    isSirenPlaying, 
    toggleSirenAudio, 
    markMyselfSafe, 
    shelters, 
    getDistanceToShelter,
    activeDirectives 
  } = useCrisis();

  const handleMarkSafe = async () => {
    await markMyselfSafe();
  };

  // Find nearest recommended shelter
  const nearestShelter = shelters[0];
  const nearestDist = nearestShelter ? getDistanceToShelter(nearestShelter) : null;

  return (
    <div 
      id="citizen-emergency-broadcast-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        id="citizen-emergency-broadcast-modal-card"
        className="w-full max-w-xl bg-slate-900 border-2 border-red-500 rounded-3xl shadow-2xl overflow-hidden animate-slideUp text-white my-auto"
      >
        {/* Top Emergency Flasher Header */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-rose-950 px-6 py-4 border-b border-red-600/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 border-2 border-white/60 flex items-center justify-center text-white shadow-lg animate-bounce">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-700 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                  NATIONAL EMERGENCY BROADCAST
                </span>
                <span className="text-[10px] text-red-200 font-mono">CAP PROTOCOL</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                {advisory.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-950/80 hover:bg-red-800 text-red-200 transition"
            title="Dismiss Emergency Alert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs sm:text-sm">
          {/* Audio Siren Banner */}
          <div className="bg-red-950/40 border border-red-800/70 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-300">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="font-semibold text-xs">
                Civil Defense Emergency Audio Warning
              </span>
            </div>
            <button
              onClick={() => toggleSirenAudio()}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isSirenPlaying
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {isSirenPlaying ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Siren Active (Mute)</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Play Siren</span>
                </>
              )}
            </button>
          </div>

          {/* Description & Impact Zones */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>ISSUING AUTHORITY: {advisory.issuedBy}</span>
              <span className="text-red-400 font-bold">LEVEL: {advisory.severity}</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-xs sm:text-sm bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl">
              {advisory.description}
            </p>
          </div>

          {/* Key Evacuation Instructions & Routes */}
          <div className="bg-blue-950/50 border border-blue-800/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-blue-200 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-blue-400" />
                <span>OFFICIAL EVACUATION DIRECTIVES & SAFE CORRIDOR</span>
              </h4>
              <span className="text-[10px] text-emerald-400 font-mono">APPROVED PLAN</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/90 border border-emerald-700/60 p-2.5 rounded-xl">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  RECOMMENDED SAFE CORRIDOR
                </div>
                <div className="font-semibold text-white mt-0.5">Route 7 Outer Bypass</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Cleared for civilian evacuation (14 min avg)</div>
              </div>

              <div className="bg-slate-900/90 border border-red-700/60 p-2.5 rounded-xl">
                <div className="text-[10px] font-mono text-red-400 font-bold uppercase">
                  HAZARD / BLOCKED ROUTE
                </div>
                <div className="font-semibold text-red-200 mt-0.5">Avoid Highway Route 4 / NH-48</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Structural fissure & debris reported</div>
              </div>
            </div>
          </div>

          {/* Nearest Shelter Callout */}
          {nearestShelter && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold">
                    Primary Safe Evacuation Hub
                  </div>
                  <div className="font-bold text-white text-xs sm:text-sm">
                    {nearestShelter.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {nearestDist !== null ? `${nearestDist} km from your GPS` : 'Available for civilian intake'} • {nearestShelter.availability} Beds Free
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToShelters) onNavigateToShelters();
                }}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition shrink-0 flex items-center gap-1"
              >
                <span>Navigate</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              id="btn-alert-mark-safe"
              onClick={handleMarkSafe}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 border border-emerald-400/50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I AM SAFE (Mark Check-in)</span>
            </button>

            <button
              id="btn-alert-view-advisories"
              onClick={() => {
                onClose();
                if (onNavigateToAdvisories) onNavigateToAdvisories();
              }}
              className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>View All Disaster Advisories</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>National Disaster Management Authority • CAP ID: {advisory.id}</span>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white font-semibold underline"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
