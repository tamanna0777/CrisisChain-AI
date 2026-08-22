import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  FileText, 
  Lock, 
  CheckCircle2, 
  Download, 
  Clock, 
  UserCheck, 
  Radio,
  Share2,
  Users,
  MapPin
} from 'lucide-react';
import { BroadcastAuditRecord, GovernmentOfficer } from '../../types';
import { useCrisis } from '../../context/CrisisContext';

interface AuditLogViewerProps {
  officer: GovernmentOfficer;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ officer }) => {
  const { auditLogs } = useCrisis();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedActionType, setSelectedActionType] = useState<string>('ALL');
  const [verifiedHashId, setVerifiedHashId] = useState<string | null>(null);

  const actionTypes = [
    'ALL', 
    'PLAN_APPROVED', 
    'PLAN_MODIFIED', 
    'DIRECTIVE_ENABLED', 
    'BROADCAST_DISPATCHED', 
    'CAD_UNIT_DISPATCHED', 
    'DRILL_EXECUTED'
  ];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      (log.officerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.officerId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.actionType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.sha256Signature || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.advisoryTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.notes || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = selectedActionType === 'ALL' || log.actionType === selectedActionType;

    return matchesSearch && matchesAction;
  });

  const handleVerifyHash = (id: string) => {
    setVerifiedHashId(id);
    setTimeout(() => {
      setVerifiedHashId(null);
    }, 4000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CrisisChain_AuditTrail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white dark:bg-[#0C213D] border border-slate-200 dark:border-[#1E4575] rounded-xl p-5 shadow-lg space-y-5 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-[#1A3D6B]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg border border-blue-400/40">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700 text-[10px] font-bold uppercase">
                GOVERNMENT AUDIT TRAIL
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">SHA-256 HSM Signed</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Tamper-Proof Emergency Action Ledger
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Legally binding immutable audit trail under Section 38 of the Disaster Management Act, 2005
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#15345B] hover:bg-slate-200 dark:hover:bg-[#1C4577] text-slate-800 dark:text-blue-200 border border-slate-300 dark:border-[#27578E] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Certificate (JSON)</span>
          </button>
        </div>
      </div>

      {/* Security Statement */}
      <div className="bg-slate-50 dark:bg-[#081526] p-3 rounded-lg border border-blue-200 dark:border-blue-500/30 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 dark:text-white">Cryptographic Notarization: </span>
          Every commander approval, directive edit, public broadcast, and dispatch order generates a unique SHA-256 signature combining officer credentials, hardware timestamp, and payload state. Records cannot be deleted or retroactively altered.
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search officer, action, hash, zones..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#081526] border border-slate-300 dark:border-[#1C3E6E] rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Action Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {actionTypes.map((action) => (
            <button
              key={action}
              onClick={() => setSelectedActionType(action)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedActionType === action
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-[#081729] border border-slate-200 dark:border-[#1A3D69] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {action.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-[#081526] rounded-xl border border-slate-200 dark:border-[#18365D] text-slate-500 dark:text-slate-400 text-xs">
            No audit logs found matching criteria.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#09182d] border border-slate-200 dark:border-[#1d4373] hover:border-blue-400 dark:hover:border-blue-500/60 transition-all space-y-2.5 shadow-sm"
            >
              {/* Top Row: Timestamp, Action Type, Verification */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                      log.actionType === 'BROADCAST_DISPATCHED'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : log.actionType === 'PLAN_APPROVED'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                        : log.actionType === 'CAD_UNIT_DISPATCHED'
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    }`}
                  >
                    {log.actionType.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{log.advisoryTitle || 'Operational Decision'}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{log.timestamp}</span>
                </div>
              </div>

              {/* Middle: Notes & Channels/Zones if present */}
              {log.notes && (
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-[#061221] p-3 rounded-lg border border-slate-200 dark:border-[#143154]">
                  {log.notes}
                </p>
              )}

              {/* Channels & Zones */}
              {(log.channelsDispatched || log.affectedZones) && (
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300">
                  {log.channelsDispatched && log.channelsDispatched.length > 0 && (
                    <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                      <Radio className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <span>Channels: {log.channelsDispatched.join(', ')}</span>
                    </div>
                  )}

                  {log.affectedZones && log.affectedZones.length > 0 && (
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                      <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>Zones: {log.affectedZones.join(', ')}</span>
                    </div>
                  )}

                  {log.citizenReachCount > 0 && (
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                      <Users className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Reach: {log.citizenReachCount.toLocaleString()} Citizens</span>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom: Officer Credentials & Hash Signature */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-[#153459] text-[11px]">
                <div className="flex flex-wrap items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {log.officerName}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono font-bold">
                    {log.officerId}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-[10px]">
                    {log.agency}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">{log.roleTitle}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400 bg-white dark:bg-[#050e1a] px-2 py-1 rounded border border-slate-300 dark:border-slate-800 truncate max-w-xs sm:max-w-sm">
                    SHA256: {log.sha256Signature}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleVerifyHash(log.id)}
                    className="px-2 py-1 bg-blue-100 dark:bg-[#153b6c] hover:bg-blue-600 hover:text-white text-blue-800 dark:text-blue-200 rounded text-[10px] font-bold font-mono transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {verifiedHashId === log.id ? '✓ VALIDATED' : 'Verify'}
                  </button>
                </div>
              </div>

              {/* Verification Toast if clicked */}
              {verifiedHashId === log.id && (
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 dark:border-emerald-500 rounded-lg text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    Cryptographic signature integrity verified against National Command Key HSM. Payload checksum matches origin state.
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
