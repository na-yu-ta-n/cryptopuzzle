import type { Category, PuzzleDifficulty } from '../types';

export const CATEGORY_LABELS: Record<Category | 'all', string> = {
  all: 'すべて',
  daily: '日常',
  motivation: 'やる気',
  business: 'ビジネス',
  travel: '旅行',
  fun: '楽しい',
  highschool: '高校生向け',
  eiken: '英検対策',
  toeic: 'TOEIC対策',
  grammar: '英文法',
  custom: 'カスタム',
};

export const CATEGORY_OPTIONS: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: CATEGORY_LABELS.all },
  { value: 'daily', label: CATEGORY_LABELS.daily },
  { value: 'motivation', label: CATEGORY_LABELS.motivation },
  { value: 'business', label: CATEGORY_LABELS.business },
  { value: 'travel', label: CATEGORY_LABELS.travel },
  { value: 'fun', label: CATEGORY_LABELS.fun },
  { value: 'highschool', label: CATEGORY_LABELS.highschool },
  { value: 'eiken', label: CATEGORY_LABELS.eiken },
  { value: 'toeic', label: CATEGORY_LABELS.toeic },
  { value: 'grammar', label: CATEGORY_LABELS.grammar },
];

export const PUZZLE_DIFFICULTY_LABELS: Record<PuzzleDifficulty, string> = {
  superEasy: '超かんたん',
  easy: 'かんたん',
  medium: 'ふつう',
  hard: 'むずかしい',
};

export const PUZZLE_DIFFICULTY_COLORS: Record<PuzzleDifficulty, 'success' | 'info' | 'error'> = {
  superEasy: 'success',
  easy: 'success',
  medium: 'info',
  hard: 'error',
};
