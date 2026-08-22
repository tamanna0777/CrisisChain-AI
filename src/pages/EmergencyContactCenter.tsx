import React, { useState } from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  HeartPulse, 
  Flame, 
  Users, 
  AlertTriangle, 
  LifeBuoy, 
  HeartHandshake, 
  Compass, 
  Plus, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { NATIONAL_EMERGENCY_CONTACTS } from '../data/emergencyData';

interface CustomContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export const EmergencyContactCenter: React.FC = () => {
  const [customContacts, setCustomContacts] = useState<CustomContact[]>(() => {
    const saved = localStorage.getItem('crisischain_custom_contacts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      { id: 'c1', name: 'Dr. Ramesh Sharma (Family Physician)', relationship: 'Doctor', phone: '+91 98450 12345' },
      { id: 'c2', name: 'Sector 4 Civil Volunteer Lead', relationship: 'Local Community SAR', phone: '+91 98110 54321' },
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRel, setNewRel] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const newEntry: CustomContact = {
      id: 'cc-' + Date.now(),
      name: newName.trim(),
      relationship: newRel.trim() || 'Emergency Contact',
      phone: newPhone.trim(),
    };

    const updated = [...customContacts, newEntry];
    setCustomContacts(updated);
    localStorage.setItem('crisischain_custom_contacts', JSON.stringify(updated));
    setNewName('');
    setNewRel('');
    setNewPhone('');
    setIsAdding(false);
  };

  const getContactIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <ShieldAlert className="w-6 h-6 text-blue-400" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-rose-400" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-amber-400" />;
      case 'Users':
        return <Users className="w-6 h-6 text-purple-400" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6 text-red-400" />;
      case 'LifeBuoy':
        return <LifeBuoy className="w-6 h-6 text-emerald-400" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-pink-400" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-teal-400" />;
      default:
        return <PhoneCall className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-hero-banner bg-gradient-to-r from-[#0E294A] to-[#143D6D] border border-[#1E4370] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Direct Hardware Dialer Integration
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#FFFFFF] hero-banner-title sm:text-3xl">
            Emergency Contacts
          </h1>
          <p className="text-xs sm:text-sm text-[#E2E8F0] hero-banner-desc mt-1 max-w-2xl">
            National disaster helplines, police, medical trauma dispatch, and dedicated civil defense rescue numbers. Tapping "Call Now" triggers your device dialer directly.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Personal Emergency Contact</span>
        </button>
      </div>

      {/* NATIONAL 24/7 HELPLINES GRID */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          Official Government Emergency Helplines
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {NATIONAL_EMERGENCY_CONTACTS.map((c) => (
            <div
              key={c.id}
              id={`card-contact-${c.id}`}
              className="bg-slate-800/90 border border-slate-700 hover:border-blue-500/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/80">
                    {getContactIcon(c.iconName)}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    Toll-Free 24/7
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-extrabold text-white text-base">{c.title}</h3>
                  <div className="text-2xl font-black text-emerald-400 font-mono tracking-wider mt-0.5">
                    {c.number}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">
                    {c.description}
                  </p>
                </div>
              </div>

              {/* Direct Device Dialer Button */}
              <a
                id={`btn-call-${c.id}`}
                href={`tel:${c.number}`}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 border border-emerald-400/40"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Now ({c.number})</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOM PERSONAL EMERGENCY CONTACTS */}
      <div className="pt-2">
        <h2 className="text-lg font-bold text-white mb-3">
          Personal Emergency Doctor & Neighborhood Contacts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customContacts.map((cust) => (
            <div
              key={cust.id}
              className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center justify-between shadow"
            >
              <div>
                <h4 className="font-bold text-white text-sm">{cust.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="px-1.5 py-0.2 rounded bg-slate-900 text-blue-300 text-[10px]">
                    {cust.relationship}
                  </span>
                  <span className="font-mono text-emerald-300">{cust.phone}</span>
                </div>
              </div>

              <a
                href={`tel:${cust.phone}`}
                className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ADD CONTACT MODAL */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Add Emergency Contact</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add your personal physician or neighborhood emergency warden.
            </p>

            <form onSubmit={handleAddCustom} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Sharma"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Role / Relationship
                </label>
                <input
                  type="text"
                  value={newRel}
                  onChange={(e) => setNewRel(e.target.value)}
                  placeholder="e.g. Cardiologist / Apartment Secretary"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
