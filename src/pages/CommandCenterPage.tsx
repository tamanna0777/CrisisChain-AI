import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Users, 
  HeartPulse, 
  Home, 
  Navigation, 
  Truck, 
  Cpu, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  PhoneCall, 
  Building2, 
  LogOut, 
  ExternalLink, 
  FileText, 
  Play, 
  Sliders, 
  Layers, 
  BellRing,
  RefreshCw,
  Search,
  CheckCheck,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { GovernmentOfficer, PublicAdvisory, CommanderActionPlan } from '../types';
import { 
  INITIAL_AGENTS_DATA, 
  INITIAL_NEGOTIATION_CONFLICTS, 
  INITIAL_COMMANDER_PLAN 
} from '../data/commandCenterData';
import { SeismicAgentCard } from '../components/command/SeismicAgentCard';
import { PopulationAgentCard } from '../components/command/PopulationAgentCard';
import { HospitalAgentCard } from '../components/command/HospitalAgentCard';
import { ShelterAgentCard } from '../components/command/ShelterAgentCard';
import { RouteAgentCard } from '../components/command/RouteAgentCard';
import { LogisticsAgentCard } from '../components/command/LogisticsAgentCard';
import { NegotiationAgentCard } from '../components/command/NegotiationAgentCard';
import { CommanderDecisionPanel } from '../components/command/CommanderDecisionPanel';
import { PublicBroadcastCenter } from '../components/command/PublicBroadcastCenter';
import { DisasterDrillSimulator } from '../components/command/DisasterDrillSimulator';
import { AuditLogViewer } from '../components/command/AuditLogViewer';
import { IncidentTimeline } from '../components/command/IncidentTimeline';
import { HandoffNoteModal } from '../components/command/HandoffNoteModal';
import { Challenge613HandoffPanel } from '../components/command/Challenge613HandoffPanel';
import { InteractiveDisasterMap } from '../components/InteractiveDisasterMap';
import { LiveDisasterFeed } from '../components/LiveDisasterFeed';
import { ThemeToggle } from '../components/ThemeToggle';
import { useCrisis } from '../context/CrisisContext';
import { IncidentTimelineEvent, ShiftTransferPayload } from '../types';

export type EOCSubTabType = 'agents' | 'commander' | 'handoff_613' | 'gis_map' | 'broadcast' | 'simulator' | 'sos_queue' | 'audit_logs';

interface CommandCenterPageProps {
  officer: GovernmentOfficer;
  onLogout: () => void;
  onSwitchToCitizenView: () => void;
  currentSubTab?: EOCSubTabType;
  onSubTabChange?: (tab: EOCSubTabType) => void;
}

export const CommandCenterPage: React.FC<CommandCenterPageProps> = ({
  officer,
  onLogout,
  onSwitchToCitizenView,
  currentSubTab,
  onSubTabChange,
}) => {
  const { 
    activeSOSAlerts, 
    resolveEmergencySOS, 
    auditLogs, 
    addAuditLog, 
    broadcastNewAdvisory, 
    shelters,
    govSensorAlerts,
    userLocation 
  } = useCrisis();

  const [internalSubTab, setInternalSubTab] = useState<EOCSubTabType>(currentSubTab || 'agents');

  // Keep internalSubTab in sync if parent prop changes
  React.useEffect(() => {
    if (currentSubTab) {
      setInternalSubTab(currentSubTab);
    }
  }, [currentSubTab]);

  const activeSubTab = currentSubTab || internalSubTab;
  const handleTabSelect = (tab: EOCSubTabType) => {
    setInternalSubTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };
  const [agentsData, setAgentsData] = useState(INITIAL_AGENTS_DATA);
  const [commanderPlan, setCommanderPlan] = useState<CommanderActionPlan>(INITIAL_COMMANDER_PLAN);
  const [conflicts] = useState(INITIAL_NEGOTIATION_CONFLICTS);
  const [broadcastNotification, setBroadcastNotification] = useState<string | null>(null);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);

  // Dynamic Incident Timeline State
  const [timelineEvents, setTimelineEvents] = useState<IncidentTimelineEvent[]>([
    {
      id: 'evt-1',
      time: '11:32',
      title: 'Earthquake Detected',
      status: 'COMPLETED',
      description: 'ESP32 + MPU6050 seismograph hardware trigger registered (M6.8 intensity, Pune District)',
    },
    {
      id: 'evt-2',
      time: '11:33',
      title: 'AI Analysis Started',
      status: 'COMPLETED',
      description: '6 specialized AI sub-agents initiated multi-sensor triangulation & risk assessment',
    },
    {
      id: 'evt-3',
      time: '11:34',
      title: 'Response Plan Generated',
      status: 'COMPLETED',
      description: 'Tactical Directives #P-901 compiled with 91% Multi-Agent AI Confidence score',
    },
    {
      id: 'evt-4',
      time: '11:35',
      title: 'Alert Sent',
      status: 'COMPLETED',
      description: 'High-priority early warning broadcast to citizen mobile devices & siren network',
    },
    {
      id: 'evt-5',
      time: '11:37',
      title: 'Shelter Assigned',
      status: 'COMPLETED',
      description: 'Pune Safe Ground allocated with 340+ bed capacity & emergency medical supplies',
    },
    {
      id: 'evt-6',
      time: '11:38',
      title: 'Handoff Generated',
      status: 'LIVE',
      description: 'Operational shift handover briefing note created and ready for officer custody transfer',
    },
  ]);

  // Top Status Bar metrics
  const activeSOSCount = activeSOSAlerts.length;
  const activeShelterCount = shelters && shelters.length > 0 ? shelters.filter(s => s.status === 'OPEN').length : 18;

  const getCurrentTimeFormatted = () => {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleApprovePlan = (approvedPlan: CommanderActionPlan) => {
    setCommanderPlan(approvedPlan);
    
    // Immutable Audit Log
    addAuditLog({
      actionType: 'PLAN_APPROVED',
      officerName: officer.name,
      officerId: officer.employeeId,
      agency: officer.agency,
      roleTitle: officer.roleTitle,
      advisoryTitle: `Approved Tactical Action Plan #${approvedPlan.id}`,
      affectedZones: ['Sector B', 'Sector C', 'Evacuation Corridor Route 7'],
      citizenReachCount: 23410,
      notes: `Plan #${approvedPlan.id} endorsed. ${approvedPlan.tacticalDirectives.filter(d => d.enabled).length} directives activated. Remarks: "${approvedPlan.commanderNotes || 'Validated against NDMA SOP'}"`,
    });

    // Append to timeline
    setTimelineEvents((prev) => [
      ...prev,
      {
        id: `evt-${Date.now()}`,
        time: getCurrentTimeFormatted(),
        title: 'Response Plan Approved & Dispatched',
        status: 'COMPLETED',
        description: `Tactical Action Plan #${approvedPlan.id} approved by ${officer.name} (${officer.roleTitle})`,
      },
    ]);

    setBroadcastNotification('Response Plan approved by Commander. Public Broadcast Center is ready to dispatch citizen notices.');
    setTimeout(() => setBroadcastNotification(null), 8000);
  };

  const handleRejectPlan = () => {
    setCommanderPlan((prev) => ({ ...prev, status: 'REJECTED' }));

    // Immutable Audit Log
    addAuditLog({
      actionType: 'PLAN_MODIFIED',
      officerName: officer.name,
      officerId: officer.employeeId,
      agency: officer.agency,
      roleTitle: officer.roleTitle,
      advisoryTitle: `Rejected Tactical Action Plan #${commanderPlan.id}`,
      affectedZones: ['All Sectors'],
      citizenReachCount: 0,
      notes: `Plan #${commanderPlan.id} returned to AI Multi-Agent system for recalculation. Alternate evacuation routes requested.`,
    });

    // Append to timeline
    setTimelineEvents((prev) => [
      ...prev,
      {
        id: `evt-${Date.now()}`,
        time: getCurrentTimeFormatted(),
        title: 'Plan Recalculation Requested',
        status: 'IN_PROGRESS',
        description: `Tactical plan rejected by Commander; alternate parameters requested`,
      },
    ]);

    setBroadcastNotification('Response Plan rejected. Sub-agents notified to regenerate operational parameters.');
    setTimeout(() => setBroadcastNotification(null), 8000);
  };

  const handleBroadcastAdvisory = (advisory: PublicAdvisory) => {
    setCommanderPlan((prev) => ({
      ...prev,
      status: 'BROADCASTED',
      broadcastDispatched: true,
    }));

    // Broadcast through CrisisContext which dispatches to all citizen components & records audit log
    broadcastNewAdvisory(advisory, officer);

    // Append to timeline
    setTimelineEvents((prev) => [
      ...prev,
      {
        id: `evt-${Date.now()}`,
        time: getCurrentTimeFormatted(),
        title: 'Public Advisory Disseminated',
        status: 'COMPLETED',
        description: `Advisory "${advisory.title}" broadcasted across all emergency channels`,
      },
    ]);

    setBroadcastNotification(`Official Advisory "${advisory.title}" successfully disseminated to all citizen apps, cell towers, and emergency frequencies!`);
    setTimeout(() => setBroadcastNotification(null), 10000);
  };

  // Officer Shift Transfer handler (Requirement 4)
  const handleShiftTransfer = async (payload: ShiftTransferPayload) => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    }) + ' IST';

    // 1. Record in immutable audit log
    addAuditLog({
      actionType: 'PLAN_MODIFIED',
      officerName: officer.name,
      officerId: officer.employeeId,
      agency: officer.agency,
      roleTitle: officer.roleTitle,
      advisoryTitle: `Shift Transfer: Handed over Case #${commanderPlan.id} to ${payload.toOfficerName}`,
      affectedZones: ['All Operational Sectors'],
      citizenReachCount: 0,
      notes: `Case transferred successfully. Transferred By: ${officer.name} (${officer.employeeId}), Transferred To: ${payload.toOfficerName} (${payload.toOfficerRole}), Timestamp: ${timestamp}. Notes: "${payload.notes || 'Routine shift change'}"`,
    });

    // 2. Append event to Incident Timeline
    setTimelineEvents((prev) => [
      ...prev,
      {
        id: `evt-${Date.now()}`,
        time: getCurrentTimeFormatted(),
        title: `Shift Transferred to ${payload.toOfficerName}`,
        status: 'COMPLETED',
        description: `Operational command transferred to ${payload.toOfficerName} (${payload.toOfficerRole})`,
      },
    ]);

    setBroadcastNotification(`Command handover executed: Case #${commanderPlan.id} successfully assigned to ${payload.toOfficerName}.`);
    setTimeout(() => setBroadcastNotification(null), 8000);

    return {
      success: true,
      message: `Case transferred successfully.\nTransferred By: ${officer.name}\nTransferred To: ${payload.toOfficerName}\nTimestamp: ${timestamp}`,
    };
  };

  const handleResolveSOS = (sosId: string, citizenName: string, emergencyType: string) => {
    resolveEmergencySOS(sosId);

    // Audit log CAD dispatch
    addAuditLog({
      actionType: 'CAD_UNIT_DISPATCHED',
      officerName: officer.name,
      officerId: officer.employeeId,
      agency: officer.agency,
      roleTitle: officer.roleTitle,
      advisoryTitle: `Dispatched CAD Unit & Resolved SOS #${sosId.slice(0, 8)}`,
      affectedZones: [`Citizen ${citizenName} Location`],
      citizenReachCount: 1,
      notes: `Emergency alert for citizen ${citizenName} (${emergencyType}) assigned to nearest SAR unit and marked resolved in CAD dispatch console.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white flex flex-col selection:bg-[#005EA8] selection:text-white transition-colors duration-250">
      {/* Top Government EOC Global Bar */}
      <header className="sticky top-0 z-50 bg-[#0A1E38] border-b border-[#1A3F6D] text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & EOC Seal */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-md border border-blue-300/40">
                <ShieldAlert className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg tracking-tight text-white flex items-center gap-1">
                    CrisisChain <span className="text-emerald-400 font-extrabold text-sm px-1.5 py-0.5 bg-emerald-950/90 rounded border border-emerald-500/40">EOC</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-900/90 text-blue-200 border border-blue-600 text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block">
                    NDMA | SDMA
                  </span>
                </div>
                <p className="text-[11px] text-blue-200/80 hidden md:block">
                  Government Emergency Operations & Autonomous Multi-Agent Command Center
                </p>
              </div>
            </div>

            {/* Officer Profile & Switch to Citizen Portal */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Switch to Citizen Portal Button */}
              <button
                onClick={onSwitchToCitizenView}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-[#153B69] hover:bg-[#1B4B85] text-blue-200 hover:text-white text-xs font-bold border border-[#27578E] shadow transition-all active:scale-95"
                title="Open Citizen Safety Portal in Preview Mode"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Citizen View</span>
              </button>

              {/* Mobile Logout Button (Visible on screens < lg) */}
              <button
                onClick={onLogout}
                title="Lock & Exit Command Center"
                className="lg:hidden p-1.5 sm:p-2 text-red-300 hover:text-red-100 hover:bg-red-950/80 rounded-lg border border-red-900/60 transition-colors flex items-center gap-1 text-xs font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Officer Badge */}
              <div className="hidden lg:flex items-center pl-3 border-l border-[#1A3D69] gap-2.5">
                <div className="text-right">
                  <div className="text-xs font-bold text-white">{officer.name}</div>
                  <div className="text-[10px] text-emerald-300 font-mono flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {officer.employeeId} • {officer.securityClearance}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Lock & Exit Command Center"
                  className="p-1.5 text-red-300 hover:text-red-100 hover:bg-red-950/80 rounded border border-red-900/60 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <nav className="flex space-x-1 border-t border-[#17375E] py-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleTabSelect('agents')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-colors ${
                activeSubTab === 'agents'
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'text-blue-200 hover:text-white hover:bg-[#133054]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Agent Network (7 Live)</span>
            </button>

            <button
              onClick={() => handleTabSelect('commander')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-colors relative ${
                activeSubTab === 'commander'
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'text-blue-200 hover:text-white hover:bg-[#133054]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Commander Decision Panel</span>
              {commanderPlan.status === 'PENDING_REVIEW' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </button>

            <button
              onClick={() => handleTabSelect('handoff_613')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-colors relative ${
                activeSubTab === 'handoff_613'
                  ? 'bg-indigo-600 text-white shadow-inner'
                  : 'text-indigo-200 hover:text-white hover:bg-[#133054]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-300" />
              <span>Challenge #613: Confidence & Handoff</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-indigo-950 text-indigo-200 border border-indigo-500/40">
                ICS-201
              </span>
            </button>

            <button
              onClick={() => handleTabSelect('gis_map')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-colors ${
                activeSubTab === 'gis_map'
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'text-blue-200 hover:text-white hover:bg-[#133054]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>GIS Radar & Evacuation Map</span>
            </button>

            <button
              onClick={() => handleTabSelect('broadcast')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-colors ${
                activeSubTab === 'broadcast'
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'text-blue-200 hover:text-white hover:bg-[#133054]'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Public Broadcast Center</span>
            </button>

            <button
              onClick={() => handleTabSelect('simulator')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-colors ${
                activeSubTab === 'simulator'
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'text-blue-200 hover:text-white hover:bg-[#133054]'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Hardware & Drill Simulator</span>
            </button>

            <button
              onClick={() => handleTabSelect('sos_queue')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-colors ${
                activeSubTab === 'sos_queue'
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'text-blue-200 hover:text-white hover:bg-[#133054]'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Live SOS Dispatch Queue</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-red-600 text-white">
                {activeSOSCount}
              </span>
            </button>

            <button
              onClick={() => handleTabSelect('audit_logs')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-colors ${
                activeSubTab === 'audit_logs'
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'text-blue-200 hover:text-white hover:bg-[#133054]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audit Logs & Ledger</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-700">
                {auditLogs.length}
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Global Broadcast Feedback Alert */}
      {broadcastNotification && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-lg animate-bounce">
          <div className="max-w-7xl mx-auto flex items-center gap-2 w-full">
            <CheckCheck className="w-4 h-4" />
            <span>{broadcastNotification}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Real-time Hardware Sensor Ingestion Alert Banner */}
        {govSensorAlerts.length > 0 && (
          <div 
            id="gov-sensor-alert-banner"
            className="bg-white dark:bg-slate-900 border-2 border-amber-500 rounded-2xl p-4 sm:p-5 text-slate-900 dark:text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 rounded-xl shadow-inner shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50 text-[10px] font-black uppercase tracking-wider animate-pulse">
                    ⚠ NEW SENSOR EVENT
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Real-Time ESP32 + MPU6050 Ingestion
                  </span>
                </div>
                <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-100 dark:bg-slate-950/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Device</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{govSensorAlerts[0].deviceId}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-950/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{govSensorAlerts[0].location}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-950/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Time</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{govSensorAlerts[0].time}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-950/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50 text-[11px] font-bold inline-block">
                      {govSensorAlerts[0].status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
              <button
                onClick={() => handleTabSelect('commander')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md border border-blue-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Review Tactical Plan</span>
                <Play className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TOP STATUS BAR (Exact Specification from Prompt)              */}
        {/* ============================================================ */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. System Status */}
          <div className="bg-white dark:bg-[#0D223E] border border-slate-200 dark:border-[#1E4575] rounded-xl p-3 shadow-sm dark:shadow-md flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600/50">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">System Status</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                <span>ACTIVE</span>
              </div>
            </div>
          </div>

          {/* 2. Detected Events */}
          <div className="bg-white dark:bg-[#0D223E] border border-slate-200 dark:border-red-500/40 rounded-xl p-3 shadow-sm dark:shadow-md flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-600/50">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Detected Events</div>
              <div className="text-xl font-black text-red-600 dark:text-red-400">
                1 <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">(M6.8)</span>
              </div>
            </div>
          </div>

          {/* 3. Active SOS Requests */}
          <div className="bg-white dark:bg-[#0D223E] border border-slate-200 dark:border-red-500/40 rounded-xl p-3 shadow-sm dark:shadow-md flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-600/50">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Active SOS</div>
              <div className="text-xl font-black text-red-600 dark:text-red-400">
                {activeSOSCount}
              </div>
            </div>
          </div>

          {/* 4. Affected Citizens */}
          <div className="bg-white dark:bg-[#0D223E] border border-slate-200 dark:border-amber-500/40 rounded-xl p-3 shadow-sm dark:shadow-md flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-600/50">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Affected Citizens</div>
              <div className="text-xl font-black text-amber-600 dark:text-amber-300">
                23,410
              </div>
            </div>
          </div>

          {/* 5. Active Shelters */}
          <div className="bg-white dark:bg-[#0D223E] border border-slate-200 dark:border-emerald-500/40 rounded-xl p-3 shadow-sm dark:shadow-md flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600/50">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Active Shelters</div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-300">
                {activeShelterCount} <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Open</span>
              </div>
            </div>
          </div>

          {/* 6. Available Ambulances */}
          <div className="bg-white dark:bg-[#0D223E] border border-slate-200 dark:border-blue-500/40 rounded-xl p-3 shadow-sm dark:shadow-md flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-600/50">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Ambulances</div>
              <div className="text-xl font-black text-blue-600 dark:text-blue-300">
                42 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">(28 Act)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* TAB 1: AI AGENT NETWORK (LIVE AGENTS)                         */}
        {/* ============================================================ */}
        {activeSubTab === 'agents' && (
          <div className="space-y-5">
            {/* Master AI Negotiation Agent Card (Hero Full Width) */}
            <NegotiationAgentCard
              data={agentsData.negotiation}
              conflicts={conflicts}
              onOpenCommanderPanel={() => handleTabSelect('commander')}
            />

            {/* Specialized Sub-Agents 3-column / 2-row Responsive Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Live Specialized AI Agents Telemetry</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Continuous real-time sensing of hardware seismographs, hospital beds, traffic GIS, and crowd telemetry
                  </p>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  6 / 6 SUB-AGENTS SYNCED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SeismicAgentCard data={agentsData.seismic} />
                <PopulationAgentCard data={agentsData.population} />
                <HospitalAgentCard data={agentsData.hospital} />
                <ShelterAgentCard data={agentsData.shelter} />
                <RouteAgentCard data={agentsData.route} />
                <LogisticsAgentCard data={agentsData.logistics} />
              </div>
            </div>

            {/* ============================================================ */}
            {/* INCIDENT TIMELINE & LIVE STREAM FEED                         */}
            {/* ============================================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-6">
                <IncidentTimeline 
                  events={timelineEvents} 
                  onRefresh={() => {
                    setTimelineEvents((prev) => [
                      ...prev,
                      {
                        id: `evt-${Date.now()}`,
                        time: getCurrentTimeFormatted(),
                        title: 'Telemetry Stream Synchronized',
                        status: 'COMPLETED',
                        description: 'All 6 sub-agents verified zero packet loss across IoT mesh',
                      }
                    ]);
                  }}
                />
              </div>
              <div className="lg:col-span-6">
                <LiveDisasterFeed />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: COMMANDER DECISION PANEL                              */}
        {/* ============================================================ */}
        {activeSubTab === 'commander' && (
          <CommanderDecisionPanel
            plan={commanderPlan}
            officer={officer}
            onApprovePlan={handleApprovePlan}
            onRejectPlan={handleRejectPlan}
            onNavigateToBroadcast={() => handleTabSelect('broadcast')}
            onOpenHandoffModal={() => setIsHandoffModalOpen(true)}
          />
        )}

        {/* ============================================================ */}
        {/* TAB: CHALLENGE #613 USER CONFIDENCE & HANDOFF INTELLIGENCE   */}
        {/* ============================================================ */}
        {activeSubTab === 'handoff_613' && (
          <Challenge613HandoffPanel
            plan={commanderPlan}
            officer={officer}
            onOpenTransferModal={() => setIsHandoffModalOpen(true)}
          />
        )}

        {/* ============================================================ */}
        {/* TAB: INTERACTIVE GIS RADAR & TACTICAL MAPS                   */}
        {/* ============================================================ */}
        {activeSubTab === 'gis_map' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#0D223E] border border-slate-200 dark:border-[#1E4575] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>National Civil Defense GIS & Emergency Routing Matrix</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Tactical overlays for evacuation corridors, active shelter occupancy, hospital ICU capacities, and seismic impact zones.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded-lg text-xs font-mono font-bold">
                  SDRF DRONE RECON LIVE
                </span>
              </div>
            </div>

            <InteractiveDisasterMap
              userLocation={userLocation}
              shelters={shelters}
              height="h-[520px]"
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: PUBLIC BROADCAST CENTER                               */}
        {/* ============================================================ */}
        {activeSubTab === 'broadcast' && (
          <PublicBroadcastCenter
            plan={commanderPlan}
            officer={officer}
            onBroadcastAdvisory={handleBroadcastAdvisory}
            onNavigateToCitizenView={onSwitchToCitizenView}
          />
        )}

        {/* ============================================================ */}
        {/* TAB 4: DISASTER DRILL SIMULATOR                              */}
        {/* ============================================================ */}
        {activeSubTab === 'simulator' && (
          <DisasterDrillSimulator
            onSimulationComplete={() => {
              setBroadcastNotification('Full 8-Stage Seismic Drill completed successfully! Operational consensus achieved.');
              setTimeout(() => setBroadcastNotification(null), 8000);
            }}
          />
        )}

        {/* ============================================================ */}
        {/* TAB 5: LIVE SOS DISPATCH QUEUE                               */}
        {/* ============================================================ */}
        {activeSubTab === 'sos_queue' && (
          <div className="bg-white dark:bg-[#0C213D] border-2 border-slate-200 dark:border-[#1E4575] rounded-xl p-5 shadow-xl space-y-4 text-slate-900 dark:text-white transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1A3E6B]">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-red-500 animate-pulse" />
                  <span>Citizen Live SOS Distress Stream & CAD Dispatch</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Direct telemetry from REACT Wearable LifeBands, GPS Distress Beacons, and Citizen Emergency Trigger
                </p>
              </div>
              <span className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700 rounded text-xs font-mono font-bold">
                {activeSOSCount} ACTIVE ALERTS
              </span>
            </div>

            {/* Seeded and Live SOS Alert items */}
            <div className="space-y-2.5">
              {/* If citizen triggered live SOS in app */}
              {activeSOSAlerts.map((sos) => (
                <div
                  key={sos.id}
                  className="p-4 rounded-lg bg-red-50 dark:bg-red-950/60 border-2 border-red-400 dark:border-red-500/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse text-slate-900 dark:text-white"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase">
                        LIVE CITIZEN SOS: {sos.emergencyType}
                      </span>
                      <span className="font-mono text-xs text-red-700 dark:text-red-300 font-bold">
                        {sos.userName} ({sos.phone})
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-200">
                      <strong>Location:</strong> {sos.address} (Lat: {sos.latitude.toFixed(4)}, Lon: {sos.longitude.toFixed(4)})
                    </div>
                    {sos.notes && (
                      <div className="text-xs text-amber-700 dark:text-amber-200 italic mt-0.5">
                        Notes: "{sos.notes}"
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolveSOS(sos.id, sos.userName, sos.emergencyType)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs shadow-md border border-emerald-400/40 cursor-pointer"
                    >
                      Dispatch & Resolve
                    </button>
                  </div>
                </div>
              ))}

              {/* Sample realism SOS items */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0E2442] border border-slate-200 dark:border-[#234F84] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-900 dark:text-white">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      REACT WEARABLE FALL TRIGGER
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Anil Deshmukh • +91 98450 11223</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Sector B Industrial Zone, Bldg 4 Floor 2 • LifeBand V3 Impact Vector: 4.2g
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">AMBULANCE #12 DISPATCHED</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0E2442] border border-slate-200 dark:border-[#234F84] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-900 dark:text-white">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700">
                      STRUCTURAL TRAP DISTRESS
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Pooja Kulkarni • +91 98221 44556</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Sector C Market Complex Basement • 3 Citizens with minor lacerations
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-bold">NDRF BATTALION 4 EN ROUTE (4 MIN)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0E2442] border border-slate-200 dark:border-[#234F84] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-900 dark:text-white">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                      MEDICAL ASSISTANCE
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Govind Rathi • +91 98111 88990</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Sector B Residential Colony • Elder resident requiring oxygen support
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">PARAMEDIC CORPS #08 ASSIGNED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: AUDIT LOGS & TAMPER-PROOF LEDGER                      */}
        {/* ============================================================ */}
        {activeSubTab === 'audit_logs' && (
          <AuditLogViewer officer={officer} />
        )}
      </main>

      {/* ============================================================ */}
      {/* HANDOFF NOTE & SHIFT TRANSFER MODAL                          */}
      {/* ============================================================ */}
      <HandoffNoteModal
        isOpen={isHandoffModalOpen}
        onClose={() => setIsHandoffModalOpen(false)}
        plan={commanderPlan}
        officer={officer}
        onTransferCase={handleShiftTransfer}
      />

      {/* Footer */}
      <footer className="bg-[#F7F9FB] border-t border-[#D8E1E8] py-4 text-xs text-slate-600 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#005EA8]" />
            <span className="font-bold text-[#243447]">
              CrisisChain AI • National Disaster Operations Command System
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Authorized for NDMA / SDMA Official SAR Coordination • Section 38 DMA-2005 Compliant
          </div>
        </div>
      </footer>
    </div>
  );
};

