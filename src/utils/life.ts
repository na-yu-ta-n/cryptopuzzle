export const MAX_LIVES = 30;
export const LIFE_RECHARGE_MS = 5 * 60 * 1000; // 5分ごとに1回復
export const PUZZLE_START_COST = 1;
export const HINT_COST = 1;
export const AD_LIFE_REWARD = 5;

export function rechargedLives(lives: number, lastUpdate: number, now = Date.now()): number {
  if (lives >= MAX_LIVES) return lives;
  const elapsed = Math.max(0, now - lastUpdate);
  const gain = Math.floor(elapsed / LIFE_RECHARGE_MS);
  return Math.min(MAX_LIVES, lives + gain);
}

export function nextRechargeInMs(lives: number, lastUpdate: number, now = Date.now()): number {
  if (lives >= MAX_LIVES) return 0;
  const elapsed = now - lastUpdate;
  const remainder = elapsed % LIFE_RECHARGE_MS;
  return LIFE_RECHARGE_MS - remainder;
}

export function updatedLastLifeUpdate(
  prevLives: number,
  lastUpdate: number,
  now = Date.now(),
): number {
  if (prevLives >= MAX_LIVES) return now;
  const elapsed = now - lastUpdate;
  const gain = Math.floor(elapsed / LIFE_RECHARGE_MS);
  if (prevLives + gain >= MAX_LIVES) return now;
  return now - (elapsed % LIFE_RECHARGE_MS);
}
