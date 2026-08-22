import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  PhoneCall, 
  ShieldCheck, 
  Bed, 
  CheckCircle2, 
  ExternalLink, 
  Compass, 
  Filter, 
  Activity, 
  Droplets, 
  Zap, 
  Search,
  Crosshair
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';
import { SafeShelter } from '../types';

export const SafeShelterFinder: React.FC = () => {
  const { 
    shelters, 
    userLocation, 
    locationPermissionState, 
    requestUserGeolocation, 
    getDistanceToShelter 
  } = useCrisis();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeShelterDetail, setActiveShelterDetail] = useState<SafeShelter | null>(null);

  // Filtered shelters
  const filteredShelters = shelters.filter((s) => {
    const matchesType = selectedType === 'all' || s.type === selectedType;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Sort shelters by nearest distance
  const sortedShelters = [...filteredShelters].sort((a, b) => {
    const distA = getDistanceToShelter(a) ?? 9999;
    const distB = getDistanceToShelter(b) ?? 9999;
    return distA - distB;
  });

  const shelterTypes = [
    { id: 'all', label: 'All Shelters' },
    { id: 'Cyclone Shelter', label: 'Cyclone Shelters' },
    { id: 'Flood Evacuation Center', label: 'Flood Relief' },
    { id: 'Earthquake Safe Ground', label: 'Earthquake Safe' },
    { id: 'Civil Defense Base', label: 'Civil Defense' },
    { id: 'Medical Relief Post', label: 'Medical Stations' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="page-hero-banner bg-gradient-to-r from-[#0C2747] to-[#123868] border border-[#1E4370] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> NDMA Certified Evacuation Hubs
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#FFFFFF] hero-banner-title sm:text-3xl">
            Nearby Safe Shelters
          </h1>
          <p className="text-xs sm:text-sm text-[#E2E8F0] hero-banner-desc mt-1 max-w-2xl">
            Real-time disaster relief camps, structural storm domes, and emergency medical triage bases calculated from your live GPS coordinates.
          </p>
        </div>

        {/* GPS Fix Indicator & Refresh */}
        <button
          onClick={() => requestUserGeolocation()}
          className="px-4 py-2.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 border border-blue-700/80 text-white font-bold text-xs shadow transition flex items-center gap-2 shrink-0"
        >
          <Crosshair className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>
            {userLocation
              ? `GPS: ${userLocation.latitude.toFixed(4)}°N, ${userLocation.longitude.toFixed(4)}°E`
              : 'Acquire Live GPS Fix'}
          </span>
        </button>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search safe shelters by name, sector, or relief amenities..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {shelterTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition ${
                selectedType === t.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* INTERACTIVE RADAR & MAP STAGING VIEW */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden relative">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <Compass className="w-4 h-4 text-blue-400" />
            <span>Evacuation Perimeter Map & Radar View</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {sortedShelters.length} Relief Centers Located
          </span>
        </div>

        {/* Visual Map Representation */}
        <div className="bg-gradient-to-br from-slate-950 via-[#0E1F36] to-slate-950 rounded-xl h-48 border border-slate-800 relative flex items-center justify-center overflow-hidden">
          {/* Radar circles */}
          <div className="absolute w-40 h-40 rounded-full border border-blue-500/20 animate-ping opacity-25"></div>
          <div className="absolute w-80 h-80 rounded-full border border-blue-500/10"></div>
          <div className="absolute w-24 h-24 rounded-full border border-emerald-500/30"></div>

          {/* User's live GPS Center Pin */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold animate-pulse">
              YOU
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold mt-1 bg-slate-900/90 px-1.5 py-0.5 rounded">
              {userLocation ? `${userLocation.latitude.toFixed(3)}N, ${userLocation.longitude.toFixed(3)}E` : 'Live GPS'}
            </span>
          </div>

          {/* Placed Shelter Nodes */}
          {sortedShelters.slice(0, 4).map((s, idx) => {
            const positions = [
              { top: '22%', left: '26%' },
              { top: '30%', right: '22%' },
              { bottom: '24%', left: '32%' },
              { bottom: '26%', right: '28%' },
            ];
            const pos = positions[idx % positions.length];
            const dist = getDistanceToShelter(s);

            return (
              <div
                key={s.id}
                style={pos}
                onClick={() => setActiveShelterDetail(s)}
                className="absolute z-10 cursor-pointer group flex flex-col items-center"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white border border-emerald-300 flex items-center justify-center shadow-md group-hover:scale-125 transition">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 text-white text-[9px] font-semibold whitespace-nowrap border border-slate-700 hidden sm:block">
                  {s.name.split(' ')[0]} ({dist ? `${dist}km` : 'Near'})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SHELTER CARDS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedShelters.map((shelter) => {
          const distance = getDistanceToShelter(shelter);
          const occupancyRate = Math.round(
            ((shelter.capacity - shelter.availability) / shelter.capacity) * 100
          );

          // Google Maps Directions URL with exact lat/long destination
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`;

          return (
            <div
              key={shelter.id}
              id={`card-shelter-${shelter.id}`}
              className="bg-slate-800/90 border border-slate-700 hover:border-slate-600 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition"
            >
              <div>
                {/* Top Badge & Distance */}
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-800">
                    {shelter.type}
                  </span>

                  <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                    <Navigation className="w-3 h-3" />
                    <span>{distance !== null ? `${distance} km away` : 'Estimating...'}</span>
                  </div>
                </div>

                {/* Name & Address */}
                <div className="mt-3">
                  <h3 className="font-extrabold text-white text-base leading-snug">
                    {shelter.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span>{shelter.address}</span>
                  </p>
                </div>

                {/* Real-Time Bed Availability Gauge */}
                <div className="mt-4 bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-blue-400" /> Bed Availability:
                    </span>
                    <span className="font-mono font-bold text-white">
                      <strong className="text-emerald-400">{shelter.availability}</strong> / {shelter.capacity} Beds Free
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        occupancyRate > 85
                          ? 'bg-red-500'
                          : occupancyRate > 60
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>Operating Status: <strong className="text-emerald-400">{shelter.status}</strong></span>
                    <span className="font-mono text-slate-300">{occupancyRate}% Occupied</span>
                  </div>
                </div>

                {/* Coordinates & Amenities tags */}
                <div className="mt-3 space-y-2">
                  <div className="text-[10px] text-slate-400 font-mono">
                    Real GPS: {shelter.latitude.toFixed(4)}°N, {shelter.longitude.toFixed(4)}°E
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {shelter.amenities.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {amenity}
                      </span>
                    ))}
                    {shelter.amenities.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                        +{shelter.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions: Navigate (Google Maps) & Direct Call */}
              <div className="pt-3 border-t border-slate-700/80 flex gap-2">
                <a
                  id={`btn-nav-shelter-${shelter.id}`}
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                  <ExternalLink className="w-3 h-3 text-blue-200" />
                </a>

                <a
                  href={`tel:${shelter.contactNumber}`}
                  className="py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1"
                  title="Direct Shelter Control Room"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
