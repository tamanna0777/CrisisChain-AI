import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Activity, 
  Users, 
  Navigation, 
  Radio, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  Zap, 
  PhoneCall,
  X,
  Hospital,
  Compass,
  Clock,
  Cpu
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';

interface HardwareEmergencyModalProps {
  onOpenSafeRoute?: () => void;
  onNavigateToFamily?: () => void;
}

export const HardwareEmergencyModal: React.FC<HardwareEmergencyModalProps> = ({
  onOpenSafeRoute,
  onNavigateToFamily
}) => {
  const { 
    isHardwareAlertOpen, 
    hardwareEarthquakeAlert, 
    dismissHardwareAlert, 
    openSafeRouteMap,
    isSirenPlaying,
    toggleSirenAudio,
    markMyselfSafe,
    triggerEmergencySOS,
    userLocation
  } = useCrisis();

  if (!isHardwareAlertOpen || !hardwareEarthquakeAlert) return null;

  const alert = hardwareEarthquakeAlert;
  const isReal = alert.isRealHardware !== false;

  const handleViewSafeRoute = () => {
    openSafeRouteMap();
    if (onOpenSafeRoute) {
      onOpenSafeRoute();
    }
  };

  const handleIAmSafe = async () => {
    await markMyselfSafe();
    dismissHardwareAlert();
  };

  const handleSendSOS = async () => {
    await triggerEmergencySOS({
      emergencyType: 'EARTHQUAKE_TRAPPED',
      shareWithFamily: true,
      shareWithEmergencyServices: true,
      shareWithVolunteers: true,
      locationMode: 'Live Location For 1 Hour',
      notes: 'Autonomous ESP32 MPU6050 Shake Triggered SOS Distress Call'
    });
    dismissHardwareAlert();
  };

  const shelter = alert.safeRoute;
  const hospital = alert.safeRoute?.nearestHospital || {
    name: 'Sassoon General Hospital & Trauma Center',
    distance: '2.1 km',
    icuBeds: 87,
    phone: '+91-20-26128000',
    address: 'Station Road, Pune (Emergency Trauma Ward Open)'
  };
  const openArea = alert.safeRoute?.nearestOpenArea || {
    name: 'Shivaji Stadium Open Grounds & Assembly Lawn',
    distance: '0.8 km',
    description: 'Wide perimeter cleared of overhead high-voltage powerlines and structural hazards',
    address: 'Sector 4 Outer Corridor'
  };

  const timeFormatted = new Date(alert.timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div 
      id="hardware-emergency-modal-backdrop"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div 
        id="hardware-emergency-card"
        className="w-full max-w-3xl bg-slate-900 border-2 border-red-500 rounded-2xl shadow-2xl overflow-hidden text-white relative animate-scaleUp max-h-[94vh] flex flex-col my-auto"
      >
        {/* Glowing Red Emergency Banner Header */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 px-5 sm:px-6 py-4 border-b border-red-500/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-red-950/80 border border-red-300/40 text-red-200 shadow-inner shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-90"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-200 border border-red-400/50 text-[10px] font-black tracking-wider uppercase animate-pulse">
                  {isReal ? '🚨 LIVE ESP32 HARDWARE EVENT' : '⚡ DEMO SIMULATION DRILL'}
                </span>
                <span className="text-xs text-red-100 font-semibold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> MPU-6050 Vibration
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white mt-0.5">
                CRISIS ALERT DETECTED
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Siren Audio Toggle */}
            <button
              id="alarm-sound-toggle-btn"
              onClick={() => toggleSirenAudio()}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
                isSirenPlaying 
                  ? 'bg-amber-500/30 border-amber-400 text-amber-300 animate-bounce' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isSirenPlaying ? "Mute Alarm Sound" : "Play Alarm Sound"}
            >
              {isSirenPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Close Button */}
            <button
              id="dismiss-emergency-alert-btn"
              onClick={dismissHardwareAlert}
              className="p-2 sm:p-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-400/40 text-red-200 hover:text-white transition-all cursor-pointer"
              title="Dismiss Popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 bg-gradient-to-b from-slate-900 to-slate-950 overflow-y-auto">
          {/* Key 5 Diagnostic Points required by prompt: Crisis Type, Severity, Device ID, Time Detected, Current User Location */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Crisis Type</span>
              <span className="text-xs font-black uppercase text-red-400 mt-1 block truncate">
                Earthquake Shockwave
              </span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Severity</span>
              <span className="text-xs font-black uppercase text-amber-400 mt-1 px-1.5 py-0.5 bg-amber-950/60 rounded border border-amber-500/30 inline-block">
                {alert.severity.toUpperCase()} (M{alert.magnitude})
              </span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Device ID</span>
              <span className="text-xs font-mono font-bold text-emerald-400 mt-1 block truncate">
                {alert.deviceId}
              </span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Detected</span>
              <span className="text-xs font-mono font-bold text-blue-300 mt-1 block">
                {timeFormatted}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">User Location</span>
              <span className="text-xs font-semibold text-white mt-1 block truncate">
                {userLocation ? `${userLocation.latitude.toFixed(3)}°N, ${userLocation.longitude.toFixed(3)}°E` : alert.location}
              </span>
            </div>
          </div>

          {/* Accelerometer Telemetry Card */}
          <div className="grid grid-cols-3 gap-2.5 bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center">
            <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Lateral Acc-X</span>
              <span className="text-base font-black font-mono text-red-400">{alert.accelerationX}g</span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Longitudinal Acc-Y</span>
              <span className="text-base font-black font-mono text-red-400">{alert.accelerationY}g</span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Vertical Acc-Z</span>
              <span className="text-base font-black font-mono text-blue-400">{alert.accelerationZ}g</span>
            </div>
          </div>

          {/* 3 Critical Generated Safe Destinations: Nearest Shelter, Nearest Hospital, Nearest Open Area */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-400" />
              Autonomous AI Facility Routing (Generated for Your Location)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Nearest Safe Shelter */}
              <div className="bg-slate-800/80 border border-emerald-500/40 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> Nearest Safe Shelter
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-300">{shelter?.distance || '1.2 km'}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{shelter?.destination || 'Pune Civil Defense Base'}</h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Capacity: <strong>{shelter?.shelterAvailable || 340} / {shelter?.shelterCapacity || 800}</strong> beds open
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-700/60 text-[10px] text-emerald-300 font-semibold">
                  ✓ Verified structurally safe
                </div>
              </div>

              {/* 2. Nearest Hospital */}
              <div className="bg-slate-800/80 border border-rose-500/40 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                      <Hospital className="w-3.5 h-3.5" /> Nearest Hospital
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-300">{hospital.distance}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{hospital.name}</h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Trauma Ward: <strong>{hospital.icuBeds} ICU Beds Available</strong>
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-700/60 text-[10px] text-rose-300 font-semibold">
                  📞 Emergency: {hospital.phone}
                </div>
              </div>

              {/* 3. Nearest Open Area */}
              <div className="bg-slate-800/80 border border-amber-500/40 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Nearest Open Area
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300">{openArea.distance}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{openArea.name}</h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    {openArea.description}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-700/60 text-[10px] text-amber-300 font-semibold">
                  ✓ Safe perimeter assembly zone
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. VIEW SAFE ROUTE (Glowing Primary Button) */}
            <button
              id="view-safe-route-btn"
              onClick={handleViewSafeRoute}
              className="sm:col-span-3 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base tracking-wide shadow-lg shadow-blue-600/30 border border-blue-400/40 transition-all transform active:scale-98 cursor-pointer"
            >
              <Navigation className="w-5 h-5 animate-spin-slow" />
              VIEW SAFE ROUTE ({shelter?.distance || '1.2 km'} • {shelter?.duration || '14 min'})
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>

            {/* 2. I AM SAFE */}
            <button
              id="i-am-safe-modal-btn"
              onClick={handleIAmSafe}
              className="sm:col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md border border-emerald-400/30 transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              I AM SAFE (Check-In to Civil Defense)
            </button>

            {/* 3. SEND SOS */}
            <button
              id="send-sos-modal-btn"
              onClick={handleSendSOS}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md border border-red-400/30 transition-all active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" />
              SEND SOS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

