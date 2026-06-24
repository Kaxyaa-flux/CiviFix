export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'verified' | 'in-progress' | 'resolved';
  locationName: string;
  coordinates: { x: number; y: number }; // Percentage values for SVG positioning (0-100)
  reportedAt: string;
  upvotes: number;
  reporterName: string;
  timeline: {
    status: string;
    label: string;
    date: string;
    completed: boolean;
  }[];
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
