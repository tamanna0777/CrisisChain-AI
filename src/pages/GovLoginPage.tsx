import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  UserCheck, 
  Key, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Building2,
  Zap,
  ArrowLeft,
  Shield,
  Radio,
  Truck,
  FileCheck
} from 'lucide-react';
import { GovernmentOfficer } from '../types';
import { DEFAULT_OFFICER, OFFICER_PRESETS } from '../data/commandCenterData';
import { authenticateOfficer, setGovSession } from '../lib/govAuth';
import { ThemeToggle } from '../components/ThemeToggle';

interface GovLoginPageProps {
  onLoginSuccess: (officer: GovernmentOfficer) => void;
  onBackToCitizen?: () => void;
}

export const GovLoginPage: React.FC<GovLoginPageProps> = ({
  onLoginSuccess,
  onBackToCitizen,
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [employeeId, setEmployeeId] = useState<string>(OFFICER_PRESETS[0].employeeId);
  const [officialEmail, setOfficialEmail] = useState<string>(OFFICER_PRESETS[0].email);
  const [password, setPassword] = useState<string>('••••••••••••');
  const [twoFactorCode, setTwoFactorCode] = useState<string>('482910');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    const preset = OFFICER_PRESETS[idx];
    setEmployeeId(preset.employeeId);
    setOfficialEmail(preset.email);
    setPassword('GovEncryptedPass2026!');
    setTwoFactorCode(idx === 0 ? '482910' : idx === 1 ? '990214' : idx === 2 ? '551203' : '331890');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const authResult = await authenticateOfficer({
        employeeId,
        email: officialEmail,
        password,
        twoFactorCode,
      });

      if (!authResult.success || !authResult.officer) {
        setErrorMessage(authResult.error || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
        return;
      }

      setGovSession(authResult.officer);
      setIsLoading(false);
      onLoginSuccess(authResult.officer);
    } catch (err) {
      setErrorMessage('Verification error. Command key handshake failed.');
      setIsLoading(false);
    }
  };

  const currentOfficer = OFFICER_PRESETS[selectedPresetIndex] || DEFAULT_OFFICER;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white flex flex-col justify-between selection:bg-[#005EA8] selection:text-white transition-colors duration-250">
      {/* Top Gov Verification Bar */}
      <div className="bg-[#003B70] border-b border-[#005EA8] px-4 py-2 text-xs flex items-center justify-between text-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
          <span className="font-bold text-white tracking-wide">
            NATIONAL DISASTER MANAGEMENT AUTHORITY • EMERGENCY OPERATIONS PORTAL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {onBackToCitizen && (
            <button
              onClick={onBackToCitizen}
              className="text-blue-200 hover:text-white flex items-center gap-1 font-semibold text-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Citizen Portal</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl bg-white dark:bg-[#0C223E] border-2 border-slate-200 dark:border-[#1E4575] rounded-2xl shadow-2xl overflow-hidden transition-colors">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 dark:from-[#0F2D54] dark:to-[#153B6C] p-6 text-center border-b border-blue-700/60 dark:border-[#1E4575] relative text-white">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl mb-3 border border-blue-400/50">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              CRISISCHAIN AI
            </h1>
            <p className="text-sm font-bold text-blue-200 mt-0.5">
              Government Emergency Operations Center
            </p>

            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-[11px] font-bold uppercase tracking-wider">
              <Lock className="w-3 h-3 text-red-400" />
              <span>Authorized Personnel Only • Role-Based Access Control</span>
            </div>

            <div className="text-[10px] text-blue-200/90 mt-1 font-medium">
              NDMA | SDMA | NDRF Command | District Disaster Management Authorities
            </div>
          </div>

          {/* Preset Role Quick Selector */}
          <div className="p-4 bg-slate-50 dark:bg-[#08172b] border-b border-slate-200 dark:border-[#1A3D6B]">
            <div className="text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300 tracking-wider mb-2 flex items-center justify-between">
              <span>Select Authorized Command Role:</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">DMA-2005 Compliant</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {OFFICER_PRESETS.map((preset, idx) => (
                <button
                  key={preset.employeeId}
                  type="button"
                  onClick={() => handleSelectPreset(idx)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    selectedPresetIndex === idx
                      ? 'bg-blue-50 dark:bg-blue-900/90 border-blue-500 dark:border-blue-400 text-blue-950 dark:text-white shadow'
                      : 'bg-white dark:bg-[#0b1d33] border-slate-200 dark:border-[#183a63] text-slate-700 dark:text-slate-300 hover:border-blue-400'
                  }`}
                >
                  <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {preset.agency}
                  </div>
                  <div className="text-xs font-bold truncate mt-0.5 text-slate-900 dark:text-white">
                    {preset.name.split(' ')[0]}
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                    {preset.roleTitle.split('(')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white dark:bg-[#0C223E]">
            {errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-500 rounded-lg text-red-700 dark:text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Active Role Clearance Card */}
            <div className="bg-slate-50 dark:bg-[#081526] border border-slate-200 dark:border-blue-700/60 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-slate-900 dark:text-white">{currentOfficer.name}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700 text-[10px] font-mono">
                  {currentOfficer.securityClearance}
                </span>
              </div>
              <div className="text-[11px] text-slate-700 dark:text-slate-300">
                {currentOfficer.roleTitle} — <span className="text-slate-500 dark:text-slate-400">{currentOfficer.assignedZone}</span>
              </div>
              {/* Permission Pills */}
              <div className="pt-2 border-t border-slate-200 dark:border-[#16375E] flex flex-wrap gap-1.5 text-[10px]">
                {currentOfficer.permissions.canApprovePlan && (
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-mono">
                    ✓ Tactical Plan Approval
                  </span>
                )}
                {currentOfficer.permissions.canPublishBroadcast && (
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700 font-mono">
                    ✓ Public CAP Broadcast
                  </span>
                )}
                {currentOfficer.permissions.canDispatchCAD && (
                  <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700 font-mono">
                    ✓ CAD Dispatch (Ambulance/SAR)
                  </span>
                )}
                {currentOfficer.permissions.canModifyDirectives && (
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-mono">
                    ✓ Directive Modulation
                  </span>
                )}
              </div>
            </div>

            {/* Employee ID & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Government Employee ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="e.g. NDMA-EOC-9842"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#071527] border border-slate-300 dark:border-[#1C3E6E] rounded-lg text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Official Email (.gov.in)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    placeholder="officer@ndma.gov.in"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#071527] border border-slate-300 dark:border-[#1C3E6E] rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Password & 2FA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Security Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#071527] border border-slate-300 dark:border-[#1C3E6E] rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    2FA Code (TOTP)
                  </label>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">TOKEN READY</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="6-digit code"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#071527] border border-slate-300 dark:border-[#1C3E6E] rounded-lg text-xs font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-lg shadow-lg shadow-blue-900/30 border border-blue-400/40 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isLoading ? 'Authenticating Officer Signature...' : `Authorize & Enter EOC as ${currentOfficer.name.split(' ')[0]}`}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleSelectPreset(0);
                  setIsLoading(true);
                  setTimeout(() => {
                    setGovSession(OFFICER_PRESETS[0]);
                    setIsLoading(false);
                    onLoginSuccess(OFFICER_PRESETS[0]);
                  }, 300);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-lg shadow-md border border-amber-300 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current text-slate-950" />
                <span>1-Click Full Commander Entry (Col. Rajesh Vardhan)</span>
              </button>
            </div>
          </form>

          {/* Footer Security Notice */}
          <div className="bg-slate-100 dark:bg-[#081526] p-3 text-center border-t border-slate-200 dark:border-[#18365D] text-[10px] text-slate-600 dark:text-slate-400">
            Protected by Government HSM & 256-Bit Hardware Security Modules. Section 38 DMA-2005.
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <footer className="p-4 text-center text-xs text-slate-600 border-t border-[#D8E1E8] bg-[#F7F9FB]">
        CrisisChain AI • Unified Disaster Management Command & Control System
      </footer>
    </div>
  );
};

