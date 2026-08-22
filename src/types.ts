export type UserRole = 'citizen' | 'emergency_responder' | 'administrator';

export type AccountStatus = 'active' | 'pending_verification' | 'suspended';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  createdDate: string;
  accountStatus: AccountStatus;
  bloodGroup?: string;
  emergencyNotes?: string;
  status?: 'Safe' | 'Not Recently Updated' | 'SOS Active' | 'Missing';
  lastCheckIn?: string;
  privacySettings?: {
    locationSharingConsentOnly: boolean;
    allowEmergencyServiceAccess: boolean;
    notifyFamilyOnSOS: boolean;
    notifyVolunteers: boolean;
  };
}

export type RelationshipType =
  | 'Mother'
  | 'Father'
  | 'Brother'
  | 'Sister'
  | 'Son'
  | 'Daughter'
  | 'Husband'
  | 'Wife'
  | 'Grandparent'
  | 'Other';

export type InvitationStatus = 'Pending' | 'Accepted' | 'Rejected';

export type MemberSafetyStatus = 'Safe' | 'Not Recently Updated' | 'SOS Active' | 'Missing';

export interface FamilyMemberRecord {
  id: string;
  userId: string; // The user who sent the invite / owns the slot
  inviterName: string;
  inviterEmail: string;
  inviterPhone?: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  relationship: RelationshipType;
  status: InvitationStatus;
  safetyStatus: MemberSafetyStatus;
  lastCheckIn: string;
  invitedAt: string;
  acceptedAt?: string;
  avatarUrl?: string;
  batteryLevel?: number; // 0-100%
  signalStrength?: string; // e.g. "-64 dBm" or "5G / Mesh"
  connectionStatus?: 'ONLINE' | 'STANDBY' | 'MESH_ACTIVE' | 'OFFLINE';
  lastUpdateFormatted?: string;
}

export type LocationShareDuration = 'once' | '30m' | '1h' | 'declined';

export interface LocationRequestRecord {
  id: string;
  requesterId: string;
  requesterName: string;
  targetMemberEmail: string;
  targetMemberPhone: string;
  targetMemberName: string;
  status: 'pending' | 'approved' | 'declined' | 'expired';
  duration?: LocationShareDuration;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  address?: string;
  requestedAt: string;
  expiresAt?: string;
}

export interface WearableDeviceRecord {
  id: string;
  userId: string;
  userName: string;
  deviceName: string;
  serialNumber: string;
  model: string;
  batteryStatus: number; // 0-100%
  lastSync: string;
  connectionDate: string;
  status: 'Connected' | 'Disconnected' | 'Syncing' | 'Low Battery';
  hardwareVersion?: string;
  macAddress?: string;
  rssi?: number;
  heartRate?: number;
  spo2?: number;
  motionStatus?: 'Normal' | 'Impact Detected' | 'Stationary';
  acceleration?: { x: number; y: number; z: number };
}

export interface CatalogDevice {
  serialNumber: string;
  deviceName: string;
  model: string;
  defaultBattery: number;
  firmware: string;
}

export type EmergencyType =
  | 'Medical Emergency'
  | 'Earthquake'
  | 'Flood'
  | 'Fire'
  | 'Accident'
  | 'Trapped'
  | 'Missing Person'
  | 'Other';

export interface EmergencyAlertRecord {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  emergencyType: EmergencyType;
  shareWithFamily: boolean;
  shareWithEmergencyServices: boolean;
  shareWithVolunteers: boolean;
  locationMode: 'Current Location' | 'Live Location For 30 Minutes' | 'Live Location For 1 Hour';
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  timestamp: string;
  status: 'ACTIVE_DISTRESS' | 'RESPONDERS_DISPATCHED' | 'RESOLVED';
  resolvedAt?: string;
  notes?: string;
}

export interface SafeShelter {
  id: string;
  name: string;
  type: 'Cyclone Shelter' | 'Flood Evacuation Center' | 'Earthquake Safe Ground' | 'Civil Defense Base' | 'Medical Relief Post';
  latitude: number;
  longitude: number;
  address: string;
  capacity: number;
  availability: number;
  contactNumber: string;
  status: 'Open 24/7' | 'Accepting Evacuees' | 'Near Capacity';
  amenities: string[];
  distanceKm?: number;
}

export type AdvisorySeverity = 'CRITICAL' | 'SEVERE' | 'MODERATE' | 'ADVISORY';

export interface PublicAdvisory {
  id: string;
  title: string;
  category: 'Earthquake Alerts' | 'Flood Alerts' | 'Weather Warnings' | 'Government Notifications' | 'Evacuation Notices';
  severity: AdvisorySeverity;
  source: string;
  time: string;
  description: string;
  instructions: string[];
  affectedZones?: string[];
}

export interface EmergencyContact {
  id: string;
  title: string;
  number: string;
  description: string;
  department: string;
  isNational: boolean;
  iconName: string;
}

export type OfficerRoleCode =
  | 'OPERATIONS_COMMANDER'
  | 'INCIDENT_DIRECTOR'
  | 'LOGISTICS_LIAISON'
  | 'PUBLIC_INFO_OFFICER';

export interface OfficerPermissions {
  canApprovePlan: boolean;
  canModifyDirectives: boolean;
  canPublishBroadcast: boolean;
  canDispatchCAD: boolean;
  canTriggerDrill: boolean;
  canViewAuditLogs: boolean;
}

export interface GovernmentOfficer {
  employeeId: string;
  name: string;
  email: string;
  agency: 'NDMA' | 'SDMA' | 'District Administration' | 'NDRF Command';
  roleCode: OfficerRoleCode;
  roleTitle: string;
  securityClearance: 'Level-2 Field Officer' | 'Level-3 Operations Commander' | 'Level-4 Senior Director';
  assignedZone: string;
  lastLogin: string;
  permissions: OfficerPermissions;
  tokenSignature?: string;
}

export interface BroadcastAuditRecord {
  id: string;
  timestamp: string;
  officerId: string;
  officerName: string;
  agency: string;
  roleTitle: string;
  actionType: 'PLAN_APPROVED' | 'PLAN_MODIFIED' | 'DIRECTIVE_ENABLED' | 'BROADCAST_DISPATCHED' | 'CAD_UNIT_DISPATCHED' | 'DRILL_EXECUTED';
  advisoryTitle?: string;
  channelsDispatched?: string[];
  affectedZones?: string[];
  citizenReachCount: number;
  sha256Signature: string;
  notes?: string;
}

export type AgentId = 
  | 'seismic' 
  | 'population' 
  | 'hospital' 
  | 'shelter' 
  | 'route' 
  | 'logistics' 
  | 'negotiation';

export interface AgentCardData {
  id: AgentId;
  name: string;
  shortRole: string;
  status: 'ACTIVE' | 'PROCESSING' | 'ALERT' | 'STANDBY';
  confidence: number;
  lastUpdated: string;
  iconName: string;
  primaryMetric: { label: string; value: string; unit?: string; alert?: boolean };
  details: { label: string; value: string; badge?: string; badgeColor?: string }[];
  summaryRecommendation: string;
  connectedHardware: string[];
}

export interface NegotiationConflictRecord {
  id: string;
  agentsInvolved: string[];
  conflictDescription: string;
  proposedActionA: string;
  proposedActionB: string;
  negotiationOutcome: string;
  rationale: string;
  resolvedAt: string;
}

export interface CommanderActionPlan {
  id: string;
  eventId: string;
  timestamp: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'MODIFIED' | 'REJECTED' | 'BROADCASTED';
  overallConfidence: number;
  eventSummary: {
    disasterType: string;
    magnitudeOrSeverity: string;
    epicenterOrLocation: string;
    impactRadiusKm: number;
    estimatedAffectedPop: number;
  };
  tacticalDirectives: {
    id: string;
    category: 'EVACUATION' | 'MEDICAL' | 'LOGISTICS' | 'SHELTER' | 'ROUTES';
    title: string;
    action: string;
    targetZone: string;
    assignedUnits: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    enabled: boolean;
  }[];
  commanderNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
  broadcastDispatched?: boolean;
}

export interface HardwareSensorEvent {
  sensorId: string;
  sensorType: 'ACCELEROMETER_3AXIS' | 'WATER_LEVEL_ULTRASONIC' | 'INFRARED_HEAT' | 'BRIDGE_STRAIN';
  location: string;
  readingValue: string;
  thresholdExceeded: boolean;
  timestamp: string;
}

export interface HardwareEarthquakeEvent {
  id: string;
  event: string;
  deviceId: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  location: string;
  timestamp: string;
  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;
  totalAcceleration?: number;
  magnitude: number;
  severityScore?: number;
  confidenceScore?: number;
  isRealHardware?: boolean;
  status: string;
  recommendedActions: string[];
  userCoordinates?: {
    latitude: number;
    longitude: number;
  };
  nearestShelter?: {
    name: string;
    distance: string;
    type: string;
    capacity: number;
    available: number;
  };
  nearestHospital?: {
    name: string;
    distance: string;
    icuBeds: number;
    phone: string;
  };
  nearestOpenArea?: {
    name: string;
    distance: string;
    description: string;
  };
  safeRoute: {
    destination: string;
    distance: string;
    duration: string;
    shelterType: string;
    shelterCapacity: number;
    shelterAvailable: number;
    nearestHospital?: {
      name: string;
      distance: string;
      icuBeds?: number;
      phone?: string;
      address?: string;
    };
    nearestOpenArea?: {
      name: string;
      distance: string;
      description?: string;
      address?: string;
    };
  };
}

export interface HardwareLiveSensorAlert {
  id: string;
  deviceId: string;
  location: string;
  time: string;
  status: string;
  event: string;
  magnitude: number;
  severity: string;
  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;
  totalAcceleration?: number;
  severityScore?: number;
  confidenceScore?: number;
  isRealHardware?: boolean;
}

export interface AIConfidenceBreakdown {
  sensorData: number;    // e.g. 95
  hospitalData: number;  // e.g. 90
  routeData: number;     // e.g. 88
  shelterData: number;   // e.g. 92
  overall: number;       // e.g. 91
}

export interface AIConfidenceAnalysisData {
  recommendation: string;
  confidenceScore: number;
  confidenceLevel: 'Low' | 'Medium' | 'High';
  evidence: string[];
  dataReliability: 'LOW' | 'MEDIUM' | 'HIGH';
  breakdown: AIConfidenceBreakdown;
}

export interface IncidentTimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  status: 'COMPLETED' | 'LIVE' | 'IN_PROGRESS' | 'SCHEDULED' | 'PENDING';
  category?: 'DETECTION' | 'AI_ANALYSIS' | 'PLAN' | 'ALERT' | 'LOGISTICS' | 'HANDOFF' | 'APPROVAL';
  icon?: string;
}

export interface HandoffNoteData {
  id: string;
  incidentType: string;
  location: string;
  severity: 'Critical' | 'Severe' | 'Moderate' | 'Low';
  currentStatus: string;
  aiConfidence: number;
  completedActions: string[];
  pendingActions: string[];
  recommendedNextStep: string;
  generatedTimestamp: string;
  generatedByOfficer: string;
  transferredToOfficer?: string;
  transferRole?: string;
  transferNotes?: string;
  transferTimestamp?: string;
}

export interface ShiftTransferPayload {
  toOfficerName: string;
  toOfficerRole: string;
  notes?: string;
}

