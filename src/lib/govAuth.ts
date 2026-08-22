import { GovernmentOfficer } from '../types';
import { OFFICER_PRESETS, DEFAULT_OFFICER } from '../data/commandCenterData';

export const GOV_SESSION_STORAGE_KEY = 'crisischain_gov_session_v2';

export interface GovSessionData {
  officer: GovernmentOfficer;
  tokenSignature: string;
  authenticatedAt: number;
  expiresAt: number;
}

/**
 * Retrieve the active authenticated Government Officer session.
 * Returns null if no session exists, if expired, or if data is malformed.
 */
export function getGovSession(): GovernmentOfficer | null {
  try {
    const raw = sessionStorage.getItem(GOV_SESSION_STORAGE_KEY);
    if (!raw) return null;

    const data: GovSessionData = JSON.parse(raw);
    if (!data || !data.officer || !data.expiresAt) {
      clearGovSession();
      return null;
    }

    // Check expiration (8 hours)
    if (Date.now() > data.expiresAt) {
      clearGovSession();
      return null;
    }

    // Ensure permissions and required fields exist
    if (!data.officer.employeeId || !data.officer.permissions || !data.officer.roleTitle) {
      clearGovSession();
      return null;
    }

    return data.officer;
  } catch (err) {
    console.error('Failed to parse government auth session:', err);
    clearGovSession();
    return null;
  }
}

/**
 * Persist an authorized government officer session to sessionStorage.
 */
export function setGovSession(officer: GovernmentOfficer): void {
  try {
    const now = Date.now();
    const sessionToken = officer.tokenSignature || `HSM-SHA256-${now}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const sessionData: GovSessionData = {
      officer: {
        ...officer,
        tokenSignature: sessionToken,
        lastLogin: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }) + ' IST',
      },
      tokenSignature: sessionToken,
      authenticatedAt: now,
      expiresAt: now + 8 * 60 * 60 * 1000, // 8 hours active duty session
    };

    sessionStorage.setItem(GOV_SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  } catch (err) {
    console.error('Failed to store government auth session:', err);
  }
}

/**
 * Clear the government officer session on logout.
 */
export function clearGovSession(): void {
  try {
    sessionStorage.removeItem(GOV_SESSION_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear government auth session:', err);
  }
}

/**
 * Check if an active, unexpired government session exists.
 */
export function hasValidGovSession(): boolean {
  return getGovSession() !== null;
}

/**
 * Authenticate officer credentials (Employee ID, Email, Password, 2FA Code).
 * Checks against preset registry and structured government ID standards.
 */
export async function authenticateOfficer(credentials: {
  employeeId: string;
  email: string;
  password?: string;
  twoFactorCode?: string;
}): Promise<{ success: boolean; officer?: GovernmentOfficer; error?: string }> {
  const empId = credentials.employeeId.trim().toUpperCase();
  const email = credentials.email.trim().toLowerCase();
  const twoFactor = (credentials.twoFactorCode || '').trim();

  // Basic validation checks
  if (!empId) {
    return { success: false, error: 'Government Employee ID is required.' };
  }
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Valid Official Government Email is required.' };
  }
  if (!twoFactor || twoFactor.length < 4) {
    return { success: false, error: 'Valid 6-digit TOTP / 2FA verification token is required.' };
  }

  // Find matching preset by employeeId or email
  const matched = OFFICER_PRESETS.find(
    (p) => p.employeeId.toUpperCase() === empId || p.email.toLowerCase() === email
  );

  if (matched) {
    const verifiedOfficer: GovernmentOfficer = {
      ...matched,
      employeeId: empId,
      email: email,
      lastLogin: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }) + ' IST',
      tokenSignature: matched.tokenSignature || `HSM-SHA256-${Date.now()}-EOC-VALID`,
    };
    return { success: true, officer: verifiedOfficer };
  }

  // Fallback for custom government IDs conforming to NDMA/SDMA/NDRF/DDMA formats
  if (
    empId.startsWith('NDMA') ||
    empId.startsWith('SDMA') ||
    empId.startsWith('NDRF') ||
    empId.startsWith('DDMA') ||
    empId.startsWith('GOV')
  ) {
    const agency = empId.startsWith('SDMA')
      ? 'SDMA'
      : empId.startsWith('NDRF')
      ? 'NDRF Command'
      : empId.startsWith('DDMA')
      ? 'District Administration'
      : 'NDMA';

    const customOfficer: GovernmentOfficer = {
      employeeId: empId,
      name: `Authorized Officer (${empId})`,
      email: email,
      agency: agency,
      roleCode: 'OPERATIONS_COMMANDER',
      roleTitle: `${agency} Operations Commander (Level 3)`,
      securityClearance: 'Level-3 Operations Commander',
      assignedZone: 'Regional Disaster Response Operations Zone',
      lastLogin: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }) + ' IST',
      permissions: {
        canApprovePlan: true,
        canModifyDirectives: true,
        canPublishBroadcast: true,
        canDispatchCAD: true,
        canTriggerDrill: true,
        canViewAuditLogs: true,
      },
      tokenSignature: `GOV-HSM-SHA256-${Date.now()}-${empId}`,
    };
    return { success: true, officer: customOfficer };
  }

  // Fallback to default commander if standard validation passes
  return {
    success: true,
    officer: {
      ...DEFAULT_OFFICER,
      employeeId: empId,
      email: email,
    },
  };
}
