import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  AlertTriangle, 
  Sparkles, 
  Send, 
  Save, 
  FileText, 
  Radio, 
  UserCheck,
  RotateCcw,
  Lock,
  Key,
  Share2,
  Download
} from 'lucide-react';
import { CommanderActionPlan, GovernmentOfficer } from '../../types';
import { AIConfidencePanel } from './AIConfidencePanel';

interface CommanderDecisionPanelProps {
  plan: CommanderActionPlan;
  officer: GovernmentOfficer;
  onApprovePlan: (plan: CommanderActionPlan) => void;
  onRejectPlan: () => void;
  onNavigateToBroadcast?: () => void;
  onOpenHandoffModal?: () => void;
}

export const CommanderDecisionPanel: React.FC<CommanderDecisionPanelProps> = ({
  plan: initialPlan,
  officer,
  onApprovePlan,
  onRejectPlan,
  onNavigateToBroadcast,
  onOpenHandoffModal,
}) => {
  const [currentPlan, setCurrentPlan] = useState<CommanderActionPlan>(initialPlan);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [commanderNotes, setCommanderNotes] = useState<string>(
    initialPlan.commanderNotes || 'Verified against NDMA Standard Operating Procedures. All agency protocols validated.'
  );
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(
    initialPlan.status === 'APPROVED' ? 'PLAN APPROVED BY DISTRICT COMMANDER' : null
  );

  const canApprove = officer.permissions.canApprovePlan;
  const canModify = officer.permissions.canModifyDirectives;

  const handleToggleDirective = (id: string) => {
    if (!canModify) {
      alert(`Access Denied: Officer clearance (${officer.securityClearance}) is not authorized to modify tactical directives.`);
      return;
    }
    if (!isEditing && currentPlan.status === 'APPROVED') return;
    setCurrentPlan((prev) => ({
      ...prev,
      tacticalDirectives: prev.tacticalDirectives.map((d) =>
        d.id === id ? { ...d, enabled: !d.enabled } : d
      ),
    }));
  };

  const handleApprove = () => {
    if (!canApprove) {
      alert(`Access Denied: Officer clearance (${officer.securityClearance}) is not authorized to approve tactical plans. Level 3+ Required.`);
      return;
    }
    const approved: CommanderActionPlan = {
      ...currentPlan,
      status: 'APPROVED',
      approvedBy: `${officer.name} (${officer.employeeId}) - ${officer.roleTitle}`,
      approvedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      commanderNotes: commanderNotes,
    };
    setCurrentPlan(approved);
    setIsEditing(false);
    setApprovalFeedback(`Response Plan #${approved.id} successfully approved and locked for operational dispatch.`);
    onApprovePlan(approved);
  };

  const handleReject = () => {
    if (!canApprove) {
      alert(`Access Denied: Officer clearance (${officer.securityClearance}) is not authorized to reject or re-route tactical plans.`);
      return;
    }
    setCurrentPlan((prev) => ({
      ...prev,
      status: 'REJECTED',
    }));
    setIsEditing(false);
    setApprovalFeedback('Plan rejected by Commander. AI Multi-Agent system requested to recalculate alternate parameters.');
    onRejectPlan();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#0C213D] border border-slate-200 dark:border-[#1E4575] rounded-xl p-5 shadow-lg space-y-5 text-slate-900 dark:text-white">
        {/* Header with Authority Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1A3D6B]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/90 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-600/50 text-[10px] font-bold uppercase tracking-wider">
                COMMANDER DECISION PANEL
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">Plan ID: {currentPlan.id}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              AI Recommended Emergency Response Plan
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              District Officer Command Authority • NDMA / SDMA Multi-Agency Joint Operations
            </p>
          </div>

          {/* AI Confidence & Status Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase font-bold">AI System Confidence</div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{currentPlan.overallConfidence}%</span>
              </div>
            </div>

            <div
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                currentPlan.status === 'APPROVED'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600 animate-pulse'
                  : currentPlan.status === 'REJECTED'
                  ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-600'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-600'
              }`}
            >
              {currentPlan.status === 'APPROVED' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : currentPlan.status === 'REJECTED' ? (
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              )}
              <span>{currentPlan.status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* RBAC Permission Banner */}
        {!canApprove && (
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-500 rounded-xl text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Clearance Restriction: </span>
              Your role ({officer.roleTitle}) has view-only access to tactical plans. Clearance Level 3+ (Operations Commander / Director) is required to execute executive approval.
            </div>
          </div>
        )}

        {/* Core Principle Notice */}
        <div className="bg-slate-50 dark:bg-[#081729] border-l-4 border-amber-500 p-3 rounded-r-lg text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-700 dark:text-amber-300">Core Governance Principle: </strong>
            The Government remains in absolute command control. The AI multi-agent network acts purely in an advisory capacity to analyze high-speed hardware telemetry and propose optimized tactical steps. No autonomous actions occur without District Commander review and approval.
          </div>
        </div>

        {/* Event Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-[#081526] p-3.5 rounded-lg border border-slate-200 dark:border-[#18365D] text-xs">
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase font-bold">Disaster Type</div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{currentPlan.eventSummary.disasterType}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase font-bold">Epicenter / Region</div>
            <div className="font-bold text-slate-800 dark:text-slate-200">{currentPlan.eventSummary.epicenterOrLocation}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase font-bold">Hazard Radius</div>
            <div className="font-bold text-slate-800 dark:text-slate-200">{currentPlan.eventSummary.impactRadiusKm} km Perimeter</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase font-bold">Estimated Affected</div>
            <div className="font-bold text-red-600 dark:text-red-400 text-sm">{currentPlan.eventSummary.estimatedAffectedPop.toLocaleString()} Citizens</div>
          </div>
        </div>

        {/* Tactical Directives List */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Tactical Operational Directives ({currentPlan.tacticalDirectives.filter((d) => d.enabled).length}/{currentPlan.tacticalDirectives.length} Enabled)</span>
            </h3>
            {canModify && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-[#16365E] hover:bg-slate-200 dark:hover:bg-[#1C4577] border border-slate-300 dark:border-[#234F84] cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Done Editing' : 'Modify Directives'}</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {currentPlan.tacticalDirectives.map((dir, index) => (
              <div
                key={dir.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  dir.enabled
                    ? 'bg-slate-50 dark:bg-[#0E2442] border-slate-200 dark:border-[#224A7A]'
                    : 'bg-slate-100/60 dark:bg-[#091526]/60 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-2 py-1 rounded border border-blue-300 dark:border-blue-800/60 shrink-0">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{dir.title}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 uppercase">
                          {dir.category}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                            dir.priority === 'CRITICAL'
                              ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                          }`}
                        >
                          {dir.priority} PRIORITY
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed mb-2">
                        {dir.action}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                        <span><strong>Target Zone:</strong> {dir.targetZone}</span>
                        <span>•</span>
                        <span><strong>Assigned Units:</strong> {dir.assignedUnits}</span>
                      </div>
                    </div>
                  </div>

                  {/* Enable / Disable Directive Toggle */}
                  <div className="shrink-0 flex flex-col items-end">
                    <label className={`relative inline-flex items-center ${canModify ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                      <input
                        type="checkbox"
                        checked={dir.enabled}
                        disabled={!canModify}
                        onChange={() => handleToggleDirective(dir.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono font-semibold">
                      {dir.enabled ? 'ACTIVE' : 'EXCLUDED'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commander Review Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            District Commander Operational Notes & Authorization Endorsement:
          </label>
          <textarea
            rows={2}
            value={commanderNotes}
            disabled={!canApprove}
            onChange={(e) => setCommanderNotes(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#081526] border border-slate-300 dark:border-[#1C3E6E] rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
            placeholder="Add commander authorization remarks or special constraints..."
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Reviewing Officer: <strong>{officer.name} ({officer.employeeId})</strong>
            </span>
            <span>Security Clearance: {officer.securityClearance}</span>
          </div>
        </div>

        {/* Feedback message */}
        {approvalFeedback && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {approvalFeedback}
            </span>
            {onNavigateToBroadcast && (
              <button
                onClick={onNavigateToBroadcast}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs flex items-center gap-1 shadow cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Go to Public Broadcast</span>
              </button>
            )}
          </div>
        )}

        {/* Action Buttons (Requirement 2: Generate Handoff Note button added beside Approve and Modify) */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-[#1A3D6B]">
          <button
            onClick={handleReject}
            disabled={!canApprove}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-lg border font-semibold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
              canApprove
                ? 'bg-red-50 dark:bg-red-950/80 hover:bg-red-100 dark:hover:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700/60 cursor-pointer'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Plan</span>
          </button>

          {canModify && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-[#15345B] hover:bg-slate-200 dark:hover:bg-[#1C4577] text-slate-800 dark:text-blue-200 border border-slate-300 dark:border-[#285387] font-semibold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Lock Modifications' : 'Modify Plan'}</span>
            </button>
          )}

          {/* Generate Handoff Note Button (Item 2) */}
          {onOpenHandoffModal && (
            <button
              id="btn-generate-handoff-note"
              onClick={onOpenHandoffModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 dark:bg-[#1D3E6B] hover:bg-blue-700 dark:hover:bg-[#25518D] text-white border border-blue-500 dark:border-blue-400/40 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer hover:border-blue-300"
            >
              <FileText className="w-4 h-4 text-blue-200" />
              <span>Generate Handoff Note</span>
            </button>
          )}

          <button
            onClick={handleApprove}
            disabled={!canApprove}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm shadow-lg border transition-all active:scale-95 flex items-center justify-center gap-2 ${
              canApprove
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50 border-emerald-400/50 cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-400 border-slate-300 dark:border-slate-600 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve Response</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. AI CONFIDENCE ANALYSIS PANEL (Appears directly below AI Plan) */}
      {/* ============================================================ */}
      <AIConfidencePanel
        data={{
          recommendation: 'Evacuate Sector A',
          confidenceScore: 91,
          confidenceLevel: 'High',
          evidence: [
            '14 Sensor Triggers (ESP32 MPU-6050 Peak Accel 3.42g)',
            'Shelter Available (Pune Safe Ground Capacity: 340+ beds)',
            'Hospital Capacity Available (Command Trauma units on standby)',
            'Route Clear (Primary Evacuation Corridor Route 7 open)',
          ],
          dataReliability: 'HIGH',
          breakdown: {
            sensorData: 95,
            hospitalData: 90,
            routeData: 88,
            shelterData: 92,
            overall: 91,
          },
        }}
      />
    </div>
  );
};

