import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  HeartPulse, 
  Home, 
  Navigation, 
  Truck, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Pause, 
  Play, 
  Sparkles,
  ArrowUpRight,
  Search
} from 'lucide-react';

export interface DisasterFeedEvent {
  id: string;
  timestamp: string;
  relativeTime: string;
  category: 'SEISMIC' | 'SAR' | 'HOSPITAL' | 'SHELTER' | 'LOGISTICS' | 'CITIZEN_CHECKIN';
  title: string;
  description: string;
  sourceAgency: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  confidenceScore?: number;
  location?: string;
}

interface LiveDisasterFeedProps {
  initialEvents?: DisasterFeedEvent[];
  maxHeight?: string;
  compact?: boolean;
}

export const LiveDisasterFeed: React.FC<LiveDisasterFeedProps> = ({
  initialEvents,
  maxHeight = 'max-h-96',
  compact = false,
}) => {
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [events, setEvents] = useState<DisasterFeedEvent[]>(initialEvents || [
    {
      id: 'feed-1',
      timestamp: '11:46:12 IST',
      relativeTime: 'Just now',
      category: 'SEISMIC',
      title: 'Geophone Array Telemetry Stabilized',
      description: 'Micro-tremor amplitude subsided to 0.12g. Zero immediate aftershocks detected in Sector 4.',
      sourceAgency: 'IMD Pune Seismological Lab',
      severity: 'SUCCESS',
      confidenceScore: 99.4,
      location: 'Pune Urban Core',
    },
    {
      id: 'feed-2',
      timestamp: '11:44:05 IST',
      relativeTime: '2m ago',
      category: 'SAR',
      title: 'NDRF 5th Battalion Deployed to Sector B',
      description: '24 Urban Search & Rescue personnel equipped with acoustic life detectors and thermal cameras arrived at staging area.',
      sourceAgency: 'NDRF Command Post',
      severity: 'WARNING',
      confidenceScore: 97.8,
      location: 'Sector B Overpass Area',
    },
    {
      id: 'feed-3',
      timestamp: '11:42:30 IST',
      relativeTime: '4m ago',
      category: 'HOSPITAL',
      title: 'Sassoon Trauma Center Triaged 42 Patients',
      description: 'Zero ICU bed wait time. Blood reserves replenished from AFMC Southern Command depot.',
      sourceAgency: 'District Health Officer',
      severity: 'INFO',
      confidenceScore: 98.2,
      location: 'Station Road Trauma Wing',
    },
    {
      id: 'feed-4',
      timestamp: '11:39:18 IST',
      relativeTime: '7m ago',
      category: 'SHELTER',
      title: 'Shivaji Stadium Safe Ground Activated',
      description: 'Emergency tents and drinking water supply established. Capacity available: 3,850 citizens.',
      sourceAgency: 'Civil Defense Pune',
      severity: 'SUCCESS',
      confidenceScore: 99.1,
      location: 'Shivajinagar Sector 4',
    },
    {
      id: 'feed-5',
      timestamp: '11:37:45 IST',
      relativeTime: '9m ago',
      category: 'CITIZEN_CHECKIN',
      title: '5,420 Citizens Marked Safe via CrisisChain Network',
      description: 'Family safety pings automated. Real-time geofenced check-in stream synchronized.',
      sourceAgency: 'CrisisChain AI Telemetry Gateway',
      severity: 'SUCCESS',
      confidenceScore: 99.9,
      location: 'Pune Municipal Region',
    },
    {
      id: 'feed-6',
      timestamp: '11:35:10 IST',
      relativeTime: '11m ago',
      category: 'LOGISTICS',
      title: 'Emergency Power Restored to Sector 2 Water Pump Station',
      description: 'MSEDCL generator squad deployed 250kVA diesel backup.',
      sourceAgency: 'MSEDCL Rapid Repair Corps',
      severity: 'INFO',
      confidenceScore: 96.5,
      location: 'Sector 2 Water Works',
    },
  ]);

  // Dynamic new event ingestion simulation
  useEffect(() => {
    if (!isStreaming) return;

    const streamPool: Omit<DisasterFeedEvent, 'id' | 'timestamp' | 'relativeTime'>[] = [
      {
        category: 'CITIZEN_CHECKIN',
        title: 'New Family Safe Check-In Received',
        description: 'Citizen verified safe status via mobile app. Local GPS coordinate logged.',
        sourceAgency: 'CrisisChain Citizen Mesh',
        severity: 'SUCCESS',
        confidenceScore: 99.8,
        location: 'Kothrud Safety Zone',
      },
      {
        category: 'SAR',
        title: 'SDRF Drone Reconnaissance Flight Alpha Completed',
        description: 'Bridge 4 overpass confirmed damaged; alternate evacuation lane 7 cleared for traffic.',
        sourceAgency: 'State Disaster Response Force',
        severity: 'INFO',
        confidenceScore: 97.4,
        location: 'Route 7 Corridor',
      },
      {
        category: 'HOSPITAL',
        title: 'Air Ambulance Evacuation Landing at AFMC Helipad',
        description: 'Critical patient transferred from collapsed structural sector safely.',
        sourceAgency: 'AFMC Medical Command',
        severity: 'INFO',
        confidenceScore: 98.9,
        location: 'Wanowrie Medical Center',
      },
      {
        category: 'SEISMIC',
        title: 'ESP32 Seismic Node Mesh Heartbeat Synchronized',
        description: 'All 12 IoT accelerometers operational. Zero drift detected in baseline IMU values.',
        sourceAgency: 'CrisisChain Hardware Mesh',
        severity: 'SUCCESS',
        confidenceScore: 99.5,
        location: 'Pune District Sensor Grid',
      },
    ];

    let poolIdx = 0;
    const interval = setInterval(() => {
      const template = streamPool[poolIdx % streamPool.length];
      poolIdx++;

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' IST';

      const newEvent: DisasterFeedEvent = {
        id: `feed-${Date.now()}`,
        timestamp: timeStr,
        relativeTime: 'Just now',
        ...template,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
    }, 12000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const filteredEvents = events.filter((evt) => {
    const matchesFilter = selectedFilter === 'ALL' || evt.category === selectedFilter;
    const matchesSearch = 
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.sourceAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.location && evt.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SEISMIC': return <Activity className="w-3.5 h-3.5 text-amber-500" />;
      case 'SAR': return <Truck className="w-3.5 h-3.5 text-blue-500" />;
      case 'HOSPITAL': return <HeartPulse className="w-3.5 h-3.5 text-rose-500" />;
      case 'SHELTER': return <Home className="w-3.5 h-3.5 text-emerald-500" />;
      case 'LOGISTICS': return <Navigation className="w-3.5 h-3.5 text-indigo-500" />;
      default: return <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'WARNING':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'SUCCESS':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      default:
        return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
    }
  };

  return (
    <div className="bg-white dark:bg-[#0D223E] border border-slate-200 dark:border-[#1E4575] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                Live Incident & Multi-Agency Activity Feed
              </h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Continuous live telemetry from NDRF, IMD Seismographs, Hospitals, and Citizen check-ins
            </p>
          </div>
        </div>

        {/* Controls: Stream Pause/Play & Search */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
              isStreaming
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
            }`}
            title={isStreaming ? 'Pause live stream' : 'Resume live stream'}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>LIVE STREAMING</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-500" />
                <span>STREAM PAUSED</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {['ALL', 'SEISMIC', 'SAR', 'HOSPITAL', 'SHELTER', 'CITIZEN_CHECKIN'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[11px] whitespace-nowrap transition border ${
                selectedFilter === cat
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[180px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feed..."
            className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Scrollable Event List */}
      <div className={`space-y-2.5 overflow-y-auto ${maxHeight} pr-1 scrollbar-thin`}>
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400">
            No events match the selected criteria.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-200 space-y-1.5"
            >
              {/* Event Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {getCategoryIcon(evt.category)}
                  </span>
                  <span className="font-black text-xs text-slate-900 dark:text-white">
                    {evt.title}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase ${getSeverityBadge(evt.severity)}`}>
                    {evt.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{evt.timestamp}</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold font-sans">({evt.relativeTime})</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {evt.description}
              </p>

              {/* Footer Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px]">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300 font-sans">
                    Agency: <strong>{evt.sourceAgency}</strong>
                  </span>
                  {evt.location && (
                    <span>• {evt.location}</span>
                  )}
                </div>

                {evt.confidenceScore && (
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Confidence: {evt.confidenceScore.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
