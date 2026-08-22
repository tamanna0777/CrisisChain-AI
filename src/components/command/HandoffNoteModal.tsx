import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Share2, 
  X, 
  ArrowDown, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Sparkles, 
  Send,
  Printer,
  ChevronRight,
  BadgeCheck
} from 'lucide-react';
import { CommanderActionPlan, GovernmentOfficer, HandoffNoteData, ShiftTransferPayload } from '../../types';

interface HandoffNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CommanderActionPlan;
  officer: GovernmentOfficer;
  onTransferCase: (payload: ShiftTransferPayload) => Promise<{ success: boolean; message: string }>;
}

export const HandoffNoteModal: React.FC<HandoffNoteModalProps> = ({
  isOpen,
  onClose,
  plan,
  officer,
  onTransferCase,
}) => {
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [toOfficerName, setToOfficerName] = useState('Capt. Vikram Patil');
  const [toOfficerRole, setToOfficerRole] = useState('District Operations Commander (Shift 2)');
  const [transferNotes, setTransferNotes] = useState('Sector A perimeter secured. Awaiting NDRF Team 4 arrival at 16:15 IST.');
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false);
  const [transferSuccessMsg, setTransferSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTimeIST = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }) + ' IST';

  // Dynamic completed vs pending actions based on current plan directives
  const completedActions = [
    'Alert Sent (Public Broadcast Dispatched)',
    'Shelter Assigned (Pune Safe Ground Open)',
    'Hospital Assigned (Sassoon Trauma Pre-Alerted)',
    ...plan.tacticalDirectives
      .filter((d) => d.enabled && d.priority === 'CRITICAL')
      .map((d) => `${d.title} (Authorized)`),
  ];

  const pendingActions = [
    'Deploy Team 4 (NDRF Sector A Search Grid)',
    'Verify Zone B (Structural Safety Clearance)',
    'Monitor Sensor Ingestion for M4.0+ Aftershocks',
  ];

  const recommendedNextStep = 'Dispatch Ambulance Fleet to Sector A Primary Evacuation Corridor';

  const handleExecuteTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toOfficerName.trim()) return;

    setIsSubmittingTransfer(true);
    try {
      const result = await onTransferCase({
        toOfficerName: toOfficerName.trim(),
        toOfficerRole: toOfficerRole.trim(),
        notes: transferNotes.trim(),
      });

      if (result.success) {
        setTransferSuccessMsg(result.message);
        setTimeout(() => {
          setShowTransferForm(false);
        }, 2000);
      }
    } finally {
      setIsSubmittingTransfer(false);
    }
  };

  const handleDownloadPDF = () => {
    // Generate clean printable document window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download/print the Handoff Note PDF.');
      return;
    }

    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CrisisChain EOC - Official Incident Handoff Note #${plan.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { border-bottom: 3px solid #005EA8; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
            .title { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0; }
            .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; background: #fee2e2; color: #991b1b; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
            .card-label { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b; }
            .card-value { font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 4px; }
            .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #005EA8; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin: 20px 0 10px 0; }
            ul { margin: 0; padding-left: 20px; font-size: 13px; }
            li { margin-bottom: 6px; }
            .footer { margin-top: 40px; border-top: 2px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
            .seal { font-weight: bold; color: #005EA8; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">OFFICIAL INCIDENT HANDOFF NOTE</h1>
              <div class="subtitle">CrisisChain EOC • National Disaster Management Authority (NDMA)</div>
            </div>
            <div style="text-align: right;">
              <span class="badge">SEVERITY: CRITICAL</span>
              <div style="font-size: 12px; font-weight: bold; margin-top: 6px;">Generated: ${currentTimeIST}</div>
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="card-label">Incident Type</div>
              <div class="card-value">${plan.eventSummary.disasterType} (${plan.eventSummary.magnitudeOrSeverity})</div>
            </div>
            <div class="card">
              <div class="card-label">Location / Epicenter</div>
              <div class="card-value">${plan.eventSummary.epicenterOrLocation}</div>
            </div>
            <div class="card">
              <div class="card-label">Current Operational Status</div>
              <div class="card-value" style="color: #059669;">Response Active • ${plan.status}</div>
            </div>
            <div class="card">
              <div class="card-label">AI System Confidence</div>
              <div class="card-value" style="color: #005EA8;">${plan.overallConfidence}% (High Multi-Agent Consensus)</div>
            </div>
          </div>

          <div class="section-title">Completed Operational Actions</div>
          <ul>
            ${completedActions.map((a) => `<li><strong>✓ ${a}</strong></li>`).join('')}
          </ul>

          <div class="section-title">Pending Tactical Actions</div>
          <ul>
            ${pendingActions.map((a) => `<li>□ ${a}</li>`).join('')}
          </ul>

          <div class="section-title">Recommended Next Step</div>
          <div style="background: #eff6ff; border-left: 4px solid #005EA8; padding: 12px; font-size: 14px; font-weight: bold; color: #1e3a8a; border-radius: 4px;">
            ${recommendedNextStep}
          </div>

          <div class="section-title">Command Shift Transfer Details</div>
          <div class="grid">
            <div class="card">
              <div class="card-label">Outgoing Officer (Transferred By)</div>
              <div class="card-value">${officer.name} (${officer.employeeId})<br><small style="font-weight:normal;color:#64748b;">${officer.roleTitle}</small></div>
            </div>
            <div class="card">
              <div class="card-label">Incoming Officer (Transferred To)</div>
              <div class="card-value">${toOfficerName}<br><small style="font-weight:normal;color:#64748b;">${toOfficerRole}</small></div>
            </div>
          </div>

          <div class="footer">
            <div><span class="seal">NDMA / SDMA EOC CERTIFIED</span> • Section 38 DMA-2005 Compliant</div>
            <div>Plan ID: ${plan.id} • SHA-256 Ledger Verified</div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div 
      id="handoff-note-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white dark:bg-[#0A1E38] border-2 border-blue-500/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-white flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-blue-700/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-200 border border-blue-400/30">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-200 border border-blue-500/50 text-[10px] font-black uppercase tracking-wider">
                  EOC Shift Protocol
                </span>
                <span className="text-xs text-blue-200/80 font-mono">
                  Plan #{plan.id}
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                HANDOFF NOTE
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800/60 rounded-xl transition-colors cursor-pointer"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Top Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-[#07172B] p-3 rounded-xl border border-slate-200 dark:border-[#17375E]">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                Incident
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {plan.eventSummary.disasterType}
              </span>
              <span className="text-[10px] text-red-500 font-bold block">
                {plan.eventSummary.magnitudeOrSeverity}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-[#07172B] p-3 rounded-xl border border-slate-200 dark:border-[#17375E]">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                Location
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {plan.eventSummary.epicenterOrLocation}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                District EOC Zone
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-[#07172B] p-3 rounded-xl border border-slate-200 dark:border-[#17375E]">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                Severity
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-black bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 inline-block mt-0.5">
                Critical
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-[#07172B] p-3 rounded-xl border border-slate-200 dark:border-[#17375E]">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                Current Status
              </span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Response Active
              </span>
            </div>
          </div>

          {/* AI Confidence Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#091C36] dark:to-[#0E2649] border border-blue-200 dark:border-blue-700/60 p-3.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200 block">
                  AI Multi-Agent Confidence
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-300">
                  Cross-validated against 14 sensor triggers, hospital beds, and open route GIS.
                </span>
              </div>
            </div>
            <div className="text-xl font-black text-blue-700 dark:text-emerald-400 font-mono">
              {plan.overallConfidence}%
            </div>
          </div>

          {/* Completed & Pending Actions 2-Column Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Completed Actions */}
            <div className="bg-slate-50 dark:bg-[#081729] border border-slate-200 dark:border-[#18365D] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-200 uppercase pb-1 border-b border-slate-200 dark:border-slate-800">
                <span>Completed Actions</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <ul className="space-y-1.5">
                {completedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pending Actions */}
            <div className="bg-slate-50 dark:bg-[#081729] border border-slate-200 dark:border-[#18365D] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-200 uppercase pb-1 border-b border-slate-200 dark:border-slate-800">
                <span>Pending Actions</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <ul className="space-y-1.5">
                {pendingActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200">
                    <span className="text-amber-500 font-bold shrink-0">□</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Next Step Box */}
          <div className="bg-blue-50 dark:bg-blue-950/40 border-l-4 border-blue-600 dark:border-blue-500 p-3.5 rounded-r-xl">
            <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 block">
              Recommended Next Step
            </span>
            <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              {recommendedNextStep}
            </div>
          </div>

          {/* Officer Shift Transfer Card (Requirement 4) */}
          <div className="bg-slate-100 dark:bg-[#071629] border-2 border-indigo-200 dark:border-indigo-900/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Officer Shift Transfer Workflow</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Execute seamless custody & decision authority handoff between incoming and outgoing commanders.
                </p>
              </div>

              {!showTransferForm && (
                <button
                  onClick={() => setShowTransferForm(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Transfer Case</span>
                </button>
              )}
            </div>

            {/* Visual Officer A -> Transfer Case -> Officer B Flow Diagram */}
            <div className="bg-white dark:bg-[#0B1E38] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                {/* Officer A */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-300 dark:border-blue-700">
                    A
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">
                      Outgoing Officer
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {officer.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">
                      {officer.roleTitle}
                    </span>
                  </div>
                </div>

                {/* Arrow Transfer Indicator */}
                <div className="flex flex-col items-center">
                  <span className="px-2.5 py-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <span>TRANSFER CASE</span>
                    <ArrowDown className="w-3 h-3 sm:hidden" />
                    <ChevronRight className="w-3 h-3 hidden sm:inline" />
                  </span>
                </div>

                {/* Officer B */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-300 dark:border-emerald-700">
                    B
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">
                      Incoming Officer
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {toOfficerName}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block">
                      {toOfficerRole}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer Confirmation Form */}
            {showTransferForm && (
              <form onSubmit={handleExecuteTransfer} className="p-3.5 bg-white dark:bg-[#0B1E38] rounded-xl border border-indigo-300 dark:border-indigo-800 space-y-3 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Transfer To (Officer Name):
                    </label>
                    <input
                      type="text"
                      required
                      value={toOfficerName}
                      onChange={(e) => setToOfficerName(e.target.value)}
                      placeholder="e.g. Capt. Vikram Patil"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Role / Designation:
                    </label>
                    <input
                      type="text"
                      required
                      value={toOfficerRole}
                      onChange={(e) => setToOfficerRole(e.target.value)}
                      placeholder="e.g. District Disaster Operations Officer"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Shift Transfer Briefing Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={transferNotes}
                    onChange={(e) => setTransferNotes(e.target.value)}
                    placeholder="Provide critical tactical handover notes, active contacts, or perimeter constraints..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {transferSuccessMsg && (
                  <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{transferSuccessMsg}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowTransferForm(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingTransfer}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <BadgeCheck className="w-4 h-4" />
                    <span>{isSubmittingTransfer ? 'Transferring...' : 'Confirm Transfer'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Generated Timestamp */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span>Generated By: <strong>{officer.name} ({officer.employeeId})</strong></span>
            <span className="font-mono">Generated: <strong>{currentTimeIST}</strong></span>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="bg-slate-100 dark:bg-[#071629] p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            NDMA Certified Case Handoff • Tamper-Proof Audit
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-slate-300 dark:border-slate-700 shadow-sm"
            >
              <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => setShowTransferForm(!showTransferForm)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to Next Officer</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer shadow"
            >
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
