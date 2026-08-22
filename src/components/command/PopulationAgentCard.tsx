import React from 'react';
import { Users, AlertCircle, Watch, ShieldAlert, Cpu } from 'lucide-react';
import { AgentCardData } from '../../types';

interface PopulationAgentCardProps {
  data: AgentCardData;
}

export const PopulationAgentCard: React.FC<PopulationAgentCardProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-[#0D223E] border border-amber-200 dark:border-amber-500/40 rounded-xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden transition-all hover:border-amber-400 text-slate-900 dark:text-white">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              <Users className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                {data.name}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-blue-200/70">{data.shortRole}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-ping inline-block"></span>
            {data.status}
          </span>
        </div>

        {/* Primary Metric Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 rounded-lg p-2.5 my-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-300 font-bold">
              {data.primaryMetric.label}
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight flex items-baseline gap-1">
              <span>{data.primaryMetric.value}</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {data.primaryMetric.unit}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Model Confidence</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{data.confidence}%</div>
          </div>
        </div>

        {/* Sector Density Hazard Bar */}
        <div className="bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1B3B66] rounded-lg p-2.5 mb-3">
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1.5 flex justify-between">
            <span>POPULATION DISTRIBUTION BY SECTOR</span>
            <span className="text-amber-700 dark:text-amber-400 font-bold">SECTOR B & C SURGE</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
            <div style={{ width: '48%' }} className="bg-red-500" title="Sector B: 48% (11,236 citizens)" />
            <div style={{ width: '34%' }} className="bg-amber-500" title="Sector C: 34% (7,959 citizens)" />
            <div style={{ width: '18%' }} className="bg-blue-500" title="Sector A: 18% (4,215 citizens)" />
          </div>
          <div className="flex justify-between text-[9px] text-slate-600 dark:text-slate-400 mt-1">
            <span className="text-red-600 dark:text-red-400 font-semibold">● Sector B (48%)</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">● Sector C (34%)</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">● Sector A (18%)</span>
          </div>
        </div>

        {/* Structured Telemetry Data */}
        <div className="space-y-1.5 text-xs">
          {data.details.map((detail, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#142F54]/60">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">{detail.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-800 dark:text-slate-200 font-semibold text-[11px]">{detail.value}</span>
                {detail.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${detail.badgeColor || 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'}`}>
                    {detail.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#16365F]">
        <p className="text-[11px] text-slate-700 dark:text-blue-100/90 leading-relaxed italic bg-slate-50 dark:bg-[#0A1A30] p-2 rounded border border-slate-200 dark:border-[#1D406E]">
          "{data.summaryRecommendation}"
        </p>
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <Watch className="w-3 h-3 text-amber-600 dark:text-amber-400" /> 47 Wearable Fall Triggers Verified
          </span>
          <span className="text-slate-500 dark:text-slate-400">{data.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};
