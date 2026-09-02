export type Category = 'daily' | 'motivation' | 'business' | 'travel' | 'fun' | 'highschool' | 'eiken' | 'toeic' | 'grammar' | 'custom';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface VocabWord {
  en: string;
  ja: string;
}

export interface Material {
  id: string;
  en: string;
  ja: string;
  category?: Category;
  difficulty?: Difficulty;
  hint?: string;
  words?: VocabWord[];
}

export interface Unit {
  id: string;
  title: string;
  lessons: Material[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  units: Unit[];
}

export type SessionType = 'free' | 'lesson' | 'daily' | 'review';

export interface SessionInfo {
  type: SessionType;
  courseId?: string;
  unitId?: string;
}

export interface SrsItem {
  materialId: string;
  stage: number; // 0 -> due +1d, 1 -> +3d, 2 -> +7d, 3 -> mastered
  due: string; // yyyy-MM-dd
}

export interface CipherPuzzle {
  id: string;
  material: Material;
  cipherText: string;
  mapping: Record<string, string>; // original -> cipher
  reverseMapping: Record<string, string>; // cipher -> original
  usedSymbols: string[];
}

export type Guesses = Record<string, string | null>;

export interface SolvedRecord {
  materialId: string;
  date: string;
  xp: number;
  attempts: number;
}

export interface Stats {
  xp: number;
  level: number;
  totalSolved: number;
  currentStreak: number;
  longestStreak: number;
  lastSolvedDate: string | null;
  monthlySolved: Record<string, number>;
  badges: string[];
  history: SolvedRecord[];
}

export type PuzzleDifficulty = 'superEasy' | 'easy' | 'medium' | 'hard';

export interface Settings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  selectedCategory: Category | 'all';
  puzzleDifficulty: PuzzleDifficulty;
  premium: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: Stats) => boolean;
}

export type Screen = 'start' | 'play' | 'review' | 'materials' | 'stats' | 'courses';
