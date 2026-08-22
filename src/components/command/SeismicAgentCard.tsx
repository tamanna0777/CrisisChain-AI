import React, { useEffect, useRef } from 'react';
import { Activity, Radio, AlertTriangle, Cpu, Layers } from 'lucide-react';
import { AgentCardData } from '../../types';

interface SeismicAgentCardProps {
  data: AgentCardData;
  isSimulating?: boolean;
}

export const SeismicAgentCard: React.FC<SeismicAgentCardProps> = ({ data, isSimulating }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live Seismograph Waveform Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(30, 64, 110, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 30) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 15) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Center baseline
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // Seismic Waveform
      ctx.beginPath();
      ctx.strokeStyle = '#EF4444'; // Red alert line
      ctx.lineWidth = 2;

      for (let x = 0; x < width; x++) {
        // Compose Primary P-wave, Secondary S-wave, and High Frequency Surface wave
        const pWave = Math.sin((x + offset) * 0.05) * 6;
        const sWave = Math.sin((x * 2 + offset * 1.5) * 0.08) * 14;
        const surfaceRumble = (Math.sin((x * 4 + offset * 3) * 0.12) * Math.cos((x + offset) * 0.04)) * 18;
        
        // Add random jitter for authentic hardware tremor look
        const jitter = (Math.random() - 0.5) * 4;

        const y = midY + pWave + sWave + surfaceRumble + jitter;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      offset += 3.5;
      animationFrameId = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSimulating]);

  return (
    <div className="bg-white dark:bg-[#0D223E] border border-red-200 dark:border-red-500/40 rounded-xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden transition-all hover:border-red-400 text-slate-900 dark:text-white">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                {data.name}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-blue-200/70">{data.shortRole}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 animate-ping inline-block"></span>
            {data.status}
          </span>
        </div>

        {/* Primary Metric Banner */}
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 rounded-lg p-2.5 my-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-red-700 dark:text-red-300 font-bold">
              {data.primaryMetric.label}
            </div>
            <div className="text-2xl font-black text-red-600 dark:text-red-400 tracking-tight flex items-baseline gap-1">
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

        {/* Live Seismograph Display */}
        <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-700 mb-3">
          <div className="absolute top-1 left-2 flex items-center gap-1.5 z-10 text-[9px] font-mono text-red-400 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            <span>LIVE 3-AXIS ACCELEROMETER FEED</span>
          </div>
          <canvas ref={canvasRef} width={380} height={75} className="w-full h-[75px] block" />
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

      {/* Footer Hardware & Agent Action */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#16365F]">
        <p className="text-[11px] text-slate-700 dark:text-blue-100/90 leading-relaxed italic bg-slate-50 dark:bg-[#0A1A30] p-2 rounded border border-slate-200 dark:border-[#1D406E]">
          "{data.summaryRecommendation}"
        </p>
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <Cpu className="w-3 h-3 text-blue-600 dark:text-blue-400" /> 4 Hardware Sensor Feeds Linked
          </span>
          <span className="text-slate-500 dark:text-slate-400">{data.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};
