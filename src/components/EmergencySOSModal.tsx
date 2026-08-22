import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Users, 
  ShieldAlert, 
  Radio, 
  Volume2, 
  VolumeX, 
  X, 
  Flame, 
  HeartPulse, 
  Navigation,
  Check,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCrisis } from '../context/CrisisContext';
import { EmergencyType } from '../types';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose }) => {
  const { userProfile } = useAuth();
  const { 
    triggerEmergencySOS, 
    userLocation, 
    requestUserGeolocation,
    isSirenPlaying,
    toggleSirenAudio
  } = useCrisis();

  const [emergencyType, setEmergencyType] = useState<EmergencyType>('Medical Emergency');
  const [shareWithFamily, setShareWithFamily] = useState(true);
  const [shareWithEmergencyServices, setShareWithEmergencyServices] = useState(true);
  const [shareWithVolunteers, setShareWithVolunteers] = useState(true);
  const [locationMode, setLocationMode] = useState<
    'Current Location' | 'Live Location For 30 Minutes' | 'Live Location For 1 Hour'
  >('Live Location For 30 Minutes');
  const [emergencyNotes, setEmergencyNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  if (!isOpen) return null;

  const emergencyOptions: { type: EmergencyType; icon: string; color: string }[] = [
    { type: 'Medical Emergency', icon: 'HeartPulse', color: 'text-red-400' },
    { type: 'Earthquake', icon: 'Activity', color: 'text-amber-400' },
    { type: 'Flood', icon: 'Waves', color: 'text-blue-400' },
    { type: 'Fire', icon: 'Flame', color: 'text-orange-400' },
    { type: 'Accident', icon: 'Car', color: 'text-yellow-400' },
    { type: 'Trapped', icon: 'Lock', color: 'text-purple-400' },
    { type: 'Missing Person', icon: 'UserX', color: 'text-pink-400' },
    { type: 'Other', icon: 'AlertCircle', color: 'text-slate-400' },
  ];

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ensure GPS is fresh
      await requestUserGeolocation();

      await triggerEmergencySOS({
        emergencyType,
        shareWithFamily,
        shareWithEmergencyServices,
        shareWithVolunteers,
        locationMode,
        notes: emergencyNotes,
      });

      setAlertSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setAlertSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-red-500/80 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Urgent header styling */}
        <div className="flex items-center justify-between border-b border-red-900/60 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                EMERGENCY SOS SYSTEM
              </h2>
              <p className="text-[11px] text-red-300">
                Official Multi-Channel Distress Broadcast
              </p>
            </div>
          </div>

          <button
            onClick={handleDone}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!alertSent ? (
          <form onSubmit={handleSendAlert} className="space-y-4">
            {/* Emergency Type Selection */}
            <div>
              <label className="block text-xs font-bold text-red-300 uppercase tracking-wider mb-1.5">
                Select Emergency Type *
              </label>
              <select
                id="select-emergency-type"
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value as EmergencyType)}
                className="w-full bg-slate-800 border-2 border-red-500/60 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {emergencyOptions.map((opt) => (
                  <option key={opt.type} value={opt.type} className="bg-slate-900 text-white">
                    {opt.type}
                  </option>
                ))}
              </select>
            </div>

            {/* Share Alert With Checkboxes */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 space-y-2.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                Share Alert With:
              </label>

              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={shareWithFamily}
                    onChange={(e) => setShareWithFamily(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-red-500 h-4 w-4"
                  />
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Family Members (Instant Push & SMS Broadcast)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={shareWithEmergencyServices}
                    onChange={(e) => setShareWithEmergencyServices(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-red-500 h-4 w-4"
                  />
                  <ShieldAlert className="w-4 h-4 text-blue-400" />
                  <span>Emergency Services (Police 100, Ambulance 108, NDRF 1070)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={shareWithVolunteers}
                    onChange={(e) => setShareWithVolunteers(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-red-500 h-4 w-4"
                  />
                  <Radio className="w-4 h-4 text-amber-400" />
                  <span>Nearby Civil Defense Volunteers (5km Radius)</span>
                </label>
              </div>
            </div>

            {/* Location Sharing Options */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Location Sharing Duration</span>
                <span className="text-[10px] text-slate-400">Auto-expires after period</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  'Current Location',
                  'Live Location For 30 Minutes',
                  'Live Location For 1 Hour',
                ].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setLocationMode(mode as any)}
                    className={`py-2 px-2 text-[11px] font-semibold rounded-lg border text-center transition ${
                      locationMode === mode
                        ? 'bg-red-600 text-white border-red-400 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {mode === 'Current Location' ? 'Snapshot Once' : mode.replace('Live Location For ', 'Live ')}
                  </button>
                ))}
              </div>
            </div>

            {/* GPS Telemetry Preview */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400 animate-bounce" />
                <div>
                  <div className="font-semibold text-white">Live GPS Satellite Fix</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {userLocation ? `${userLocation.latitude.toFixed(5)}°N, ${userLocation.longitude.toFixed(5)}°E (±${Math.round(userLocation.accuracy || 10)}m)` : 'Acquiring GPS fix...'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                Verified
              </span>
            </div>

            {/* Emergency Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Additional Situation Notes (Optional)
              </label>
              <textarea
                value={emergencyNotes}
                onChange={(e) => setEmergencyNotes(e.target.value)}
                placeholder="e.g. Water entering ground floor, 2 seniors need evacuation assistance."
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* Siren test & Dispatch Buttons */}
            <div className="pt-2 space-y-2">
              <button
                id="btn-confirm-send-sos"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-extrabold text-sm shadow-xl shadow-red-900/50 transition flex items-center justify-center gap-2 disabled:opacity-50 animate-pulse border border-red-300"
              >
                <AlertTriangle className="w-5 h-5" />
                {isSubmitting ? 'Transmitting High-Priority Distress...' : 'Confirm & Send Emergency Alert'}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Transmits Name, Phone, GPS & Timestamp</span>
                <button
                  type="button"
                  onClick={() => toggleSirenAudio()}
                  className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  {isSirenPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  {isSirenPlaying ? 'Mute Siren Tone' : 'Trigger Audio Siren'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-3 space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-red-600/40">
              <ShieldAlert className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                SOS DISTRESS ALERT TRANSMITTED
              </h3>
              <p className="text-xs text-red-300 mt-1">
                Your emergency beacon is broadcasted to Family & First Responders.
              </p>
            </div>

            {/* Broadcast Details Card */}
            <div className="bg-slate-800/90 border border-red-700/80 rounded-xl p-4 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-slate-700 pb-1.5">
                <span className="text-slate-400">Caller:</span>
                <span className="font-bold text-white">{userProfile?.name} ({userProfile?.phone})</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-1.5">
                <span className="text-slate-400">Emergency Type:</span>
                <span className="font-bold text-red-400">{emergencyType.toUpperCase()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-1.5">
                <span className="text-slate-400">GPS Coordinates:</span>
                <span className="text-emerald-300">{userLocation?.latitude.toFixed(5)}, {userLocation?.longitude.toFixed(5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Broadcast Channels:</span>
                <span className="text-blue-300">Family + Police (100) + NDRF (1070)</span>
              </div>
            </div>

            {/* Quick emergency hotline shortcuts */}
            <div className="flex gap-2">
              <a
                href="tel:100"
                className="flex-1 py-2.5 px-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Police 100
              </a>
              <a
                href="tel:108"
                className="flex-1 py-2.5 px-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <HeartPulse className="w-3.5 h-3.5" /> Ambulance 108
              </a>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
            >
              Monitor Response on Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
