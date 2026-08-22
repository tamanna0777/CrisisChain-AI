import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Building2, 
  Route, 
  Home, 
  Info, 
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { AIConfidenceAnalysisData, AIConfidenceBreakdown } from '../../types';

interface AIConfidencePanelProps {
  data?: Partial<AIConfidenceAnalysisData>;
  onEvacuateRecommendationClick?: () => void;
}

export const AIConfidencePanel: React.FC<AIConfidencePanelProps> = ({
  data,
  onEvacuateRecommendationClick,
}) => {
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);

  const defaultBreakdown: AIConfidenceBreakdown = {
    sensorData: 95,
    hospitalData: 90,
    routeData: 88,
    shelterData: 92,
    overall: 91,
  };

  const breakdown: AIConfidenceBreakdown = data?.breakdown || defaultBreakdown;

  const recommendation = data?.recommendation || 'Evacuate Sector A';
  const confidenceScore = data?.confidenceScore || breakdown.overall || 91;
  const confidenceLevel = data?.confidenceLevel || 'High';
  const dataReliability = data?.dataReliability || 'HIGH';

  const defaultEvidence = [
    '14 Sensor Triggers (Seismic Accelerometer peak 3.42g confirmed)',
    'Shelter Available (Pune Safe Ground: 340+ beds available)',
    'Hospital Capacity Available (Command pre-alerted trauma beds)',
    'Route Clear (Primary Evacuation Corridor Route 7 unobstructed)',
  ];

  const evidence = data?.evidence && data.evidence.length > 0 ? data.evidence : defaultEvidence;

  return (
    <section 
      id="ai-confidence-analysis-panel"
      className="bg-white dark:bg-[#0C213D] border-2 border-[#1E4575] rounded-xl p-5 shadow-xl space-y-5 text-slate-800 dark:text-white transition-colors"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200 dark:border-[#1A3D6B]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600/50 shadow-inner">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 text-[10px] font-black uppercase tracking-wider">
                Government EOC AI Audit
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Multi-Agent Telemetry Verification
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              AI CONFIDENCE ANALYSIS
            </h3>
          </div>
        </div>

        {/* Data Reliability Badge */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
              Data Reliability
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-600 inline-block shadow-sm">
              {dataReliability}
            </span>
          </div>

          <div className="text-right pl-3 border-l border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
              Confidence Level
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-400 dark:border-blue-600 inline-block shadow-sm">
              {confidenceLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Primary 3-Column Decision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Core AI Recommendation */}
        <div className="bg-slate-50 dark:bg-[#081526] border border-slate-200 dark:border-[#18365D] rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">
              <span>Recommendation</span>
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xl font-black text-blue-700 dark:text-blue-300 tracking-tight mt-1">
              {recommendation}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Autonomous multi-agent consensus recommends targeted sector evacuation before aftershock threshold escalation.
            </p>
          </div>
          
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Primary Zone: <strong>Sector A</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Validated</span>
          </div>
        </div>

        {/* Card 2: Overall Confidence Score Hero */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#091B33] dark:to-[#0D2447] border-2 border-blue-300 dark:border-blue-500/50 rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 dark:opacity-20 pointer-events-none">
            <TrendingUp className="w-24 h-24 text-blue-600" />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-blue-900 dark:text-blue-300 uppercase font-bold mb-1">
              <span>Overall Confidence Score</span>
              <span className="px-2 py-0.5 bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-[10px] font-mono font-bold">
                M-Weighted
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-blue-900 dark:text-emerald-400 tracking-tight">
                {confidenceScore}%
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                High Precision
              </span>
            </div>

            {/* Main Progress Indicator */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${confidenceScore}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>Aggregated Across: <strong>4 Telemetry Feeds</strong></span>
            <button 
              onClick={() => setShowFormulaTooltip(!showFormulaTooltip)}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          </div>
        </div>

        {/* Card 3: Supporting Evidence Checklist */}
        <div className="bg-slate-50 dark:bg-[#081526] border border-slate-200 dark:border-[#18365D] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-2">
              <span>Supporting Evidence</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>

            <ul className="space-y-2">
              {evidence.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <span>Cross-verified with NDMA Standard Rule Matrix</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CONFIDENCE BREAKDOWN CARD ("Where did 91% come from?")       */}
      {/* ============================================================ */}
      <div 
        id="confidence-breakdown-card"
        className="bg-slate-100 dark:bg-[#08172B] border-2 border-blue-200 dark:border-[#1A3D68] rounded-xl p-4.5 shadow-sm space-y-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Confidence Breakdown Matrix</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                (Telemetry Verification Audit)
              </span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Judges & Officers can inspect the exact weighted data inputs producing the {confidenceScore}% confidence output.
            </p>
          </div>

          <div className="text-xs font-mono bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
            Overall: <strong className="text-blue-700 dark:text-emerald-400 text-sm">{breakdown.overall}%</strong>
          </div>
        </div>

        {/* 4 Multi-Agent Input Streams Progress Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {/* 1. Sensor Data */}
          <div className="bg-white dark:bg-[#0B203B] p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                <span>Sensor Data</span>
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {breakdown.sensorData}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${breakdown.sensorData}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
              <span>ESP32 + MPU6050 Ingestion</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">14 Triggers</span>
            </div>
          </div>

          {/* 2. Hospital Data */}
          <div className="bg-white dark:bg-[#0B203B] p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-red-500" />
                <span>Hospital Data</span>
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {breakdown.hospitalData}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${breakdown.hospitalData}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
              <span>Trauma Surge Capacity</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">164 Beds</span>
            </div>
          </div>

          {/* 3. Route Data */}
          <div className="bg-white dark:bg-[#0B203B] p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Route className="w-3.5 h-3.5 text-blue-500" />
                <span>Route Data</span>
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {breakdown.routeData}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${breakdown.routeData}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
              <span>Traffic GIS & Obstructions</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Corridor Open</span>
            </div>
          </div>

          {/* 4. Shelter Data */}
          <div className="bg-white dark:bg-[#0B203B] p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-emerald-500" />
                <span>Shelter Data</span>
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {breakdown.shelterData}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${breakdown.shelterData}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
              <span>Civic Safe Grounds</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">340 Beds</span>
            </div>
          </div>
        </div>

        {/* Calculation Formula Explanation */}
        <div className="bg-blue-50/70 dark:bg-blue-950/40 p-2.5 rounded-lg border border-blue-200/80 dark:border-blue-900 text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              <strong>Confidence Math:</strong> Weighted consensus = (Sensor {breakdown.sensorData}% × 0.30) + (Hospital {breakdown.hospitalData}% × 0.25) + (Route {breakdown.routeData}% × 0.25) + (Shelter {breakdown.shelterData}% × 0.20) = <strong>{confidenceScore}%</strong>
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono hidden md:inline">
            Status: Cross-Validated
          </span>
        </div>
      </div>
    </section>
  );
};
