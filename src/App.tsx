/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CrisisProvider, useCrisis } from './context/CrisisContext';
import { Navbar } from './components/Navbar';
import { ThemeToggle } from './components/ThemeToggle';
import { AuthPage } from './pages/AuthPage';
import { FamilySafetyDashboard } from './pages/FamilySafetyDashboard';
import { FamilySetupPage } from './pages/FamilySetupPage';
import { WearableDevicePage } from './pages/WearableDevicePage';
import { SafeShelterFinder } from './pages/SafeShelterFinder';
import { PublicAdvisoriesPage } from './pages/PublicAdvisoriesPage';
import { EmergencyContactCenter } from './pages/EmergencyContactCenter';
import { ProfilePrivacyPage } from './pages/ProfilePrivacyPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { GovLoginPage } from './pages/GovLoginPage';
import { IAmSafeModal } from './components/IAmSafeModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { HardwareEmergencyModal } from './components/HardwareEmergencyModal';
import { AutoSafeRouteModal } from './components/AutoSafeRouteModal';
import { HardwareShakeQuickBar } from './components/HardwareShakeQuickBar';
import { CitizenEmergencyAlertModal } from './components/CitizenEmergencyAlertModal';
import { ShieldAlert, Lock, Building2, ArrowRight } from 'lucide-react';
import { GovernmentOfficer } from './types';
import { getGovSession, clearGovSession, setGovSession } from './lib/govAuth';

type EOCSubTab = 'agents' | 'commander' | 'handoff_613' | 'gis_map' | 'broadcast' | 'simulator' | 'sos_queue' | 'audit_logs';

function MainAppContent() {
  const { userProfile, loading } = useAuth();
  const { 
    userActiveSOS, 
    latestEmergencyBroadcast, 
    dismissEmergencyBroadcastAlert 
  } = useCrisis();

  // Government Officer authenticated session (null if not logged in)
  const [govOfficer, setGovOfficer] = useState<GovernmentOfficer | null>(() => getGovSession());

  // URL Path & Routing State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Preview Mode flag when officer switches to Citizen view
  const [isCitizenPreviewMode, setIsCitizenPreviewMode] = useState<boolean>(false);

  // Active Citizen Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [eocSubTab, setEocSubTab] = useState<EOCSubTab>('agents');

  // Modals
  const [isSafeModalOpen, setIsSafeModalOpen] = useState<boolean>(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);
  const [triggerAddMemberModal, setTriggerAddMemberModal] = useState<boolean>(false);

  // Canonical Navigation Helper
  const navigateTo = useCallback((path: string, replace = false) => {
    if (replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }
    setCurrentPath(path);
  }, []);

  // Synchronize route & enforce route protection
  const syncRouteAndProtection = useCallback(() => {
    const rawPath = window.location.pathname || '/';
    const normalized = rawPath.toLowerCase();

    // 1. Redirect legacy/duplicate login routes to canonical /government/login
    if (
      normalized === '/gov-login' ||
      normalized === '/government-login' ||
      normalized === '/eoc-login' ||
      normalized === '/gov/eoc-login' ||
      normalized === '/gov/login'
    ) {
      navigateTo('/government/login', true);
      return;
    }

    // 2. Protected Government EOC Route Check
    if (normalized.startsWith('/government/eoc')) {
      const activeSession = getGovSession();
      if (!activeSession) {
        // Unauthenticated access attempt -> Immediately redirect to canonical /government/login
        setGovOfficer(null);
        navigateTo('/government/login', true);
        return;
      }

      // Valid session -> restore officer and extract subtab if specified
      setGovOfficer(activeSession);

      if (normalized.includes('/commander')) {
        setEocSubTab('commander');
      } else if (normalized.includes('/handoff') || normalized.includes('/613')) {
        setEocSubTab('handoff_613');
      } else if (normalized.includes('/map') || normalized.includes('/gis')) {
        setEocSubTab('gis_map');
      } else if (normalized.includes('/broadcast')) {
        setEocSubTab('broadcast');
      } else if (normalized.includes('/hardware') || normalized.includes('/simulator')) {
        setEocSubTab('simulator');
      } else if (normalized.includes('/sos') || normalized.includes('/sos_queue')) {
        setEocSubTab('sos_queue');
      } else if (normalized.includes('/audit') || normalized.includes('/audit_logs')) {
        setEocSubTab('audit_logs');
      } else {
        setEocSubTab('agents');
      }

      setCurrentPath(rawPath);
      return;
    }

    // 3. Government Login Route
    if (normalized === '/government/login') {
      setCurrentPath('/government/login');
      return;
    }

    // 4. Citizen Navigation Mapping
    if (normalized === '/family' || normalized === '/family-setup') {
      setActiveTab('family-setup');
    } else if (normalized === '/react-devices' || normalized === '/wearables') {
      setActiveTab('wearables');
    } else if (normalized === '/safe-shelters' || normalized === '/shelters') {
      setActiveTab('shelters');
    } else if (normalized === '/public-advisories' || normalized === '/advisories') {
      setActiveTab('advisories');
    } else if (normalized === '/emergency-contacts' || normalized === '/contacts') {
      setActiveTab('contacts');
    } else if (normalized === '/profile') {
      setActiveTab('profile');
    } else {
      setActiveTab('dashboard');
    }

    setCurrentPath(rawPath);
  }, [navigateTo]);

  // Listen for browser Back/Forward (popstate)
  useEffect(() => {
    syncRouteAndProtection();

    const handlePopState = () => {
      syncRouteAndProtection();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [syncRouteAndProtection]);

  // Citizen Tab Change -> update URL smoothly
  const handleCitizenTabSelect = (tab: string) => {
    setActiveTab(tab);
    let targetPath = '/';
    if (tab === 'family-setup') targetPath = '/family';
    else if (tab === 'wearables') targetPath = '/react-devices';
    else if (tab === 'shelters') targetPath = '/safe-shelters';
    else if (tab === 'advisories') targetPath = '/public-advisories';
    else if (tab === 'contacts') targetPath = '/emergency-contacts';
    else if (tab === 'profile') targetPath = '/profile';

    navigateTo(targetPath);
  };

  // Switch to Gov EOC from citizen page
  const handleGovEocButtonClick = () => {
    const activeSession = getGovSession();
    if (activeSession) {
      setGovOfficer(activeSession);
      navigateTo('/government/eoc');
    } else {
      setGovOfficer(null);
      navigateTo('/government/login');
    }
  };

  // Government Login Success Handler
  const handleGovLoginSuccess = (officer: GovernmentOfficer) => {
    setGovSession(officer);
    setGovOfficer(officer);
    navigateTo('/government/eoc');
  };

  // Government Logout Handler
  const handleGovLogout = () => {
    clearGovSession();
    setGovOfficer(null);
    setIsCitizenPreviewMode(false);
    // Replace URL to /government/login so back navigation will not re-open EOC
    navigateTo('/government/login', true);
  };

  // Switch to Citizen View (preview mode without destroying session)
  const handleSwitchToCitizenView = () => {
    setIsCitizenPreviewMode(true);
    navigateTo('/');
  };

  // EOC SubTab Change -> update route smoothly
  const handleEocSubTabChange = (tab: EOCSubTab) => {
    setEocSubTab(tab);
    let path = '/government/eoc';
    if (tab === 'commander') path = '/government/eoc/commander';
    else if (tab === 'handoff_613') path = '/government/eoc/handoff';
    else if (tab === 'gis_map') path = '/government/eoc/map';
    else if (tab === 'broadcast') path = '/government/eoc/broadcast';
    else if (tab === 'simulator') path = '/government/eoc/hardware';
    else if (tab === 'sos_queue') path = '/government/eoc/sos';
    else if (tab === 'audit_logs') path = '/government/eoc/audit';
    else path = '/government/eoc/agents';

    navigateTo(path);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center text-[#243447] space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center animate-bounce shadow-xl border border-blue-400">
          <ShieldAlert className="w-7 h-7 text-white" />
        </div>
        <div className="text-sm font-semibold text-[#005EA8]">
          Initializing CrisisChain AI Civil Protection Core...
        </div>
      </div>
    );
  }

  // =========================================================================
  // 1. CANONICAL GOVERNMENT LOGIN ROUTE (/government/login)
  // =========================================================================
  if (currentPath === '/government/login') {
    return (
      <GovLoginPage
        onLoginSuccess={handleGovLoginSuccess}
        onBackToCitizen={() => {
          setIsCitizenPreviewMode(false);
          navigateTo('/');
        }}
      />
    );
  }

  // =========================================================================
  // 2. PROTECTED GOVERNMENT EOC ROUTE (/government/eoc and /government/eoc/*)
  // =========================================================================
  if (currentPath.startsWith('/government/eoc')) {
    // Check if session is truly valid
    const session = getGovSession();
    if (!session || !govOfficer) {
      // Unauthenticated -> Fallback to login
      return (
        <GovLoginPage
          onLoginSuccess={handleGovLoginSuccess}
          onBackToCitizen={() => {
            setIsCitizenPreviewMode(false);
            navigateTo('/');
          }}
        />
      );
    }

    return (
      <CommandCenterPage
        officer={govOfficer}
        onLogout={handleGovLogout}
        onSwitchToCitizenView={handleSwitchToCitizenView}
        currentSubTab={eocSubTab}
        onSubTabChange={handleEocSubTabChange}
      />
    );
  }

  // =========================================================================
  // 3. CITIZEN APPLICATION ROUTES (Public / Citizen Safety)
  // =========================================================================

  // If no citizen profile active and not in preview mode, show citizen auth
  if (!userProfile && !isCitizenPreviewMode) {
    return (
      <div className="relative bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen transition-colors duration-250">
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={handleGovEocButtonClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#003B70] hover:bg-[#005EA8] text-white rounded-lg text-xs font-bold border border-blue-400/40 shadow-md transition-all active:scale-95"
            title="Access Government Emergency Operations Center"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-200" />
            <span>Gov EOC</span>
          </button>
        </div>
        <AuthPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white flex flex-col selection:bg-[#005EA8] selection:text-white transition-colors duration-250">
      {/* Citizen Preview Mode Banner when viewed from Government EOC */}
      {isCitizenPreviewMode && govOfficer && (
        <div className="bg-[#003B70] border-b border-[#005EA8] text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 font-mono text-[10px] font-bold border border-blue-600 uppercase tracking-wide">
              CITIZEN VIEW — PREVIEW
            </span>
            <span className="text-slate-200 text-xs">
              Officer Session Active: <strong className="text-white">{govOfficer.name}</strong> ({govOfficer.agency} • {govOfficer.securityClearance})
            </span>
          </div>
          <button
            onClick={() => {
              setIsCitizenPreviewMode(false);
              navigateTo('/government/eoc');
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold shadow transition-all active:scale-95 border border-blue-400/50"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Return to Government EOC</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleCitizenTabSelect}
        onOpenSafeModal={() => setIsSafeModalOpen(true)}
        onOpenSOSModal={() => setIsSOSModalOpen(true)}
        onSwitchToGovPortal={handleGovEocButtonClick}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <FamilySafetyDashboard
            onOpenAddMember={() => {
              setActiveTab('family-setup');
              setTriggerAddMemberModal(true);
            }}
            onOpenSafeModal={() => setIsSafeModalOpen(true)}
            onOpenSOSModal={() => setIsSOSModalOpen(true)}
            onNavigateToTab={(tab) => handleCitizenTabSelect(tab)}
          />
        )}

        {activeTab === 'family-setup' && (
          <FamilySetupPage isAddModalOpenInitially={triggerAddMemberModal} />
        )}

        {activeTab === 'wearables' && <WearableDevicePage />}

        {activeTab === 'shelters' && <SafeShelterFinder />}

        {activeTab === 'advisories' && <PublicAdvisoriesPage />}

        {activeTab === 'contacts' && <EmergencyContactCenter />}

        {activeTab === 'profile' && <ProfilePrivacyPage />}
      </main>

      {/* Government & NDMA Compliance Footer */}
      <footer className="bg-[#F7F9FB] border-t border-[#D8E1E8] py-6 text-xs text-slate-600 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#005EA8]" />
            <span className="font-bold text-[#243447]">
              CrisisChain AI • Disaster Management & Civil Protection Portal
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-600">
            <button
              onClick={handleGovEocButtonClick}
              className="text-[#005EA8] hover:text-[#003B70] font-bold flex items-center gap-1 transition-colors"
              title="Access Government Emergency Operations Center"
            >
              <Building2 className="w-3.5 h-3.5 text-[#005EA8]" />
              <span>Government Command Center</span>
            </button>
            <span>•</span>
            <span>NDMA & SDMA Interconnected</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" /> Consent-Based SAR
            </span>
            <span>•</span>
            <a href="tel:1070" className="text-[#005EA8] hover:underline font-bold">
              National Helpline: 1070
            </a>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <IAmSafeModal
        isOpen={isSafeModalOpen}
        onClose={() => setIsSafeModalOpen(false)}
      />

      <EmergencySOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
      />

      {/* Hardware Earthquake Emergency Fullscreen Alert Modal */}
      <HardwareEmergencyModal
        onOpenSafeRoute={() => handleCitizenTabSelect('shelters')}
        onNavigateToFamily={() => handleCitizenTabSelect('dashboard')}
      />

      {/* Auto-Open Safe Evacuation Route Modal */}
      <AutoSafeRouteModal
        onNavigateToFullFinder={() => handleCitizenTabSelect('shelters')}
      />

      {/* Official Government Broadcast Modal */}
      {latestEmergencyBroadcast && (
        <CitizenEmergencyAlertModal
          advisory={latestEmergencyBroadcast}
          onClose={dismissEmergencyBroadcastAlert}
          onNavigateToShelters={() => {
            dismissEmergencyBroadcastAlert();
            handleCitizenTabSelect('shelters');
          }}
          onNavigateToAdvisories={() => {
            dismissEmergencyBroadcastAlert();
            handleCitizenTabSelect('advisories');
          }}
        />
      )}

      {/* Hardware Shake Quick Bar / Sensor Simulation Tool */}
      <HardwareShakeQuickBar />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CrisisProvider>
          <MainAppContent />
        </CrisisProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
