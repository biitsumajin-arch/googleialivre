export interface TokaidoStation {
  id: string;
  name: string;
  japaneseName: string;
  stageNumber: number | string; // e.g. "Km 0", 1, 10, "Hors-route"
  category: 'departure' | 'edo_sanctuary' | 'tokaido_post' | 'shogun_legacy' | 'western_extension';
  coordinates: { x: number; y: number }; // SVG Map % coordinates
  modernLocation: string;
  historicalContext: string;
  modernContext: string;
  quote?: string;
  isWritten: boolean;
  elevation?: string;
  distanceFromEdo?: string;
  ukiyoEImage: {
    title: string;
    artist: string;
    period: string;
    imageUrl: string;
    description: string;
  };
}

export interface ChapterTeaser {
  number: number;
  title: string;
  japaneseSubtitle: string;
  location: string;
  wordCount: number;
  teaser: string;
  keyThemes: string[];
  fullExcerpt?: string[];
  epigraph?: string;
}

export interface PhilosophicalPillar {
  id: string;
  number: string;
  kanji: string;
  title: string;
  subtitle: string;
  summary: string;
  detailedReflection: string;
  quote: string;
  associatedConcept: string;
}

export interface EditorialInquiry {
  publisherName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  inquiryType: 'manuscript_request' | 'synopsis_pitch' | 'rights_adaptation' | 'direct_exchange';
  message: string;
  confidentialityAccepted: boolean;
}

export interface ManuscriptStats {
  totalWords: number;
  chapterCount: number;
  hasEpilogue: boolean;
  tokaidoStationsCovered: number;
  historicalPeriod: string;
  mainCharacters: {
    name: string;
    role: string;
    description: string;
  }[];
}

export type UserRole = 'reader' | 'admin';

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url?: string | null;
  role: UserRole;
  saved_stations?: string[];
  bookmarked_chapters?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  session: any | null;
  loading: boolean;
  isConfigured: boolean;
}

// Japanese Glossary Term Interface
export interface GlossaryTerm {
  term: string;
  kanji: string;
  romaji: string;
  translation: string;
  explanation: string;
  historicalContext: string;
  category: 'institutions' | 'philosophy' | 'everyday_life' | 'geography';
}

// Chapter Review Interface
export interface ChapterReview {
  id: string;
  chapter_number: number;
  user_id: string;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
  updated_at?: string;
  author_name?: string;
  author_role?: UserRole;
}

// Hanafuda Card Proposal Interface
export type ProposalStatus = 'pending' | 'approved' | 'rejected';

export interface HanafudaCard {
  id: string;
  user_id?: string;
  chapter_number: number;
  card_title: string;
  kanji: string;
  symbol: string;
  description: string;
  image_url: string;
  status: ProposalStatus;
  moderation_notes?: string | null;
  created_at?: string;
  author_name?: string;
  isOfficial?: boolean;
}
