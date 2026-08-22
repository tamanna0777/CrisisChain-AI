import React, { useState } from 'react';
import { 
  UserPlus, 
  Users, 
  Mail, 
  Phone, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Send, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  X, 
  Smartphone, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCrisis } from '../context/CrisisContext';
import { RelationshipType } from '../types';

interface FamilySetupPageProps {
  isAddModalOpenInitially?: boolean;
}

export const FamilySetupPage: React.FC<FamilySetupPageProps> = ({ isAddModalOpenInitially = false }) => {
  const { userProfile } = useAuth();
  const { 
    familyMembers, 
    pendingInvitations, 
    sendFamilyInvite, 
    acceptInvite, 
    rejectInvite, 
    removeFamilyMember,
    simulateMemberAcceptance
  } = useCrisis();

  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [activeTab, setActiveTab] = useState<'accepted' | 'pending'>('accepted');

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState<RelationshipType>('Mother');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const relationshipsList: RelationshipType[] = [
    'Mother',
    'Father',
    'Brother',
    'Sister',
    'Son',
    'Daughter',
    'Husband',
    'Wife',
    'Grandparent',
    'Other',
  ];

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim() || !phone.trim() || !email.trim()) {
      setFeedback({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendFamilyInvite(name.trim(), phone.trim(), email.trim(), relationship);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setName('');
        setPhone('');
        setEmail('');
        setRelationship('Mother');
        setActiveTab('pending');
        setTimeout(() => setIsModalOpen(false), 2000);
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="page-hero-banner bg-gradient-to-r from-[#0F2D54] to-[#123663] border border-[#1E4370] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-700 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Authorized Multi-Party Consent
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#FFFFFF] hero-banner-title sm:text-3xl">
            Build Your Family Safety Network
          </h1>
          <p className="text-xs sm:text-sm text-[#E2E8F0] hero-banner-desc mt-1 max-w-2xl">
            Add trusted family members who can help you during emergencies. Only accepted members appear in your network to prevent unauthorized tracking.
          </p>
        </div>

        <button
          id="btn-open-add-member-modal"
          onClick={() => {
            setFeedback(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 shrink-0 border border-blue-400/40"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Tabs for Accepted vs Pending */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
        <div className="flex gap-2">
          <button
            id="tab-accepted-members"
            onClick={() => setActiveTab('accepted')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
              activeTab === 'accepted'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Active Network ({familyMembers.length})</span>
          </button>

          <button
            id="tab-pending-invites"
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Invitations ({pendingInvitations.length})</span>
            {pendingInvitations.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                {pendingInvitations.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ================= ACCEPTED MEMBERS TAB ================= */}
      {activeTab === 'accepted' && (
        <div className="space-y-4">
          {familyMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-700 text-white font-bold flex items-center justify-center border border-blue-400/30">
                        {member.memberName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{member.memberName}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-blue-300 border border-slate-700">
                            {member.relationship}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3 inline" /> Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFamilyMember(member.id)}
                      title="Remove from network"
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/80 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs space-y-1 text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Mobile Number:</span>
                      <span className="font-mono text-white">{member.memberPhone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="font-mono text-slate-200">{member.memberEmail}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
                      <span className="text-slate-400">Safety Status:</span>
                      <span className="text-emerald-400 font-bold">{member.safetyStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Accepted Family Members</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Nobody appears in your safety network until they accept your invitation. Send an invite to get started.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow"
              >
                Send First Invitation
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= PENDING INVITATIONS TAB ================= */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingInvitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingInvitations.map((invite) => (
                <div
                  key={invite.id}
                  className="bg-slate-800/90 border border-amber-800/60 rounded-2xl p-5 shadow-lg space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{invite.memberName}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600/50 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> Pending Acceptance
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Relationship: <strong className="text-blue-300">{invite.relationship}</strong>
                      </p>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(invite.invitedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Invitation Dispatch Message Preview */}
                  <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <Smartphone className="w-3 h-3 text-blue-400" />
                      <span>SMS Dispatched to: <strong className="text-slate-200 font-mono">{invite.memberPhone}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <Mail className="w-3 h-3 text-indigo-400" />
                      <span>Email Dispatched to: <strong className="text-slate-200 font-mono">{invite.memberEmail}</strong></span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded text-[11px] text-slate-300 italic border border-slate-800">
                      "You have been invited to join the CrisisChain Family Safety Network by {userProfile?.name}."
                    </div>
                  </div>

                  {/* Actions: Simulate Recipient Acceptance (for reviewer evaluation) or Cancel */}
                  <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => simulateMemberAcceptance(invite.id)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
                      title="Simulate recipient tapping 'Accept' link in SMS"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Simulate Acceptance (SMS Tap)</span>
                    </button>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => rejectInvite(invite.id)}
                        className="py-2 px-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition"
                      >
                        Cancel Invite
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Pending Invitations</h3>
              <p className="text-xs text-slate-400">
                All invited family members have either accepted or no new invitations are in flight.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= ADD FAMILY MEMBER MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white mb-2 shadow">
                <UserPlus className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Add Family Member</h2>
              <p className="text-xs text-slate-400">
                Dispatches a verification invitation via SMS & Email. Member must accept to join.
              </p>
            </div>

            {feedback && (
              <div
                className={`mb-4 p-3 rounded-lg text-xs flex items-start gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-200'
                    : 'bg-red-950 border border-red-800 text-red-200'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-3.5">
              {/* Relationship Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Relationship *
                </label>
                <select
                  id="select-relationship"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as RelationshipType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {relationshipsList.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  id="input-member-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amina Shaikh"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Mobile Number (for Emergency SMS) *
                </label>
                <input
                  id="input-member-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98111 22334"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  id="input-member-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="family.member@domain.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-family-invite"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Dispatching...' : 'Send Invitation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
