import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  Send, 
  Home, 
  FileText, 
  UserCheck, 
  ArrowRight,
  Radio,
  RefreshCw
} from 'lucide-react';
import { IncidentTimelineEvent } from '../../types';

interface IncidentTimelineProps {
  events: IncidentTimelineEvent[];
  onRefresh?: () => void;
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({
  events,
  onRefresh,
}) => {
  // Helper for icon based on category/title
  const getEventIcon = (event: IncidentTimelineEvent) => {
    const title = event.title.toLowerCase();
    if (title.includes('earthquake') || title.includes('detected') || title.includes('sensor')) {
      return <ShieldAlert className="w-4 h-4 text-red-500" />;
    }
    if (title.includes('analysis') || title.includes('ai') || title.includes('started')) {
      return <Sparkles className="w-4 h-4 text-blue-500" />;
    }
    if (title.includes('response plan') || title.includes('plan generated') || title.includes('approved')) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
    if (title.includes('alert') || title.includes('broadcast') || title.includes('sent')) {
      return <Radio className="w-4 h-4 text-amber-500" />;
    }
    if (title.includes('shelter') || title.includes('assigned')) {
      return <Home className="w-4 h-4 text-purple-500" />;
    }
    if (title.includes('handoff') || title.includes('transfer') || title.includes('note')) {
      return <FileText className="w-4 h-4 text-indigo-500" />;
    }
    return <Activity className="w-4 h-4 text-blue-400" />;
  };

  const getStatusBadge = (status: IncidentTimelineEvent['status']) => {
    switch (status) {
      case 'LIVE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 uppercase flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            LIVE
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 uppercase">
            COMPLETED
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 uppercase">
            IN PROGRESS
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <section 
      id="incident-timeline-section"
      className="bg-white dark:bg-[#0C213D] border-2 border-[#1E4575] rounded-xl p-5 shadow-xl space-y-4 text-slate-800 dark:text-white transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#1A3D6B]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600/50 shadow-inner">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 text-[10px] font-black uppercase tracking-wider">
                Audit Trail
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Real-Time Event Sequence
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              INCIDENT TIMELINE
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {events.length} System Milestones Logged
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Refresh Timeline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-[#1E4575]">
        {events.map((event, index) => (
          <div 
            key={event.id || index}
            className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 dark:bg-[#081526] border border-slate-200 dark:border-[#18365D] hover:border-blue-400 dark:hover:border-blue-500/60 transition-all shadow-sm group"
          >
            {/* Timeline Node Bullet */}
            <div className="absolute -left-[30px] sm:-left-[38px] top-4 w-7 h-7 rounded-full bg-white dark:bg-[#0C213D] border-2 border-blue-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              {getEventIcon(event)}
            </div>

            {/* Event Content */}
            <div className="flex items-start sm:items-center gap-3">
              <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/90 px-2.5 py-1 rounded border border-blue-300 dark:border-blue-800 shrink-0">
                {event.time}
              </span>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{event.title}</span>
                </div>
                {event.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {event.description}
                  </p>
                )}
              </div>
            </div>

            {/* Status Tag */}
            <div className="self-end sm:self-center shrink-0">
              {getStatusBadge(event.status)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
