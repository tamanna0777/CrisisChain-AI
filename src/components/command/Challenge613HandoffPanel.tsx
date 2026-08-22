import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Share2, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Sparkles, 
  Send,
  Printer,
  ChevronRight,
  BadgeCheck,
  Cpu,
  Layers,
  Activity,
  Sliders,
  CheckCheck,
  RefreshCw
} from 'lucide-react';
import { CommanderActionPlan, GovernmentOfficer, ShiftTransferPayload } from '../../types';
import { useCrisis } from '../../context/CrisisContext';

interface Challenge613HandoffPanelProps {
  plan: CommanderActionPlan;
  officer: GovernmentOfficer;
  onOpenTransferModal: () => void;
}

export const Challenge613HandoffPanel: React.FC<Challenge613HandoffPanelProps> = ({
  plan,
  officer,
  onOpenTransferModal,
}) => {
  const { addAuditLog } = useCrisis();
  const [operatorConfidenceRating, setOperatorConfidenceRating] = useState<number>(94);
  const [feedbackNotes, setFeedbackNotes] = useState<string>(
    'Multi-agent consensus corroborated by ground patrol. No conflicting telemetry found in Sector 4.'
  );
  const [feedbackSaved, setFeedbackSaved] = useState<boolean>(false);
  const [activeIcsSection, setActiveIcsSection] = useState<'ICS201' | 'ICS204' | 'SHIFT_LEDGER'>('ICS201');

  const currentTimeIST = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }) + ' IST';

  const handleSaveConfidenceFeedback = () => {
    setFeedbackSaved(true);
    addAuditLog({
      actionType: 'PLAN_MODIFIED',
      officerName: officer.name,
      officerId: officer.employeeId,
      agency: officer.agency,
      roleTitle: officer.roleTitle,
      advisoryTitle: `Challenge #613: Operator Confidence Logged (${operatorConfidenceRating}%)`,
      affectedZones: ['All Operational Sectors'],
      citizenReachCount: 0,
      notes: `Commander logged operational confidence score: ${operatorConfidenceRating}%. Feedback: "${feedbackNotes}"`,
    });

    setTimeout(() => setFeedbackSaved(false), 4000);
  };

  const handlePrintICS = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Challenge #613 Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-2 border-blue-500/60 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldCheck className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>CHALLENGE #613 SPECIFICATION</span>
              </span>
              <span className="text-xs font-mono text-blue-200">
                ICS Form 201/204 • Operational Shift Handoff
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              User & AI Confidence Calibration & Handoff Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/80 max-w-3xl leading-relaxed">
              Provides verifiable, tamper-evident incident transition summaries between outgoing and incoming Disaster Operations Commanders. Ensures continuity of tactical directives, resource commitments, and citizen safety status.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenTransferModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg border border-emerald-400/40 transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Execute Shift Custody Transfer</span>
            </button>

            <button
              onClick={handlePrintICS}
              className="px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-600 transition flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print ICS-201</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left Confidence Metric Breakdown | Right ICS Section Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Multi-Dimensional Confidence Engine */}
        <div className="lg:col-span-5 space-y-4">
          {/* Multi-Agent vs Human Confidence Card */}
          <div className="bg-white dark:bg-[#0D223E] border border-slate-200 dark:border-[#1E4575] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Multi-Factor Confidence Scores
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-400/40">
                VERIFIED HIGH
              </span>
            </div>

            {/* Score Gauges */}
            <div className="space-y-3">
              {/* Multi-Agent AI Ensemble */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">AI Ensemble Triangulation</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">98.4%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98.4%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>ESP32 Geophone + IMD Sensor Alignment</span>
                  <span>Weight: 0.40</span>
                </div>
              </div>

              {/* Road & GIS Clearance */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Evacuation Corridor Clearance</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">94.7%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '94.7%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>SDRF Drone Reconnaissance Verification</span>
                  <span>Weight: 0.30</span>
                </div>
              </div>

              {/* Hospital ICU Capacity Stability */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Medical Surge Triage Stability</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">96.2%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '96.2%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>Sassoon & AFMC Live Bed Telemetry</span>
                  <span>Weight: 0.30</span>
                </div>
              </div>
            </div>

            {/* Operator Confidence Tuning Slider */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Operator / Commander Subjective Confidence</span>
                </label>
                <span className="text-xs font-mono font-black text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                  {operatorConfidenceRating}%
                </span>
              </div>

              <input
                type="range"
                min="50"
                max="100"
                value={operatorConfidenceRating}
                onChange={(e) => setOperatorConfidenceRating(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />

              <textarea
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                rows={2}
                placeholder="Operational notes, field observations, or sensor discrepancy remarks..."
                className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />

              <button
                onClick={handleSaveConfidenceFeedback}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow transition flex items-center justify-center gap-1.5"
              >
                {feedbackSaved ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-white" />
                    <span>Saved to Immutable Audit Ledger!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Log Operator Confidence to Audit Log</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: ICS-201 Incident Briefing & Handoff Summary */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-[#0D223E] border border-slate-200 dark:border-[#1E4575] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 transition-colors">
            {/* Section Switcher Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveIcsSection('ICS201')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeIcsSection === 'ICS201'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  ICS-201 Incident Briefing
                </button>
                <button
                  onClick={() => setActiveIcsSection('ICS204')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeIcsSection === 'ICS204'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  ICS-204 Assignment List
                </button>
                <button
                  onClick={() => setActiveIcsSection('SHIFT_LEDGER')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeIcsSection === 'SHIFT_LEDGER'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Custody Transfer Ledger
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Form Ver: 2026.3
              </span>
            </div>

            {/* ICS-201 Content */}
            {activeIcsSection === 'ICS201' && (
              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Incident Name</span>
                    <span className="font-black text-slate-900 dark:text-white">Pune Seismic Response</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Plan ID</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">#{plan.id}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Current Commander</span>
                    <span className="font-bold text-slate-900 dark:text-white">{officer.name}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Operational Period</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Shift 1 (08:00 - 16:00)</span>
                  </div>
                </div>

                {/* Situation Assessment */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-500" />
                    <span>Current Situation Summary & Objectives</span>
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    M6.8 seismic shockwave registered at 11:32 IST via ESP32 Hardware Mesh. Primary damage localized in Sector B old commercial buildings. 23,410 citizens within warning polygon. Objective: Execute 100% citizen evacuation to Shivaji Stadium & Safe Grounds; clear Route 7 emergency corridor; maintain Sassoon trauma triage.
                  </p>
                </div>

                {/* Action Directives Status */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">
                    Tactical Directives Execution Progress ({plan.tacticalDirectives.filter((d) => d.enabled).length} Active)
                  </h4>
                  <div className="space-y-1.5">
                    {plan.tacticalDirectives.map((d) => (
                      <div
                        key={d.id}
                        className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${d.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          <span className="font-bold text-slate-900 dark:text-white">{d.title}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">({d.agency})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          d.priority === 'CRITICAL' ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300' :
                          'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}>
                          {d.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ICS-204 Content */}
            {activeIcsSection === 'ICS204' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">Field Tactical Resource Assignment Matrix</h4>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase text-slate-500">
                        <th className="pb-1.5">Division / Group</th>
                        <th className="pb-1.5">Leader / Agency</th>
                        <th className="pb-1.5">Assigned Sector</th>
                        <th className="pb-1.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      <tr>
                        <td className="py-1.5 font-bold text-slate-900 dark:text-white">NDRF Battalion 5</td>
                        <td className="py-1.5 text-slate-600 dark:text-slate-300">Maj. R. Deshmukh</td>
                        <td className="py-1.5 font-mono">Sector B (Structural)</td>
                        <td className="py-1.5"><span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">ON SCENE</span></td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-slate-900 dark:text-white">SDRF Drone Squad 2</td>
                        <td className="py-1.5 text-slate-600 dark:text-slate-300">Insp. A. Shinde</td>
                        <td className="py-1.5 font-mono">Route 7 Corridor</td>
                        <td className="py-1.5"><span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">ACTIVE RECON</span></td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-slate-900 dark:text-white">Paramedic Corps Alpha</td>
                        <td className="py-1.5 text-slate-600 dark:text-slate-300">Dr. K. Nair</td>
                        <td className="py-1.5 font-mono">Sassoon Triage Gateway</td>
                        <td className="py-1.5"><span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">RECEIVING</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Custody Transfer Ledger Content */}
            {activeIcsSection === 'SHIFT_LEDGER' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Cryptographic Shift Custody Protocol Active</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Each shift transfer generates an immutable SHA-256 block record on the audit ledger. All uncompleted tasks must be explicitly acknowledged by the incoming officer.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">Incoming Shift Readiness Checklist</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Radio frequency 156.800 MHz (Ch 16) & SAT phone verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Citizen SOS CAD Queue (127 items) reviewed</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Public broadcast warnings verified on NDMA gateway</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
