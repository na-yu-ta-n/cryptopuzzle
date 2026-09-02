import { monthKey } from './date';
import type { Badge, Stats } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'first-blood',
    name: 'First Step',
    description: '最初のパズルを解いた',
    icon: 'emoji-events',
    condition: (s) => s.totalSolved >= 1,
  },
  {
    id: 'streak-3',
    name: '3 Day Streak',
    description: '3日連続でパズルを解いた',
    icon: 'local-fire-department',
    condition: (s) => s.currentStreak >= 3,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: '7日連続でパズルを解いた',
    icon: 'local-fire-department',
    condition: (s) => s.currentStreak >= 7,
  },
  {
    id: 'streak-30',
    name: 'Monthly Flame',
    description: '30日連続でパズルを解いた',
    icon: 'local-fire-department',
    condition: (s) => s.currentStreak >= 30,
  },
  {
    id: 'xp-100',
    name: 'Rising Star',
    description: '累計XP 100を達成',
    icon: 'stars',
    condition: (s) => s.xp >= 100,
  },
  {
    id: 'xp-1000',
    name: 'Cryptogram Master',
    description: '累計XP 1000を達成',
    icon: 'military-tech',
    condition: (s) => s.xp >= 1000,
  },
  {
    id: 'monthly-bronze',
    name: 'Monthly Bronze',
    description: '今月10問以上解いた',
    icon: 'workspace-premium',
    condition: (s) => {
      const key = monthKey();
      return (s.monthlySolved[key] ?? 0) >= 10;
    },
  },
  {
    id: 'monthly-silver',
    name: 'Monthly Silver',
    description: '今月30問以上解いた',
    icon: 'workspace-premium',
    condition: (s) => {
      const key = monthKey();
      return (s.monthlySolved[key] ?? 0) >= 30;
    },
  },
  {
    id: 'monthly-gold',
    name: 'Monthly Gold',
    description: '今月50問以上解いた',
    icon: 'workspace-premium',
    condition: (s) => {
      const key = monthKey();
      return (s.monthlySolved[key] ?? 0) >= 50;
    },
  },
  {
    id: 'master-100',
    name: 'Centurion',
    description: '累計100問をクリア',
    icon: 'castle',
    condition: (s) => s.totalSolved >= 100,
  },
];



export function getNewBadges(stats: Stats): string[] {
  return BADGES.filter((b) => b.condition(stats) && !stats.badges.includes(b.id)).map((b) => b.id);
}

export function getBadge(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}
