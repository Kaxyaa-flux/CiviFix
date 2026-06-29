// ─── Core domain types ──────────────────────────────────────────────────────

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'verified' | 'in-progress' | 'resolved';
  locationName: string;
  coordinates: { lat: number; lng: number };
  reportedAt: string;
  upvotes: number;
  reporterName: string;
  timeline: TimelineEntry[];
  imageUrls?: string[];
}

export interface TimelineEntry {
  status: string;
  label: string;
  date: string;
  completed: boolean;
  details?: string;
}

export interface CommunityHero {
  id: string;
  name: string;
  rank: number;
  points: number;
  avatar: string;
  resolvedCount: number;
  badges: string[];
}

export interface Activity {
  id: string;
  type: 'report' | 'verification' | 'resolution' | 'upvote';
  title: string;
  user: string;
  time: string;
  details?: string;
}

export interface CivicStats {
  issuesReported: number;
  issuesResolved: number;
  activeVolunteers: number;
  impactScore: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar: string; // URL or preset identifier
  role: 'citizen' | 'moderator' | 'admin';
  reputationPoints: number;
  joinedAt: string;
}

// ─── IssueTracker types ─────────────────────────────────────────────────────

export type MediaPlaceholder =
  | 'water_hydrant_spurt'
  | 'deep_road_crater'
  | 'drooping_power_lines'
  | 'woodland_garbage_dump'
  | 'shattered_school_beacon'
  | 'general_hazard';

/** Full issue record used by IssueTracker — adds tracker-only fields. */
export interface TrackedIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'verified' | 'in-progress' | 'resolved' | 'escalated';
  locationName: string;
  reportedAt: string;
  reporterName: string;
  upvotes: number;
  aiVerificationPercentage: number;
  resolutionTimeHours?: number;
  mediaPlaceholder: MediaPlaceholder;
  imageUrls?: string[];
  timeline: TimelineEntry[];
}

// ─── VerificationCenter types ───────────────────────────────────────────────

/** Issue pending community peer-review in the Verification Center. */
export interface UnverifiedIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  locationName: string;
  reportedAt: string;
  reporterName: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  mediaType: 'image' | 'video';
  mediaPlaceholder: string;
  peerVotesAgree: number;
  peerVotesDisagree: number;
  userVoted?: 'agree' | 'disagree';
}

/** Result from the AI forensic verification scan endpoint. */
export interface AIScanResult {
  duplicateStatus: string;
  duplicateSimilarity: number;
  duplicateReasoning: string;
  authenticityScore: number;
  authenticityDetails: string;
  fraudRisk: string;
  fraudProbability: number;
  fraudDetails: string;
  verificationPercentage: number;
}

// ─── AuthorityDashboard types ────────────────────────────────────────────────

/** An issue assigned to an authority crew for resolution. */
export interface AssignedIssue {
  id: string;
  title: string;
  category: 'Roads' | 'Water' | 'Electricity' | 'Sanitation' | 'Safety';
  location: string;
  reportedAt: string;
  slaLimitHours: number;
  slaRemainingHours: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'assigned' | 'investigating' | 'dispatching' | 'resolving' | 'resolved';
  assignedCrew: string;
  allocatedVehicles: string[];
  reportedBy: string;
  upvotes: number;
  historyLogs: { timestamp: string; action: string; actor: string }[];
}

/** A field crew managed by the Authority Dashboard. */
export interface AuthorityCrew {
  id: string;
  name: string;
  specialty: 'Hydraulics' | 'Structural engineering' | 'Grid systems' | 'Refuse logistics' | 'Public security';
  status: 'idle' | 'en-route' | 'active' | 'on-break';
  efficiencyRating: number;
  activeJobId: string | null;
}
