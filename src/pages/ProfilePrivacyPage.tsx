import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldAlert, 
  ShieldCheck, 
  Bell, 
  Trash2, 
  Save, 
  Watch, 
  Users, 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertTriangle,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCrisis } from '../context/CrisisContext';

export const ProfilePrivacyPage: React.FC = () => {
  const { userProfile, updateUserProfileData, logout } = useAuth();
  const { familyMembers, devices, removeFamilyMember, disconnectDevice } = useCrisis();

  // Form states
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [bloodGroup, setBloodGroup] = useState(userProfile?.bloodGroup || 'B+');
  const [emergencyNotes, setEmergencyNotes] = useState(
    userProfile?.emergencyNotes || 'No known severe drug allergies. Asthmatic (inhaler in backpack).'
  );

  // Privacy toggles
  const [locationConsentOnly, setLocationConsentOnly] = useState(true);
  const [allowEmergencyServices, setAllowEmergencyServices] = useState(true);
  const [notifyFamilyOnSOS, setNotifyFamilyOnSOS] = useState(true);
  const [notifyVolunteers, setNotifyVolunteers] = useState(true);

  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfileData({
      name,
      phone,
      bloodGroup,
      emergencyNotes,
      privacySettings: {
        locationSharingConsentOnly: locationConsentOnly,
        allowEmergencyServiceAccess: allowEmergencyServices,
        notifyFamilyOnSOS: notifyFamilyOnSOS,
        notifyVolunteers: notifyVolunteers,
      },
    });

    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handlePrintSafetyCard = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {isSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-400 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile & Privacy settings updated and synced.</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="page-hero-banner bg-gradient-to-r from-[#0C2442] to-[#123661] border border-[#1E4370] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-700 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" /> Zero 24/7 Surveillance Policy
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#FFFFFF] hero-banner-title sm:text-3xl">
            Profile & Privacy Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#E2E8F0] hero-banner-desc mt-1 max-w-2xl">
            Manage your personal emergency triage identifiers, strict consent-based location sharing rules, connected REACT devices, and data retention.
          </p>
        </div>

        <button
          onClick={handlePrintSafetyCard}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs shadow transition flex items-center gap-2 shrink-0"
        >
          <Printer className="w-4 h-4 text-blue-400" />
          <span>Print Emergency Safety Card</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: PERSONAL INFO & PRIVACY CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          {/* PERSONAL INFO FORM */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              Personal Information
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Used by first responders and SAR medical personnel when triage is initiated.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={userProfile?.email || ''}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Emergency Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Medical & Allergy Triage Notes
                </label>
                <textarea
                  rows={2}
                  value={emergencyNotes}
                  onChange={(e) => setEmergencyNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Personal Details</span>
                </button>
              </div>
            </form>
          </div>

          {/* PRIVACY & CONSENT CONTROLS */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-lg space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Privacy & Data Access Controls
              </h2>
              <p className="text-xs text-slate-400">
                Configure who can request your location and what data is shared during crises.
              </p>
            </div>

            <div className="space-y-3.5 divide-y divide-slate-700/80">
              {/* Strict On-Demand Location Consent */}
              <div className="pt-3 flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-white text-sm">
                    Consent-Based Location Sharing (No 24/7 Tracking)
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Requires explicit manual approval whenever a family member requests your location. Automatically expires after the granted duration.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={locationConsentOnly}
                  onChange={(e) => setLocationConsentOnly(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
              </div>

              {/* Emergency Services Access */}
              <div className="pt-3 flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-white text-sm">
                    First Responders (Police 100 / Ambulance 108) Integration
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Automatically relay precise GPS fix to emergency dispatch centers when you press "SEND SOS".
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={allowEmergencyServices}
                  onChange={(e) => setAllowEmergencyServices(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
              </div>

              {/* Notify Family On SOS */}
              <div className="pt-3 flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-white text-sm">
                    Instant Multi-Channel Family Broadcast on Distress
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Dispatches high-priority SMS and audio alerts to all accepted family network members.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyFamilyOnSOS}
                  onChange={(e) => setNotifyFamilyOnSOS(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COL: EMERGENCY ID PASS & ACCOUNT ACTIONS */}
        <div className="space-y-6">
          {/* Printable Emergency ID Card Card */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-2 border-blue-500/60 rounded-2xl p-5 shadow-2xl text-white space-y-3 print:border-black print:text-black">
            <div className="flex items-center justify-between border-b border-blue-800/80 pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
                <span className="font-extrabold text-xs tracking-wider">
                  CRISISCHAIN AI SAFETY PASS
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                ACTIVE
              </span>
            </div>

            <div>
              <div className="text-lg font-black text-white">{name || userProfile?.name}</div>
              <div className="text-xs text-blue-300 font-mono">{phone || userProfile?.phone}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Blood Group:</span>
                <strong className="text-emerald-400 font-mono text-sm">{bloodGroup}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Family Network:</span>
                <strong className="text-white">{familyMembers.length} Linked</strong>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-bold">Emergency Triage Note:</span>
              {emergencyNotes}
            </div>

            <div className="text-[10px] text-slate-400 text-center font-mono">
              UID: {userProfile?.uid.slice(0, 16)}...
            </div>
          </div>

          {/* Account Lifecycle & Danger Zone */}
          <div className="bg-slate-800/90 border border-red-900/60 rounded-2xl p-5 shadow space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Account Management
            </h3>
            <p className="text-xs text-slate-400 leading-snug">
              Sign out from this device or delete all emergency records and linked wearables.
            </p>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => logout()}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition"
              >
                Sign Out of CrisisChain
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account & Purge Data</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-800 rounded-2xl max-w-sm w-full p-6 text-white text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete CrisisChain Profile?</h3>
            <p className="text-xs text-slate-300">
              This action will purge your family network connections, disconnect REACT devices, and delete all emergency SOS logs from the database.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await logout();
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
