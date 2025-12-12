export interface TransparencySettings {
  showAmounts: boolean;
  showNames: boolean;
  showGoal: boolean;
}

export interface GiftCandidate {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  price?: number;
}

export interface Contribution {
  id: string;
  fundingId: string;
  contributorName: string;
  amount: number;
  message: string;
  isAnonymous: boolean;
  timestamp: string;
  paymentMethod: 'card' | 'account' | 'pay';
}

export type OccasionType = 'birthday' | 'wedding' | 'graduation' | 'baby' | 'housewarming' | 'retirement' | 'other';

export interface Funding {
  id: string;
  hostId: string; // User ID of the host
  hostName: string;
  title: string; // Custom title for the funding
  recipientName: string; // Name of the person receiving the gift (formerly birthdayPerson)
  occasion: OccasionType; // Type of occasion
  customOccasion?: string; // Custom occasion text if occasion is 'other'
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date string
  coverImage?: string;
  giftCandidates: GiftCandidate[];
  transparencySettings: TransparencySettings;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

export type UserType = 'user' | 'host';

export interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  createdAt: string;
}








