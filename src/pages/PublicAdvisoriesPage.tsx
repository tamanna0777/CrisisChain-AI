import React, { useState } from 'react';
import { 
  Radio, 
  AlertTriangle, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Clock, 
  CheckSquare, 
  Filter, 
  Share2,
  ExternalLink,
  ShieldCheck,
  Waves,
  Activity,
  CloudRain
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';
import { PublicAdvisory, AdvisorySeverity } from '../types';

export const PublicAdvisoriesPage: React.FC = () => {
  const { advisories } = useCrisis();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readingId, setReadingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Advisories' },
    { id: 'Earthquake Alerts', label: 'Earthquake Alerts' },
    { id: 'Flood Alerts', label: 'Flood Alerts' },
    { id: 'Weather Warnings', label: 'Weather Warnings' },
    { id: 'Evacuation Notices', label: 'Evacuation Notices' },
  ];

  const filteredAdvisories = advisories.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  // Text-To-Speech crisis voice reader for accessibility
  const handleReadAloud = (advisory: PublicAdvisory) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (readingId === advisory.id) {
      window.speechSynthesis.cancel();
      setReadingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${advisory.title}. Issued by ${advisory.source}. ${advisory.description}. Instructions: ${advisory.instructions.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.onend = () => setReadingId(null);
    utterance.onerror = () => setReadingId(null);

    setReadingId(advisory.id);
    window.speechSynthesis.speak(utterance);
  };

  const getSeverityBadge = (severity: AdvisorySeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-red-950 text-red-300 border border-red-500 animate-pulse flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            CRITICAL EMERGENCY
          </span>
        );
      case 'SEVERE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-950 text-orange-300 border border-orange-500 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-orange-400" />
            SEVERE ALERT
          </span>
        );
      case 'MODERATE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-500">
            MODERATE WATCH
          </span>
        );
      case 'ADVISORY':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-600">
            PUBLIC ADVISORY
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="page-hero-banner bg-gradient-to-r from-[#0C2442] to-[#123661] border border-[#1E4370] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> NDMA / IMD Civil Defense Live Feed
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#FFFFFF] hero-banner-title sm:text-3xl">
            Official Alerts & Advisories
          </h1>
          <p className="text-xs sm:text-sm text-[#E2E8F0] hero-banner-desc mt-1 max-w-2xl">
            Authenticated early warnings, seismic activity reports, flood zone inundation alerts, and evacuation protocols issued by emergency authorities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-bold text-emerald-300 uppercase">
            Live Stream Connected
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ADVISORIES CARDS LIST */}
      <div className="space-y-4">
        {filteredAdvisories.map((advisory) => (
          <div
            key={advisory.id}
            id={`card-advisory-${advisory.id}`}
            className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4 hover:border-slate-600 transition"
          >
            {/* Top Bar: Severity, Time, Audio Reader */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-3">
                {getSeverityBadge(advisory.severity)}
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {advisory.time}
                </span>
              </div>

              {/* Text-To-Speech Button */}
              <button
                onClick={() => handleReadAloud(advisory)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  readingId === advisory.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-900 text-blue-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {readingId === advisory.id ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Read Advisory Aloud</span>
                  </>
                )}
              </button>
            </div>

            {/* Title & Source */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {advisory.title}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-emerald-400 font-semibold">
                <Radio className="w-3.5 h-3.5" />
                <span>Source: {advisory.source}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              {advisory.description}
            </p>

            {/* Citizen Action Checklist / Mandatory Instructions */}
            {advisory.instructions && advisory.instructions.length > 0 && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4" />
                  <span>Mandatory Citizen Action Checklist:</span>
                </div>
                <ul className="space-y-1.5 pt-1">
                  {advisory.instructions.map((inst, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <span className="w-4 h-4 rounded-full bg-blue-900 text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Affected Zones Tags */}
            {advisory.affectedZones && advisory.affectedZones.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Affected Zones:</span>
                {advisory.affectedZones.map((zone, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-900 text-red-300 font-mono text-[11px] border border-red-900/60"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
