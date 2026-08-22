import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  UserPlus, 
  Watch, 
  MapPin, 
  Radio, 
  PhoneCall, 
  UserCheck, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Menu, 
  X, 
  CheckCircle2, 
  LogOut,
  BellRing,
  Building2,
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCrisis } from '../context/CrisisContext';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSOSModal: () => void;
  onOpenSafeModal: () => void;
  onSwitchToGovPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSOSModal,
  onOpenSafeModal,
  onSwitchToGovPortal,
}) => {
  const { userProfile, logout } = useAuth();
  const { 
    isSirenPlaying, 
    toggleSirenAudio, 
    userActiveSOS, 
    incomingLocationRequests, 
    pendingInvitations 
  } = useCrisis();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Safety Dashboard', icon: Users },
    { id: 'family-setup', label: 'Family Setup', icon: UserPlus, badge: pendingInvitations.length > 0 ? pendingInvitations.length : undefined },
    { id: 'wearables', label: 'REACT Devices', icon: Watch },
    { id: 'shelters', label: 'Safe Shelters', icon: MapPin },
    { id: 'advisories', label: 'Public Advisories', icon: Radio },
    { id: 'contacts', label: 'Emergency Contacts', icon: PhoneCall },
    { id: 'profile', label: 'Profile & Privacy', icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F294A] border-b border-[#1E3E66] text-white shadow-lg">
      {/* Top emergency broadcast ticker if SOS is active */}
      {userActiveSOS && (
        <div className="bg-red-600 text-white px-4 py-2 text-xs md:text-sm font-semibold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>
              EMERGENCY SOS ACTIVE: {userActiveSOS.emergencyType.toUpperCase()} ALERT BROADCASTED TO FAMILY & FIRST RESPONDERS
            </span>
          </div>
          <button
            onClick={() => toggleSirenAudio()}
            className="flex items-center gap-1.5 px-2.5 py-0.5 bg-red-800 hover:bg-red-900 rounded text-xs font-mono uppercase tracking-wider"
          >
            {isSirenPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            {isSirenPlaying ? 'Mute Siren' : 'Play Siren'}
          </button>
        </div>
      )}

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 shadow-md border border-blue-300/30">
              <ShieldAlert className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
                  CrisisChain <span className="text-emerald-400 font-extrabold text-sm px-1.5 py-0.5 bg-emerald-950/80 rounded border border-emerald-500/40">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700/60">
                  Gov-Grade SAR
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80 hidden md:block leading-none">
                Disaster Management & Civil Protection Platform
              </p>
            </div>
          </div>

          {/* Quick Action Emergency Buttons (I AM SAFE & SEND SOS) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Siren Toggle for manual drill */}
            <button
              onClick={() => toggleSirenAudio()}
              title={isSirenPlaying ? 'Stop Emergency Siren' : 'Sound Test Emergency Siren'}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                isSirenPlaying
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                  : 'bg-[#15345B] hover:bg-[#1C4374] text-blue-200 border-[#2A5285]'
              }`}
            >
              {isSirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden lg:inline">{isSirenPlaying ? 'Siren ON' : 'Audio Alarm'}</span>
            </button>

            {/* "I AM SAFE" Button */}
            <button
              id="btn-i-am-safe-nav"
              onClick={onOpenSafeModal}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-emerald-700/30 transition-all active:scale-95 border border-emerald-400/40"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I AM SAFE</span>
            </button>

            {/* "SEND SOS" Button */}
            <button
              id="btn-send-sos-nav"
              onClick={onOpenSOSModal}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-red-700/40 transition-all active:scale-95 border border-red-400/50 animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SEND SOS</span>
            </button>

            {/* Gov EOC Portal Entry Button */}
            {onSwitchToGovPortal && (
              <button
                id="btn-gov-eoc-nav"
                onClick={onSwitchToGovPortal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0E294B] hover:bg-[#153C6D] text-indigo-200 hover:text-white font-bold text-xs border border-indigo-500/40 shadow-sm transition-all active:scale-95"
                title="Open Government Emergency Operations Center"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Gov EOC</span>
              </button>
            )}

            {/* Dark / Light Theme Toggle (Always Visible) */}
            <ThemeToggle className="ml-0.5" />

            {/* User status & Logout */}
            <div className="hidden xl:flex items-center pl-2 border-l border-[#224775] gap-2">
              <div className="text-right">
                <div className="text-xs font-semibold text-white leading-tight">
                  {userProfile?.name || 'Citizen'}
                </div>
                <div className="text-[10px] text-emerald-300 flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  {userProfile?.status || 'Safe'}
                </div>
              </div>
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="p-1.5 text-blue-300 hover:text-white hover:bg-[#1E4577] rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-blue-200 hover:text-white hover:bg-[#1A3F6D]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-1 border-t border-[#1C3E67] py-1.5 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors relative ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-inner'
                    : 'text-blue-200 hover:text-white hover:bg-[#1A3E6B]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
                {item.id === 'dashboard' && incomingLocationRequests.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500 text-white animate-pulse">
                    <BellRing className="w-2.5 h-2.5 inline" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0C223E] border-t border-[#1C3E67] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-[#16365F]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          {onSwitchToGovPortal && (
            <button
              onClick={() => {
                onSwitchToGovPortal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-bold bg-[#0D284B] border border-indigo-500/40 text-indigo-200"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Government EOC Operations</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-900 text-blue-200">
                NDMA
              </span>
            </button>
          )}
          <div className="py-2 flex items-center justify-between border-t border-[#1C3E67]">
            <span className="text-xs text-slate-300 font-semibold">Theme Mode:</span>
            <ThemeToggle />
          </div>
          <div className="pt-2 border-t border-[#1C3E67] flex items-center justify-between text-xs text-blue-200">
            <span>Signed in as <strong>{userProfile?.name}</strong></span>
            <button onClick={() => logout()} className="text-red-400 font-semibold flex items-center gap-1">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
