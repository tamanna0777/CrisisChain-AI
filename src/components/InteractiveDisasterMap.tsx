import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Crosshair, 
  ShieldCheck, 
  AlertTriangle, 
  Home, 
  HeartPulse, 
  Eye, 
  RefreshCw,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  Users
} from 'lucide-react';
import { SafeShelter } from '../types';

export interface MapPOI {
  id: string;
  name: string;
  type: 'shelter' | 'hospital' | 'open_ground' | 'hazard' | 'user' | 'family';
  latitude: number;
  longitude: number;
  distanceKm?: number;
  capacity?: number;
  available?: number;
  status: string;
  address: string;
  phone?: string;
  details?: string;
}

interface InteractiveDisasterMapProps {
  userLocation: { latitude: number; longitude: number } | null;
  shelters?: SafeShelter[];
  customPOIs?: MapPOI[];
  activeRouteDestination?: MapPOI | SafeShelter | null;
  onSelectPOI?: (poi: MapPOI) => void;
  height?: string;
  showLayersControl?: boolean;
}

export const InteractiveDisasterMap: React.FC<InteractiveDisasterMapProps> = ({
  userLocation,
  shelters = [],
  customPOIs = [],
  activeRouteDestination,
  onSelectPOI,
  height = 'h-96',
  showLayersControl = true,
}) => {
  // Map viewport state (zoom and pan offsets)
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null);

  // Layer filters
  const [showShelters, setShowShelters] = useState<boolean>(true);
  const [showHospitals, setShowHospitals] = useState<boolean>(true);
  const [showHazardZones, setShowHazardZones] = useState<boolean>(true);
  const [showEvacuationRoutes, setShowEvacuationRoutes] = useState<boolean>(true);
  const [showFamily, setShowFamily] = useState<boolean>(true);

  // Default coordinate center (Pune City Core)
  const centerLat = userLocation?.latitude || 18.5204;
  const centerLng = userLocation?.longitude || 73.8567;

  // Realistic POIs for emergency response
  const defaultPOIs: MapPOI[] = [
    {
      id: 'hosp-1',
      name: 'Sassoon General Hospital & Level-1 Trauma Center',
      type: 'hospital',
      latitude: centerLat + 0.012,
      longitude: centerLng + 0.015,
      distanceKm: 1.8,
      capacity: 350,
      available: 84,
      status: 'CRITICAL TRIAGE ACTIVE',
      address: 'Station Road, Pune Central',
      phone: '+91 20 2612 8000',
      details: '84 ICU Beds with backup solar generators and oxygen triage corridor.',
    },
    {
      id: 'hosp-2',
      name: 'Armed Forces Medical College (AFMC) Emergency Wing',
      type: 'hospital',
      latitude: centerLat - 0.018,
      longitude: centerLng + 0.022,
      distanceKm: 2.9,
      capacity: 220,
      available: 62,
      status: 'OPERATIONAL',
      address: 'Southern Command Hospital Complex, Wanowrie',
      phone: '+91 20 2636 3301',
      details: 'Military Disaster Surgical Squad deployed. Helipad active for air ambulance.',
    },
    {
      id: 'ground-1',
      name: 'Shivaji Stadium Open Assembly Grounds',
      type: 'open_ground',
      latitude: centerLat - 0.009,
      longitude: centerLng - 0.014,
      distanceKm: 1.1,
      capacity: 5000,
      available: 3850,
      status: 'OPEN SECURE GROUND',
      address: 'Sector 4 Sports Perimeter, Shivajinagar',
      phone: '+91 20 2553 4421',
      details: 'Zero overhead hazards. Clear perimeter with drinking water bowsers and Red Cross tent.',
    },
    {
      id: 'ground-2',
      name: 'Saras Baug Emergency Evacuation Lawn',
      type: 'open_ground',
      latitude: centerLat + 0.021,
      longitude: centerLng - 0.018,
      distanceKm: 2.4,
      capacity: 3500,
      available: 2600,
      status: 'OPEN SECURE GROUND',
      address: 'Swargate Outer Circle',
      phone: '+91 20 2444 1122',
      details: 'NDRF staging zone with satellite communication truck.',
    },
    {
      id: 'hazard-1',
      name: 'Bridge 4 Fracture Zone (Sector B)',
      type: 'hazard',
      latitude: centerLat + 0.008,
      longitude: centerLng - 0.007,
      status: 'IMPASSABLE - STRUCTURAL COLLAPSE',
      address: 'Old Pune River Overpass',
      details: 'Structural cracks detected by MPU6050 geophone. SDRF barricades placed. DO NOT USE.',
    },
    {
      id: 'hazard-2',
      name: 'High-Voltage Powerline Hazard',
      type: 'hazard',
      latitude: centerLat - 0.014,
      longitude: centerLng + 0.009,
      status: 'LIVE ELECTRIC WIRE HAZARD',
      address: 'Substation Road Junction',
      details: 'Transfomer damage. MSEDCL emergency isolation squad on-site.',
    },
  ];

  // Convert shelters to POIs
  const shelterPOIs: MapPOI[] = shelters.map((s) => ({
    id: `sh-${s.id}`,
    name: s.name,
    type: 'shelter',
    latitude: s.latitude,
    longitude: s.longitude,
    distanceKm: s.distanceKm || 1.2,
    capacity: s.capacity,
    available: s.availability,
    status: s.status,
    address: s.address,
    phone: s.contactNumber,
    details: `NDMA verified shelter. Free beds: ${s.availability}/${s.capacity}. Amenities: ${s.amenities.join(', ')}.`,
  }));

  // Combine all POIs
  const allPOIs = [...shelterPOIs, ...defaultPOIs, ...customPOIs];

  // Map projection helper: converts lat/long delta into SVG coordinates (center at 400, 250)
  const mapWidth = 800;
  const mapHeight = 500;
  const scaleFactor = 12000; // SVG pixels per lat/long degree

  const projectCoord = (lat: number, lng: number) => {
    const dLng = (lng - centerLng) * scaleFactor;
    const dLat = -(lat - centerLat) * scaleFactor; // invert Y for SVG
    return {
      x: mapWidth / 2 + dLng,
      y: mapHeight / 2 + dLat,
    };
  };

  const userPoint = userLocation ? projectCoord(userLocation.latitude, userLocation.longitude) : { x: mapWidth / 2, y: mapHeight / 2 };

  // Evacuation Waypoints (Safe route from user to nearest shelter bypassing hazard zones)
  const nearestShelterPOI = allPOIs.find((p) => p.type === 'shelter');
  const targetShelterPoint = nearestShelterPOI ? projectCoord(nearestShelterPOI.latitude, nearestShelterPOI.longitude) : { x: mapWidth / 2 + 120, y: mapHeight / 2 - 90 };

  // Waypoints avoiding hazard zone
  const routeWaypoints = [
    userPoint,
    { x: userPoint.x + 35, y: userPoint.y - 25 },
    { x: userPoint.x + 80, y: userPoint.y - 45 },
    { x: userPoint.x + 110, y: userPoint.y - 80 },
    targetShelterPoint,
  ];

  const routePolylinePath = routeWaypoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Handle Dragging / Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRecenter = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const handlePOISelect = (poi: MapPOI) => {
    setSelectedPOI(poi);
    if (onSelectPOI) onSelectPOI(poi);
  };

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-2xl select-none flex flex-col`}>
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Title & Live Status */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/80 text-white shadow-lg flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-bold tracking-tight">Interactive Emergency GIS Radar</span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            • Grid Lat: {centerLat.toFixed(3)}°N, Lon: {centerLng.toFixed(3)}°E
          </span>
        </div>

        {/* Action Controls: Zoom / Recenter / Layers */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 text-white shadow-lg">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.6))}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleRecenter}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px] font-bold"
            title="Re-Center to Current GPS"
          >
            <Crosshair className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Recenter</span>
          </button>
        </div>
      </div>

      {/* Layer Filter Pills */}
      {showLayersControl && (
        <div className="absolute bottom-3 left-3 z-30 flex flex-wrap gap-1.5 pointer-events-auto">
          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-md border ${
              showShelters
                ? 'bg-emerald-600 text-white border-emerald-400/60'
                : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Home className="w-3 h-3" />
            <span>Shelters ({allPOIs.filter((p) => p.type === 'shelter').length})</span>
          </button>

          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-md border ${
              showHospitals
                ? 'bg-rose-600 text-white border-rose-400/60'
                : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <HeartPulse className="w-3 h-3" />
            <span>Hospitals</span>
          </button>

          <button
            onClick={() => setShowHazardZones(!showHazardZones)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-md border ${
              showHazardZones
                ? 'bg-amber-600 text-white border-amber-400/60'
                : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Hazard Zones</span>
          </button>

          <button
            onClick={() => setShowEvacuationRoutes(!showEvacuationRoutes)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-md border ${
              showEvacuationRoutes
                ? 'bg-blue-600 text-white border-blue-400/60'
                : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span>Safe Corridors</span>
          </button>
        </div>
      )}

      {/* SVG Canvas Map Surface */}
      <div 
        className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden bg-[#0A1628]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-full"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.75" />
            </pattern>

            {/* Radar Sweep Gradient */}
            <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#005EA8" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#005EA8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#005EA8" stopOpacity="0" />
            </radialGradient>

            {/* Safe Route Gradient */}
            <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Background Map Grids */}
          <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

          {/* Radar Waves & Range Rings */}
          <circle cx={userPoint.x} cy={userPoint.y} r="180" fill="url(#radarSweep)" />
          <circle cx={userPoint.x} cy={userPoint.y} r="60" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
          <circle cx={userPoint.x} cy={userPoint.y} r="120" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
          <circle cx={userPoint.x} cy={userPoint.y} r="200" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="5,5" opacity="0.2" />

          {/* Road Infrastructure Polyline Network */}
          <g opacity="0.35" stroke="#334155" strokeWidth="3" fill="none">
            <path d="M 50 150 Q 250 180, 450 140 T 750 160" />
            <path d="M 120 400 Q 300 350, 420 380 T 700 320" />
            <path d="M 400 30 L 410 470" />
            <path d="M 220 50 L 260 450" />
            <path d="M 580 40 L 550 460" />
          </g>

          {/* Hazard Zones (Red / Amber Inundation & Crack Areas) */}
          {showHazardZones &&
            allPOIs
              .filter((p) => p.type === 'hazard')
              .map((h) => {
                const pt = projectCoord(h.latitude, h.longitude);
                return (
                  <g key={h.id} className="cursor-pointer" onClick={() => handlePOISelect(h)}>
                    {/* Pulsing Hazard Danger Zone */}
                    <circle cx={pt.x} cy={pt.y} r="35" fill="#EF4444" fillOpacity="0.18" className="animate-pulse" />
                    <circle cx={pt.x} cy={pt.y} r="35" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4,4" />
                    <rect x={pt.x - 12} y={pt.y - 12} width="24" height="24" rx="6" fill="#7F1D1D" stroke="#F87171" strokeWidth="1.5" />
                    <text x={pt.x} y={pt.y + 4} textAnchor="middle" fill="#FECACA" fontSize="12" fontWeight="bold">⚠</text>
                    <text x={pt.x} y={pt.y + 24} textAnchor="middle" fill="#FCA5A5" fontSize="9" fontWeight="bold" className="font-mono">
                      BLOCKED
                    </text>
                  </g>
                );
              })}

          {/* Safe Evacuation Route Polyline */}
          {showEvacuationRoutes && (
            <g>
              {/* Outer Glow */}
              <path
                d={routePolylinePath}
                fill="none"
                stroke="url(#routeGlow)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.3"
                className="animate-pulse"
              />
              {/* Main Corridor Line */}
              <path
                d={routePolylinePath}
                fill="none"
                stroke="url(#routeGlow)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8,4"
              />
              {/* Waypoint Nodes */}
              {routeWaypoints.map((wp, i) => (
                <circle key={i} cx={wp.x} cy={wp.y} r="3" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
              ))}
            </g>
          )}

          {/* Shelters POIs (Emerald) */}
          {showShelters &&
            allPOIs
              .filter((p) => p.type === 'shelter' || p.type === 'open_ground')
              .map((poi) => {
                const pt = projectCoord(poi.latitude, poi.longitude);
                const isSelected = selectedPOI?.id === poi.id;
                return (
                  <g
                    key={poi.id}
                    className="cursor-pointer group"
                    onClick={() => handlePOISelect(poi)}
                    transform={`translate(${pt.x}, ${pt.y})`}
                  >
                    {/* Ring highlight if selected */}
                    {isSelected && (
                      <circle cx="0" cy="0" r="22" fill="none" stroke="#34D399" strokeWidth="2" strokeDasharray="3,3" className="animate-spin" />
                    )}
                    <circle cx="0" cy="0" r="14" fill="#065F46" stroke="#34D399" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="black">
                      {poi.type === 'shelter' ? '🏠' : '⛳'}
                    </text>
                    <g transform="translate(0, 22)">
                      <rect x="-45" y="0" width="90" height="15" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
                      <text x="0" y="11" textAnchor="middle" fill="#E2E8F0" fontSize="8" fontWeight="bold">
                        {poi.name.split(' ')[0]} ({poi.distanceKm ? `${poi.distanceKm}km` : 'Near'})
                      </text>
                    </g>
                  </g>
                );
              })}

          {/* Hospital POIs (Rose/Red) */}
          {showHospitals &&
            allPOIs
              .filter((p) => p.type === 'hospital')
              .map((hosp) => {
                const pt = projectCoord(hosp.latitude, hosp.longitude);
                const isSelected = selectedPOI?.id === hosp.id;
                return (
                  <g
                    key={hosp.id}
                    className="cursor-pointer"
                    onClick={() => handlePOISelect(hosp)}
                    transform={`translate(${pt.x}, ${pt.y})`}
                  >
                    {isSelected && (
                      <circle cx="0" cy="0" r="22" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3,3" className="animate-spin" />
                    )}
                    <circle cx="0" cy="0" r="14" fill="#881337" stroke="#FB7185" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="black">
                      ➕
                    </text>
                    <g transform="translate(0, 22)">
                      <rect x="-45" y="0" width="90" height="15" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
                      <text x="0" y="11" textAnchor="middle" fill="#FECDD3" fontSize="8" fontWeight="bold">
                        {hosp.name.split(' ')[0]} ({hosp.available} Beds)
                      </text>
                    </g>
                  </g>
                );
              })}

          {/* User Live GPS Marker */}
          <g transform={`translate(${userPoint.x}, ${userPoint.y})`} className="cursor-pointer">
            <circle cx="0" cy="0" r="18" fill="#0284C7" fillOpacity="0.3" className="animate-ping" />
            <circle cx="0" cy="0" r="10" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
            <g transform="translate(0, -18)">
              <rect x="-24" y="-12" width="48" height="14" rx="4" fill="#0369A1" stroke="#38BDF8" strokeWidth="1" />
              <text x="0" y="-2" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
                YOU (GPS)
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Selected POI Popup Card */}
      {selectedPOI && (
        <div className="absolute bottom-4 right-4 z-40 max-w-sm w-full bg-slate-900/95 backdrop-blur-md border border-blue-500/60 rounded-xl p-4 text-white shadow-2xl animate-slideUp">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                selectedPOI.type === 'shelter' ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' :
                selectedPOI.type === 'hospital' ? 'bg-rose-950 text-rose-300 border border-rose-600' :
                selectedPOI.type === 'hazard' ? 'bg-red-950 text-red-300 border border-red-600' :
                'bg-blue-950 text-blue-300 border border-blue-600'
              }`}>
                {selectedPOI.type.toUpperCase()}
              </span>
              {selectedPOI.distanceKm && (
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {selectedPOI.distanceKm} km away
                </span>
              )}
            </div>
            <button
              onClick={() => setSelectedPOI(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800"
            >
              ✕
            </button>
          </div>

          <h4 className="text-sm font-bold text-white mt-1.5">{selectedPOI.name}</h4>
          <p className="text-xs text-slate-300 mt-1">{selectedPOI.address}</p>

          {selectedPOI.details && (
            <p className="text-[11px] text-slate-400 mt-2 bg-slate-950 p-2 rounded border border-slate-800">
              {selectedPOI.details}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPOI.latitude},${selectedPOI.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow text-center flex items-center justify-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Turn-by-Turn GPS</span>
              <ExternalLink className="w-3 h-3 text-blue-200" />
            </a>

            {selectedPOI.phone && (
              <a
                href={`tel:${selectedPOI.phone}`}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center gap-1 border border-slate-700"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
