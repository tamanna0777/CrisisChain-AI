import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  GitMerge, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Scale, 
  Zap 
} from 'lucide-react';
import { AgentCardData, NegotiationConflictRecord } from '../../types';

interface NegotiationAgentCardProps {
  data: AgentCardData;
  conflicts: NegotiationConflictRecord[];
  onOpenCommanderPanel?: () => void;
}

export const NegotiationAgentCard: React.FC<NegotiationAgentCardProps> = ({
  data,
  conflicts,
  onOpenCommanderPanel,
}) => {
  const [selectedConflict, setSelectedConflict] = useState<NegotiationConflictRecord>(conflicts[0] || null);

  return (
    <div className="bg-white dark:bg-gradient-to-b dark:from-[#102A4C] dark:to-[#0A1D36] border-2 border-indigo-200 dark:border-indigo-500/60 rounded-xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between text-slate-900 dark:text-white transition-colors">
      {/* Decorative background grid and AI aura */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div>
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-indigo-100 dark:border-indigo-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg border border-indigo-300/40">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                  {data.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-400/50">
                  MASTER DECISION ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-blue-200/80">
                Multi-Agent Autonomous Conflict Resolution & Consensus Synthesis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/60 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping"></span>
              <span>CONSENSUS: 96%</span>
            </div>
          </div>
        </div>

        {/* Live Multi-Agent Input Flow Pipeline */}
        <div className="bg-slate-50 dark:bg-[#071427] border border-slate-200 dark:border-[#1C3E6E] rounded-xl p-3.5 mb-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-semibold">
              <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> MULTI-AGENT SYNTHESIS PIPELINE
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">All 6 Sub-Agents Feed into Master AI</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
            <div className="bg-white dark:bg-[#0E2648] p-2 rounded border border-red-200 dark:border-red-500/30 text-slate-800 dark:text-slate-200 shadow-sm">
              <div className="text-[9px] text-red-600 dark:text-red-400 font-mono font-bold">SEISMIC</div>
              <div className="font-bold text-[11px]">M6.8 Detected</div>
            </div>
            <div className="bg-white dark:bg-[#0E2648] p-2 rounded border border-amber-200 dark:border-amber-500/30 text-slate-800 dark:text-slate-200 shadow-sm">
              <div className="text-[9px] text-amber-600 dark:text-amber-400 font-mono font-bold">POPULATION</div>
              <div className="font-bold text-[11px]">23.4k Affected</div>
            </div>
            <div className="bg-white dark:bg-[#0E2648] p-2 rounded border border-blue-200 dark:border-blue-500/30 text-slate-800 dark:text-slate-200 shadow-sm">
              <div className="text-[9px] text-blue-600 dark:text-blue-400 font-mono font-bold">HOSPITALS</div>
              <div className="font-bold text-[11px]">326 Beds Free</div>
            </div>
            <div className="bg-white dark:bg-[#0E2648] p-2 rounded border border-emerald-200 dark:border-emerald-500/30 text-slate-800 dark:text-slate-200 shadow-sm">
              <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">SHELTER</div>
              <div className="font-bold text-[11px]">Pune Defense (82%)</div>
            </div>
            <div className="bg-white dark:bg-[#0E2648] p-2 rounded border border-amber-200 dark:border-amber-500/30 text-slate-800 dark:text-slate-200 shadow-sm">
              <div className="text-[9px] text-amber-600 dark:text-amber-400 font-mono font-bold">ROUTES</div>
              <div className="font-bold text-[11px]">Route 7 (14m)</div>
            </div>
            <div className="bg-white dark:bg-[#0E2648] p-2 rounded border border-blue-200 dark:border-blue-500/30 text-slate-800 dark:text-slate-200 shadow-sm">
              <div className="text-[9px] text-blue-600 dark:text-blue-400 font-mono font-bold">LOGISTICS</div>
              <div className="font-bold text-[11px]">4 NDRF Battalions</div>
            </div>
          </div>
        </div>

        {/* Autonomous Conflict Resolution Stream */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Real-Time Autonomous Conflict Resolution Log</span>
            </h4>
            <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-mono font-semibold">
              {conflicts.length} Bottlenecks Resolved
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
            {conflicts.map((conf) => {
              const isSelected = selectedConflict?.id === conf.id;
              return (
                <div
                  key={conf.id}
                  onClick={() => setSelectedConflict(conf)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-[#153763] border-indigo-500 shadow-md ring-1 ring-indigo-400/50'
                      : 'bg-slate-50 dark:bg-[#0A1A30] hover:bg-slate-100 dark:hover:bg-[#0F2646] border-slate-200 dark:border-[#1A3B66]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-mono text-indigo-700 dark:text-indigo-300 font-bold">{conf.id.toUpperCase()}</span>
                    <span className="text-slate-500 dark:text-slate-400">{conf.resolvedAt}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                    {conf.agentsInvolved.join(' ↔ ')}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {conf.conflictDescription}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-[#1C3E69] text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="truncate">Auto-Resolved: {conf.negotiationOutcome.replace('MASTER DECISION: ', '')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Conflict Detail View */}
        {selectedConflict && (
          <div className="bg-slate-50 dark:bg-[#08172C] border border-indigo-200 dark:border-indigo-500/40 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <GitMerge className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Conflict Analysis: {selectedConflict.agentsInvolved.join(' vs ')}</span>
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded text-[10px] font-bold">
                CONSENSUS REACHED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
              <div className="bg-white dark:bg-[#0E2442] p-2.5 rounded border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 font-bold">PROPOSED POSITION A</div>
                <p className="text-slate-700 dark:text-slate-200 text-[11px] leading-relaxed">{selectedConflict.proposedActionA}</p>
              </div>
              <div className="bg-white dark:bg-[#0E2442] p-2.5 rounded border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 font-bold">PROPOSED POSITION B</div>
                <p className="text-slate-700 dark:text-slate-200 text-[11px] leading-relaxed">{selectedConflict.proposedActionB}</p>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-500/50 rounded-lg p-3 text-xs">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-bold mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {selectedConflict.negotiationOutcome}
              </div>
              <p className="text-slate-700 dark:text-slate-200 text-[11px] leading-relaxed mb-1">
                <strong className="text-emerald-800 dark:text-emerald-300">Strategic Rationale: </strong>
                {selectedConflict.rationale}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Call to Action */}
      <div className="pt-3 border-t border-indigo-100 dark:border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <strong className="text-slate-900 dark:text-white">Unified Recommendation: </strong>
          Evacuate Sector B & C via Route 7 Corridor to Pune Civil Defense Center.
        </div>
        {onOpenCommanderPanel && (
          <button
            onClick={onOpenCommanderPanel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 border border-indigo-400/50 whitespace-nowrap cursor-pointer"
          >
            <span>Review Commander Action Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
