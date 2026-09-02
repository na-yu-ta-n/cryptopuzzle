import { addDays, format } from 'date-fns';
import { today } from './date';
import type { SrsItem } from '../types';

// 忘却曲線に基づく復習間隔（日数）: stage 0→1日後, 1→3日後, 2→7日後, 3以降は卒業
export const SRS_INTERVALS = [1, 3, 7];
export const SRS_MASTERED_STAGE = SRS_INTERVALS.length;

export function scheduleFirstReview(materialId: string): SrsItem {
  return { materialId, stage: 0, due: format(addDays(new Date(), SRS_INTERVALS[0]), 'yyyy-MM-dd') };
}

export function advanceSrs(item: SrsItem): SrsItem {
  const nextStage = item.stage + 1;
  if (nextStage >= SRS_MASTERED_STAGE) {
    return { ...item, stage: SRS_MASTERED_STAGE, due: '' };
  }
  return { ...item, stage: nextStage, due: format(addDays(new Date(), SRS_INTERVALS[nextStage]), 'yyyy-MM-dd') };
}

export function isDue(item: SrsItem): boolean {
  return item.stage < SRS_MASTERED_STAGE && item.due !== '' && item.due <= today();
}

export function getDueItems(srs: Record<string, SrsItem>): SrsItem[] {
  return Object.values(srs).filter(isDue).sort((a, b) => a.due.localeCompare(b.due));
}

// 日付シードで全ユーザー共通のデイリー問題を選ぶ
export function dailyIndex(dateStr: string, poolSize: number): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  return poolSize > 0 ? hash % poolSize : 0;
}
