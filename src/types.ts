export type VehicleCategory =
  | 'Sports'
  | 'Super'
  | 'Muscle'
  | 'Off-road'
  | 'Motorcycle'
  | 'SUV'
  | 'Sedan'
  | 'Utility'
  | 'Boat'
  | 'Aircraft';

export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  manufacturer: string;
  category: VehicleCategory;
  price: number;
  topSpeedMph: number;
  accelerationSec: number; // 0-60 mph estimate
  handlingScore: number; // 1-100
  brakingScore: number; // 1-100
  overallScore: number; // 1-100
  drivetrain: 'AWD' | 'RWD' | 'FWD';
  seats: number;
  locationHint: string;
  description: string;
  pros: string[];
  cons: string[];
  tags: string[];
  bestFor: ('Speed' | 'Handling' | 'Value' | 'Racing' | 'Off-road' | 'Getaway')[];
  sampleData: boolean;
  seoTitle: string;
  seoDescription: string;
}

export type MissionCategory =
  | 'Story'
  | 'Strangers & Freaks'
  | 'Heists'
  | 'Contracts'
  | 'Smuggling'
  | 'Bounties';

export interface Mission {
  id: string;
  slug: string;
  title: string;
  category: MissionCategory;
  description: string;
  protagonist: 'Lucia' | 'Jason' | 'Both' | 'Co-op';
  location: string;
  estimatedDuration: string;
  estimatedReward: string;
  objectives: string[];
  prerequisites?: string;
  sampleData: boolean;
  seoTitle: string;
  seoDescription: string;
}

export type LocationCategory =
  | 'Shops'
  | 'Safehouses'
  | 'Activities'
  | 'Points of Interest'
  | 'Vehicles'
  | 'Collectibles';

export interface LocationItem {
  id: string;
  slug: string;
  name: string;
  type: string;
  category: LocationCategory;
  district: string;
  description: string;
  whyItMatters: string;
  coordinatesHint: string;
  activities: string[];
  features: string[];
  sampleData: boolean;
  isPopular?: boolean;
}

export type GuideCategory =
  | 'Vehicles'
  | 'Money'
  | 'Missions'
  | 'Completion'
  | 'Locations'
  | 'Beginner';

export interface GuideSection {
  heading: string;
  content: string;
  body?: string;
  bulletPoints?: string[];
  callout?: {
    type: 'tip' | 'warning' | 'stat';
    text: string;
  };
}

export interface GuideToolLink {
  title: string;
  path: string;
  description: string;
  actionText: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: GuideCategory;
  readTimeMinutes: number;
  publishedDate: string;
  author: string;
  tags: string[];
  summary: string;
  quickAnswer?: string;
  fastFacts?: string[];
  sections: GuideSection[];
  recommendedTools: GuideToolLink[];
  relatedTools?: Array<{ label: string; path: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  relatedSearches: string[];
  sampleData: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface PopularSearch {
  query: string;
  path: string;
  category: 'Vehicles' | 'Money' | 'Completion' | 'Map' | 'Missions';
  description: string;
  intentBadge: string;
}

export interface TrackerItem {
  id: string;
  categoryId: string;
  title: string;
  categoryName: string;
  requirement: string;
  detail: string;
  pointsPercentage: number;
  sampleData: boolean;
}

export interface TrackerCategory {
  id: string;
  name: string;
  description: string;
  weightPercentage: number;
  items: TrackerItem[];
}

export interface FeedbackSubmission {
  pageSlug: string;
  useful: boolean;
  timestamp: number;
}
