import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Users, 
  HeartPulse, 
  Home, 
  Navigation, 
  Truck, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  FastForward, 
  Pause 
} from 'lucide-react';
import { HardwareSensorEvent } from '../../types';
import { INITIAL_HARDWARE_SENSORS } from '../../data/commandCenterData';

interface DisasterDrillSimulatorProps {
  onSimulationComplete?: () => void;
}

export const DisasterDrillSimulator: React.FC<DisasterDrillSimulatorProps> = ({
  onSimulationComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sensorLogs, setSensorLogs] = useState<HardwareSensorEvent[]>(INITIAL_HARDWARE_SENSORS);

  const pipelineStages = [
    {
      id: 1,
      title: 'Seismic Hardware Spike',
      actor: 'IoT Accelerometer Cluster',
      desc: 'Ground motion exceedance detected: 0.38g PGA in Pune Region (Lat 18.52° N, Lon 73.85° E). Initial P-wave arrival validated.',
      icon: Activity,
      color: 'text-red-400',
      bgColor: 'bg-red-950/60 border-red-500/40',
    },
    {
      id: 2,
      title: 'Population Impact Analysis',
      actor: 'Population Impact Agent',
      desc: 'Aggregated 23,410 affected citizens. 47 REACT wearable fall triggers verified. Sector B & C flagged as critical evacuation zones.',
      icon: Users,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/60 border-amber-500/40',
    },
    {
      id: 3,
      title: 'Hospital & Shelter Quotas',
      actor: 'Medical & Shelter Agents',
      desc: 'Hospitals identify 326 available beds and 87 ICU slots. Pune Civil Defense Center (3,800 capacity) locked as primary shelter.',
      icon: HeartPulse,
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/60 border-blue-500/40',
    },
    {
      id: 4,
      title: 'Route Hazard Assessment',
      actor: 'Route Intelligence Agent',
      desc: 'Highway Route 4 / NH-48 Flyover flagged as compromised. Route 7 Outer Bypass cleared as designated 14-min evacuation corridor.',
      icon: Navigation,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/60 border-emerald-500/40',
    },
    {
      id: 5,
      title: 'Logistics Resource Mobilization',
      actor: 'Logistics & NDRF Agent',
      desc: 'Sector C water main rupture identified; 3 water tankers dispatched. 4 NDRF Search & Rescue Battalions deployed to Sector B.',
      icon: Truck,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/60 border-cyan-500/40',
    },
    {
      id: 6,
      title: 'Multi-Agent Negotiation & Consensus',
      actor: 'Master AI Negotiation Agent',
      desc: 'Autonomous conflict engine resolves 3 bottlenecks between hospital routing, road safety, and water allocation. 96% consensus achieved.',
      icon: Cpu,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-950/60 border-indigo-500/40',
    },
    {
      id: 7,
      title: 'District Commander Review',
      actor: 'NDMA Operations Commander',
      desc: 'District Magistrate / SAR Commander reviews tactical directives. Government approval locks operational plan.',
      icon: ShieldCheck,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/60 border-purple-500/40',
    },
    {
      id: 8,
      title: 'Public Advisory Dissemination',
      actor: 'Emergency Broadcast Center',
      desc: 'NDMA CAP alert broadcasted across Cell Broadcast SMS, FM Radio, and live Citizen App. Citizens directed safely to Pune Civil Defense Base.',
      icon: Radio,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/60 border-emerald-500/40',
    },
  ];

  // Auto-play stepper
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      if (currentStep < pipelineStages.length) {
        timer = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, 1800);
      } else {
        setIsPlaying(false);
        if (onSimulationComplete) onSimulationComplete();
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  const handleStart = () => {
    setCurrentStep(1);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleStepForward = () => {
    if (currentStep < pipelineStages.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0C213D] border border-slate-200 dark:border-[#1B416D] rounded-xl p-5 shadow-lg space-y-5 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-[#183B68]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 text-[10px] font-bold uppercase">
              HARDWARE & AI PIPELINE DRILL SIMULATOR
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">Real-Time Scenario Tester</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Simulate Earthquake Hardware Trigger & Multi-Agent Response
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Witness how IoT hardware triggers autonomous AI agent negotiation and government decision workflows.
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          {currentStep === 0 ? (
            <button
              onClick={handleStart}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 transition-all active:scale-95 border border-emerald-400/40 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Run M6.8 Drill</span>
            </button>
          ) : isPlaying ? (
            <button
              onClick={() => setIsPlaying(false)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Drill</span>
            </button>
          ) : (
            <button
              onClick={() => setIsPlaying(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Drill</span>
            </button>
          )}

          <button
            onClick={handleStepForward}
            disabled={currentStep >= pipelineStages.length}
            className="p-2 bg-slate-100 dark:bg-[#173760] hover:bg-slate-200 dark:hover:bg-[#1E487C] disabled:opacity-50 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold border border-slate-300 dark:border-[#27538B] cursor-pointer"
            title="Step Forward"
          >
            <FastForward className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 bg-slate-100 dark:bg-[#173760] hover:bg-slate-200 dark:hover:bg-[#1E487C] text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold border border-slate-300 dark:border-[#27538B] cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Stepper Bar */}
      <div className="bg-slate-50 dark:bg-[#081526] p-3 rounded-lg border border-slate-200 dark:border-[#16375E]">
        <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-mono mb-2 font-medium">
          <span>PIPELINE PROGRESSION: STAGE {Math.min(currentStep, 8)} OF 8</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {currentStep >= 8 ? 'COMPLETED (CITIZEN ADVISORY BROADCASTED)' : isPlaying ? 'EXECUTING LIVE...' : 'READY'}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            style={{ width: `${(currentStep / 8) * 100}%` }}
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Stage Flow Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pipelineStages.map((stage) => {
          const isPassed = currentStep >= stage.id;
          const isCurrent = currentStep === stage.id;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isCurrent
                  ? `bg-blue-50 dark:${stage.bgColor} ring-2 ring-blue-500 shadow-md animate-pulse border-blue-400`
                  : isPassed
                  ? 'bg-slate-50 dark:bg-[#0E2442] border-slate-200 dark:border-[#224A7A]'
                  : 'bg-slate-100/60 dark:bg-[#081526]/50 border-slate-200 dark:border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isPassed
                      ? 'bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-white border border-blue-300 dark:border-blue-600/40'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${stage.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        STEP 0{stage.id}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {stage.title}
                      </h4>
                    </div>

                    {isPassed ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> DONE
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">STANDBY</span>
                    )}
                  </div>

                  <div className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold mt-0.5">
                    {stage.actor}
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                    {stage.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Hardware Sensor Feed Table */}
      <div className="bg-slate-50 dark:bg-[#081526] p-4 rounded-xl border border-slate-200 dark:border-[#16375E]">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-red-500 dark:text-red-400" />
            <span>Connected Physical Hardware Sensor Cluster (Trigger Telemetry)</span>
          </h3>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">4 SENSORS STREAMING</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1C3E69] text-slate-500 dark:text-slate-400 text-[10px] font-mono font-bold">
                <th className="pb-2">SENSOR ID</th>
                <th className="pb-2">TYPE</th>
                <th className="pb-2">LOCATION</th>
                <th className="pb-2">READING VALUE</th>
                <th className="pb-2">STATUS</th>
                <th className="pb-2">TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#153459] text-slate-700 dark:text-slate-200 text-[11px]">
              {sensorLogs.map((s) => (
                <tr key={s.sensorId} className="hover:bg-slate-100 dark:hover:bg-[#0E2442]">
                  <td className="py-2 font-mono text-blue-700 dark:text-blue-300 font-semibold">{s.sensorId}</td>
                  <td className="py-2">{s.sensorType.replace('_', ' ')}</td>
                  <td className="py-2">{s.location}</td>
                  <td className="py-2 font-semibold text-red-600 dark:text-red-300">{s.readingValue}</td>
                  <td className="py-2">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700">
                      THRESHOLD EXCEEDED
                    </span>
                  </td>
                  <td className="py-2 text-slate-500 dark:text-slate-400 font-mono text-[10px]">{s.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
