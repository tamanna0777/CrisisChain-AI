import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  PhoneCall, 
  UserPlus, 
  CheckCircle2, 
  Eye, 
  BellRing, 
  Radio, 
  ExternalLink,
  Shield,
  Activity,
  HeartHandshake,
  Battery,
  Wifi,
  Sparkles,
  RefreshCw,
  Navigation,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCrisis } from '../context/CrisisContext';
import { FamilyMemberRecord, LocationRequestRecord } from '../types';
import { LocationRequestModal } from '../components/LocationRequestModal';
import { InteractiveDisasterMap } from '../components/InteractiveDisasterMap';
import { LiveDisasterFeed } from '../components/LiveDisasterFeed';

interface FamilySafetyDashboardProps {
  onOpenAddMember: () => void;
  onOpenSafeModal: () => void;
  onOpenSOSModal: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const FamilySafetyDashboard: React.FC<FamilySafetyDashboardProps> = ({
  onOpenAddMember,
  onOpenSafeModal,
  onOpenSOSModal,
  onNavigateToTab,
}) => {
  const { userProfile } = useAuth();
  const { 
    familyMembers, 
    pendingInvitations, 
    requestMemberLocation, 
    locationRequestsSent, 
    incomingLocationRequests,
    userActiveSOS,
    resolveEmergencySOS,
    activeSOSAlerts,
    civilDefenseSafeCount,
    recentSafeEvents,
    familyCheckStatus,
    requestFamilySafetyStatus,
    hardwareEarthquakeAlert,
    userLocation,
    shelters
  } = useCrisis();

  const [activeRequestModal, setActiveRequestModal] = useState<LocationRequestRecord | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isSendingFamilyCheck, setIsSendingFamilyCheck] = useState<boolean>(false);
  const [pingingMemberId, setPingingMemberId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SAFE' | 'ATTENTION' | 'PENDING'>('ALL');

  const handleRequestFamilyStatus = async () => {
    setIsSendingFamilyCheck(true);
    const res = await requestFamilySafetyStatus();
    setFeedbackToast(res.message);
    setIsSendingFamilyCheck(false);
    setTimeout(() => setFeedbackToast(null), 6000);
  };

  // Filter metrics
  const totalFamilyCount = familyMembers.length;
  const safeMembersCount = familyMembers.filter((m) => m.safetyStatus === 'Safe').length;
  const attentionMembersCount = familyMembers.filter(
    (m) => m.safetyStatus === 'Not Recently Updated' || m.safetyStatus === 'SOS Active' || m.safetyStatus === 'Missing'
  ).length;
  const pendingCount = pendingInvitations.length;

  // Auto-prompt incoming location request modal if received
  useEffect(() => {
    if (incomingLocationRequests.length > 0) {
      setActiveRequestModal(incomingLocationRequests[0]);
    }
  }, [incomingLocationRequests]);

  const handleRequestLocation = async (member: FamilyMemberRecord) => {
    await requestMemberLocation(member);
    setFeedbackToast(`Urgent location request dispatched to ${member.memberName}. Waiting for citizen approval.`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handlePingMemberDevice = (member: FamilyMemberRecord) => {
    setPingingMemberId(member.id);
    setTimeout(() => {
      setPingingMemberId(null);
      setFeedbackToast(`Telemetry ping received from ${member.memberName}'s device. Battery: ${member.batteryLevel || 88}%, Signal: ${member.signalStrength || '-64 dBm'}.`);
      setTimeout(() => setFeedbackToast(null), 5000);
    }, 1200);
  };

  // Helper to format relative check-in time
  const formatTimeAgo = (isoString: string) => {
    if (!isoString) return 'Never checked in';
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  // Color mappings for safety statuses
  const getStatusBadge = (status: FamilyMemberRecord['safetyStatus']) => {
    switch (status) {
      case 'Safe':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Safe
          </span>
        );
      case 'Not Recently Updated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Not Recently Updated
          </span>
        );
      case 'SOS Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-500 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            SOS Active
          </span>
        );
      case 'Missing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Missing
          </span>
        );
      default:
        return null;
    }
  };

  const filteredMembers = familyMembers.filter((m) => {
    if (statusFilter === 'SAFE') return m.safetyStatus === 'Safe';
    if (statusFilter === 'ATTENTION') return m.safetyStatus !== 'Safe';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-900 border border-blue-400 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs animate-slideUp">
          <BellRing className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Active Distress Banner if user or family member has SOS */}
      {userActiveSOS && (
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-rose-900 border-2 border-red-500 rounded-2xl p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-red-600 rounded-xl shadow-lg animate-bounce">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">
                  ACTIVE SOS BROADCAST: {userActiveSOS.emergencyType.toUpperCase()}
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-red-950 border border-red-400 rounded text-red-200">
                  Transmitting
                </span>
              </div>
              <p className="text-xs text-red-200 mt-0.5">
                Coordinates ({userActiveSOS.latitude.toFixed(4)}, {userActiveSOS.longitude.toFixed(4)}) & Dispatch Alert sent to Family and Civil Responders.
              </p>
            </div>
          </div>
          <button
            onClick={() => resolveEmergencySOS(userActiveSOS.id)}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-red-800 font-bold text-xs rounded-xl shadow transition shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Mark Resolved (I am Safe Now)</span>
          </button>
        </div>
      )}

      {/* Hero Welcome & Quick Action Bar */}
      <div 
        id="hero-welcome-banner"
        className="bg-gradient-to-r from-[#0E2849] via-[#133863] to-[#0A1F38] border border-[#1E4370] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> NDMA Active Protection
              </span>
              <span className="text-xs text-[#CBD5E1] font-mono">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFFFF]">
              Family Safety Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#E2E8F0] mt-1 max-w-2xl">
              Monitored family network with strict on-demand consent location sharing, wearable fall telemetry, and direct disaster command dispatch.
            </p>
          </div>

          {/* Large Primary Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* "I AM SAFE" Button */}
            <button
              id="btn-i-am-safe-hero"
              onClick={onOpenSafeModal}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 border border-emerald-400/50 hover:scale-[1.02] cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>I AM SAFE</span>
            </button>

            {/* "SEND SOS" Button */}
            <button
              id="btn-send-sos-hero"
              onClick={onOpenSOSModal}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2 border border-red-400/60 animate-pulse hover:scale-[1.02] cursor-pointer"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>SEND SOS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Family Safety Check Feature Banner */}
      {(familyCheckStatus !== 'NORMAL' || hardwareEarthquakeAlert) && (
        <div 
          id="family-check-feature-panel"
          className="bg-white dark:bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-5 text-slate-900 dark:text-white shadow-2xl animate-fadeIn space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Users className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-600/50 text-[10px] font-bold uppercase tracking-wider">
                    Earthquake Emergency Safety Check
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {familyCheckStatus === 'REQUEST_SENT' ? 'Notification Sent to Family Members' : 'Checking Family Members...'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  Checking Family Members...
                </h3>
              </div>
            </div>

            <button
              id="request-safety-status-btn"
              onClick={handleRequestFamilyStatus}
              disabled={isSendingFamilyCheck}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 border border-blue-400/40 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Radio className="w-4 h-4 text-blue-200 animate-pulse" />
              {isSendingFamilyCheck ? 'SENDING PING...' : 'REQUEST SAFETY STATUS'}
            </button>
          </div>

          {/* Member Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-slate-950 border border-amber-300 dark:border-amber-500/40 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Mother</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Amina Shaikh</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50 text-xs font-bold flex items-center gap-1.5">
                ❓ Unknown
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-amber-300 dark:border-amber-500/40 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Father</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Ibrahim Shaikh</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50 text-xs font-bold flex items-center gap-1.5">
                ❓ Unknown
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-500/40 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Brother</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Farhan Shaikh</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/50 text-xs font-bold flex items-center gap-1.5">
                ✅ Safe
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4 PRIMARY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Family Members */}
        <div 
          id="card-total-family"
          onClick={() => setStatusFilter('ALL')}
          className={`bg-white dark:bg-[#0D223E] border rounded-2xl p-4 sm:p-5 shadow cursor-pointer transition ${
            statusFilter === 'ALL' ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-200 dark:border-[#1E4575] hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Family Members
            </span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700/50">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalFamilyCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Linked members</span>
          </div>
        </div>

        {/* Safe Members (Green) */}
        <div 
          id="card-safe-members"
          onClick={() => setStatusFilter('SAFE')}
          className={`bg-white dark:bg-[#0D223E] border rounded-2xl p-4 sm:p-5 shadow cursor-pointer transition ${
            statusFilter === 'SAFE' ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-200 dark:border-emerald-800/60 hover:border-emerald-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Safe Members
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {safeMembersCount}
            </span>
            <span className="text-xs text-emerald-600/80 dark:text-emerald-300/80">Active safe check-ins</span>
          </div>
        </div>

        {/* Members Requiring Attention (Yellow/Red) */}
        <div 
          id="card-attention-members"
          onClick={() => setStatusFilter('ATTENTION')}
          className={`bg-white dark:bg-[#0D223E] border rounded-2xl p-4 sm:p-5 shadow cursor-pointer transition ${
            statusFilter === 'ATTENTION' ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-200 dark:border-amber-800/60 hover:border-amber-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Requiring Attention
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {attentionMembersCount}
            </span>
            <span className="text-xs text-amber-600/80 dark:text-amber-300/80">Not recently updated</span>
          </div>
        </div>

        {/* Pending Invitations */}
        <div 
          id="card-pending-invites"
          onClick={() => onNavigateToTab('family-setup')}
          className="bg-white dark:bg-[#0D223E] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 shadow hover:border-blue-500 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Invitations
            </span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {pendingCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Awaiting acceptance</span>
            </div>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">View invites →</span>
          </div>
        </div>
      </div>

      {/* Interactive GIS Map Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Local Disaster & Evacuation GIS Radar
            </h3>
          </div>
          <button
            onClick={() => onNavigateToTab('shelters')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Full Shelter & Hospital Directory</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <InteractiveDisasterMap
          userLocation={userLocation}
          shelters={shelters}
          height="h-72 sm:h-80"
        />
      </div>

      {/* FAMILY MEMBERS SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Family Safety Network
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({filteredMembers.length} active verified members)
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time telemetry, battery levels, signal status, and instant on-demand emergency pings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-add-family-member-dashboard"
              onClick={onOpenAddMember}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Family Member</span>
            </button>
          </div>
        </div>

        {/* Member Cards Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => {
              const pendingLocationRequest = locationRequestsSent.find(
                (r) => r.targetMemberEmail === member.memberEmail && r.status === 'pending'
              );
              const activeLocationShare = locationRequestsSent.find(
                (r) => r.targetMemberEmail === member.memberEmail && r.status === 'approved'
              );
              const isPinging = pingingMemberId === member.id;

              return (
                <div
                  key={member.id}
                  id={`card-member-${member.id}`}
                  className="bg-white dark:bg-[#0D223E] border border-slate-200 dark:border-[#1E4575] hover:border-blue-400 dark:hover:border-blue-500/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition"
                >
                  {/* Top: Avatar, Name, Relationship, Status Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md border border-blue-400/30">
                          {member.memberName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            {member.memberName}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-900 text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-slate-700">
                              {member.relationship}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              {member.memberPhone}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge with official color */}
                      <div>{getStatusBadge(member.safetyStatus)}</div>
                    </div>

                    {/* Telemetry Bar: Battery, Signal, Connection */}
                    <div className="mt-3 grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-[11px]">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Battery className={`w-3.5 h-3.5 ${
                          (member.batteryLevel || 88) > 50 ? 'text-emerald-500' : 'text-amber-500'
                        }`} />
                        <span className="font-mono font-bold">{member.batteryLevel || 88}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Wifi className="w-3.5 h-3.5 text-blue-500" />
                        <span className="truncate">{member.signalStrength || '-64 dBm'}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1 text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="font-mono text-[10px] font-bold">{member.connectionStatus || 'ONLINE'}</span>
                      </div>
                    </div>

                    {/* Last Check-in timestamp */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Last Telemetry:
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {formatTimeAgo(member.lastCheckIn)}
                      </span>
                    </div>

                    {/* Live Shared Location Snippet if active */}
                    {activeLocationShare && (
                      <div className="mt-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Location active ({activeLocationShare.duration})</span>
                        </span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${activeLocationShare.latitude},${activeLocationShare.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold underline text-emerald-700 dark:text-white"
                        >
                          View Map
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions: Request Location, Ping Telemetry, Direct Call */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                    <button
                      id={`btn-req-loc-${member.id}`}
                      type="button"
                      disabled={!!pendingLocationRequest}
                      onClick={() => handleRequestLocation(member)}
                      className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer ${
                        pendingLocationRequest
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-blue-50 dark:bg-blue-900/80 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-700/60'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{pendingLocationRequest ? 'Requested...' : 'Req Location'}</span>
                    </button>

                    <button
                      onClick={() => handlePingMemberDevice(member)}
                      disabled={isPinging}
                      className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700 cursor-pointer"
                      title="Ping Wearable Telemetry"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${isPinging ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">Ping</span>
                    </button>

                    <a
                      href={`tel:${member.memberPhone}`}
                      className="py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition flex items-center justify-center gap-1 border border-emerald-200 dark:border-emerald-800"
                      title="Direct Device Call"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Family Members Match Filter</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Add your trusted relatives to receive instant safety alerts and coordinate during earthquakes, floods, or medical crises.
            </p>
            <button
              onClick={onOpenAddMember}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
            >
              Add Family Member
            </button>
          </div>
        )}
      </div>

      {/* Live Activity Feed Stream on Citizen Dashboard */}
      <div className="pt-2">
        <LiveDisasterFeed />
      </div>

      {/* Modal for responding to incoming location request */}
      {activeRequestModal && (
        <LocationRequestModal
          request={activeRequestModal}
          onClose={() => setActiveRequestModal(null)}
        />
      )}
    </div>
  );
};
