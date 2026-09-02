import { format, subDays } from 'date-fns';
import { today, monthKey } from './date';
import type { Stats } from '../types';

export function updateStreak(stats: Stats): Stats {
  const todayStr = today();
  let current = stats.currentStreak;
  if (stats.lastSolvedDate === todayStr) {
    // already counted today
  } else if (stats.lastSolvedDate === getYesterday(todayStr)) {
    current += 1;
  } else {
    current = 1;
  }
  const monthly = { ...stats.monthlySolved };
  monthly[monthKey()] = (monthly[monthKey()] ?? 0) + 1;
  return {
    ...stats,
    currentStreak: current,
    longestStreak: Math.max(current, stats.longestStreak),
    lastSolvedDate: todayStr,
    monthlySolved: monthly,
  };
}

function getYesterday(todayStr: string): string {
  const d = new Date(todayStr + 'T00:00:00');
  return format(subDays(d, 1), 'yyyy-MM-dd');
}
