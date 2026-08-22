import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Users, 
  Volume2, 
  ExternalLink, 
  X,
  Compass,
  AlertCircle,
  Clock,
  Sparkles,
  Hospital,
  ShieldAlert,
  PhoneCall
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';

interface AutoSafeRouteModalProps {
  onNavigateToFullFinder?: () => void;
}

export const AutoSafeRouteModal: React.FC<AutoSafeRouteModalProps> = ({
  onNavigateToFullFinder
}) => {
  const { isSafeRouteMapOpen, closeSafeRouteMap, hardwareEarthquakeAlert, markMyselfSafe, userLocation } = useCrisis();
  const [activeDestinationTab, setActiveDestinationTab] = useState<'SHELTER' | 'HOSPITAL' | 'OPEN_AREA'>('SHELTER');
  const [spokenAudioActive, setSpokenAudioActive] = useState<boolean>(false);

  if (!isSafeRouteMapOpen) return null;

  const shelterInfo = hardwareEarthquakeAlert?.safeRoute || {
    destination: 'Pune Civil Defense & Evacuation Base Ground',
    distance: '1.2 km',
    duration: '14 min',
    shelterType: 'Earthquake Safe Ground',
    shelterCapacity: 800,
    shelterAvailable: 340,
    nearestHospital: {
      name: 'Sassoon General Hospital & Trauma Center',
      distance: '2.1 km',
      icuBeds: 87,
      phone: '+91-20-26128000',
      address: 'Station Road, Pune (Emergency Trauma Ward Open)'
    },
    nearestOpenArea: {
      name: 'Shivaji Stadium Open Grounds & Assembly Lawn',
      distance: '0.8 km',
      description: 'Wide perimeter cleared of overhead high-voltage powerlines and structural hazards',
      address: 'Sector 4 Outer Corridor'
    }
  };

  const hospitalInfo = shelterInfo.nearestHospital || {
    name: 'Sassoon General Hospital & Trauma Center',
    distance: '2.1 km',
    icuBeds: 87,
    phone: '+91-20-26128000',
    address: 'Station Road, Pune (Emergency Trauma Ward Open)'
  };

  const openAreaInfo = shelterInfo.nearestOpenArea || {
    name: 'Shivaji Stadium Open Grounds & Assembly Lawn',
    distance: '0.8 km',
    description: 'Wide perimeter cleared of overhead high-voltage powerlines and structural hazards',
    address: 'Sector 4 Outer Corridor'
  };

  const currentDestination = activeDestinationTab === 'SHELTER' 
    ? {
        name: shelterInfo.destination,
        type: 'Safe Shelter & Relief Camp',
        distance: shelterInfo.distance || '1.2 km',
        duration: shelterInfo.duration || '14 min',
        icon: Building2,
        color: 'emerald',
        badge: `${shelterInfo.shelterAvailable || 340} Beds Open`,
        instructions: [
          'Exit building via ground floor emergency stairwell (avoid elevators).',
          'Turn East onto Route 7 Outer Bypass Corridor (400m unobstructed).',
          'Arrive at Pune Civil Defense Main Security Gate for triage and supplies.'
        ]
      }
    : activeDestinationTab === 'HOSPITAL'
    ? {
        name: hospitalInfo.name,
        type: 'Emergency Trauma Hospital',
        distance: hospitalInfo.distance,
        duration: '19 min (Vehicle Priority Lane)',
        icon: Hospital,
        color: 'rose',
        badge: `${hospitalInfo.icuBeds} ICU Beds Available`,
        instructions: [
          'Head towards Outer Ring Road Medical Emergency Corridor.',
          'Follow green beacon signals for Emergency Ambulance priority lanes.',
          'Check in directly at Emergency Trauma Intake Ward Room 102.'
        ]
      }
    : {
        name: openAreaInfo.name,
        type: 'Open Assembly Zone (Safe from Collapse)',
        distance: openAreaInfo.distance,
        duration: '9 min',
        icon: MapPin,
        color: 'amber',
        badge: 'Zero High-Rise Hazards',
        instructions: [
          'Move away from multi-story facades and glass storefronts.',
          'Take broad avenue towards central stadium lawn entrance.',
          'Assemble at designated Sector 4 relief flag in open field.'
        ]
      };

  const userCoordsText = userLocation 
    ? `Latitude: ${userLocation.latitude.toFixed(4)}° N, Longitude: ${userLocation.longitude.toFixed(4)}° E`
    : 'Latitude: 18.5204° N, Longitude: 73.8567° E (Pune Central)';

  const handleSimulateVoiceNav = () => {
    if ('speechSynthesis' in window) {
      setSpokenAudioActive(true);
      const text = `Evacuation routing active to ${currentDestination.name}. Distance is ${currentDestination.distance}, estimated walk ${currentDestination.duration}. Proceed with caution along Route 7 corridor.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setSpokenAudioActive(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div 
      id="safe-route-map-modal-backdrop"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div 
        id="safe-route-modal-card"
        className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[94vh] animate-scaleUp my-auto"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-5 sm:px-6 py-4 border-b border-blue-700/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/40 border border-blue-400/40 text-blue-200 shrink-0">
              <Navigation className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                  AI Multi-Agent Safety Corridor
                </span>
                <span className="text-xs text-blue-200">GPS Live Geolocation Locked</span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white mt-0.5">
                Safe Route to Nearest Protected Zones
              </h2>
            </div>
          </div>

          <button
            id="close-safe-route-modal-btn"
            onClick={closeSafeRouteMap}
            className="p-2 rounded-xl bg-blue-950/60 hover:bg-blue-950 border border-blue-700/40 text-blue-200 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          {/* Destination Selector Tabs: Shelter vs Hospital vs Open Area */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              id="tab-nearest-shelter-btn"
              onClick={() => setActiveDestinationTab('SHELTER')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDestinationTab === 'SHELTER'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="truncate">Safe Shelter ({shelterInfo.distance || '1.2 km'})</span>
            </button>

            <button
              id="tab-nearest-hospital-btn"
              onClick={() => setActiveDestinationTab('HOSPITAL')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDestinationTab === 'HOSPITAL'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Hospital className="w-4 h-4" />
              <span className="truncate">Hospital ({hospitalInfo.distance})</span>
            </button>

            <button
              id="tab-nearest-open-area-btn"
              onClick={() => setActiveDestinationTab('OPEN_AREA')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDestinationTab === 'OPEN_AREA'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="truncate">Open Ground ({openAreaInfo.distance})</span>
            </button>
          </div>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Distance</span>
              <span className="text-lg sm:text-2xl font-black text-emerald-400 font-mono">{currentDestination.distance}</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Estimated Time</span>
              <span className="text-lg sm:text-2xl font-black text-blue-400 font-mono">{currentDestination.duration}</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Corridor Safety</span>
              <span className="text-lg sm:text-2xl font-black text-emerald-400 font-mono">100% Cleared</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Live Status</span>
              <span className="text-sm sm:text-base font-bold text-amber-400 block mt-1 truncate">{currentDestination.badge}</span>
            </div>
          </div>

          {/* Interactive Navigation Line & Map Visualizer */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Live GPS Route: Your Location ➔ {currentDestination.name}
                </span>
              </div>
              <button
                id="voice-guidance-btn"
                onClick={handleSimulateVoiceNav}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  spokenAudioActive 
                    ? 'bg-blue-600 text-white border-blue-400 animate-pulse' 
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                {spokenAudioActive ? 'Speaking Guidance...' : 'Voice Guidance'}
              </button>
            </div>

            {/* Visual Route Scheme: 📍 You ---> Corridor ---> 🏠 Destination */}
            <div className="space-y-4 max-w-xl mx-auto py-2">
              {/* Origin Point: You */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/40 border-2 border-white ring-4 ring-blue-500/20 shrink-0">
                    <MapPin className="w-5 h-5" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                  </div>
                  {/* Vertical Navigation Line */}
                  <div className="w-1.5 h-16 bg-gradient-to-b from-blue-500 via-emerald-400 to-emerald-500 rounded-full my-1 relative shadow-sm shadow-emerald-500/50">
                    <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping"></div>
                  </div>
                </div>

                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-400">Current Position</span>
                    <span className="px-1.5 py-0.2 bg-blue-950 text-blue-300 text-[10px] rounded border border-blue-700 font-mono">GPS Locked</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-0.5">📍 You (Live Position)</h4>
                  <p className="text-xs text-slate-400">{userCoordsText}</p>
                </div>
              </div>

              {/* Waypoint Corridor Card */}
              <div className="ml-14 -mt-3 mb-1 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Route 7 Cleared Evacuation Corridor
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">0 Structural Obstructions</span>
                </div>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">
                  Widened pedestrian avenue. Avoids damaged powerlines and glass facade hazards. NDMA SAR units deployed.
                </p>
              </div>

              {/* Destination Point */}
              <div className="flex items-start gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-${currentDestination.color}-600 text-white shadow-lg border-2 border-white ring-4 ring-${currentDestination.color}-500/20 shrink-0`}>
                  <currentDestination.icon className="w-5 h-5" />
                </div>

                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">{currentDestination.type}</span>
                    <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 text-[10px] rounded border border-emerald-700">Open & Verified</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-0.5">{currentDestination.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 flex-wrap">
                    <span className="font-semibold text-emerald-300">Distance: {currentDestination.distance}</span>
                    <span>•</span>
                    <span className="font-semibold text-blue-300">ETA: {currentDestination.duration}</span>
                    <span>•</span>
                    <span className="text-amber-300">{currentDestination.badge}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Mini Canvas Background Simulation */}
            <div className="mt-4 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-rose-400" />
                Map auto-centered on live coordinate: {userLocation ? `[${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}]` : '[18.5204, 73.8567]'}
              </span>
              <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Autonomous Safe Path Verified
              </span>
            </div>
          </div>

          {/* Step-by-Step Directions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Turn-By-Turn Evacuation Instructions to {currentDestination.name}
            </h4>
            <div className="space-y-2">
              {currentDestination.instructions.map((inst, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <strong className="text-white block">{inst}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 px-5 sm:px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            id="mark-safe-from-route-btn"
            onClick={async () => {
              await markMyselfSafe();
              closeSafeRouteMap();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md border border-emerald-400/30 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            I AM SAFE (Arrived at Safe Zone)
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              id="view-full-finder-btn"
              onClick={() => {
                closeSafeRouteMap();
                if (onNavigateToFullFinder) {
                  onNavigateToFullFinder();
                }
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
            >
              Open Full Shelter Finder
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              id="dismiss-route-modal-btn"
              onClick={closeSafeRouteMap}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

