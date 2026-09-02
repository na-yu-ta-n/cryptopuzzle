import type { CipherPuzzle, Guesses, Settings } from '../types';

export function findNextSymbol(puzzle: CipherPuzzle, guesses: Guesses, current: string): string {
  const idx = puzzle.usedSymbols.indexOf(current);
  for (let i = 1; i <= puzzle.usedSymbols.length; i++) {
    const next = puzzle.usedSymbols[(idx + i) % puzzle.usedSymbols.length];
    if (!guesses[next]) return next;
  }
  return puzzle.usedSymbols[(idx + 1) % puzzle.usedSymbols.length];
}

export function isPuzzleComplete(guesses: Guesses, puzzle: CipherPuzzle): boolean {
  return puzzle.usedSymbols.every(
    (s) => guesses[s] != null && guesses[s] === puzzle.reverseMapping[s],
  );
}

export function getHintCount(difficulty: Settings['puzzleDifficulty'], symbolCount: number): number {
  if (symbolCount <= 1) return 0;
  switch (difficulty) {
    case 'superEasy':
      return Math.min(Math.max(8, Math.ceil(symbolCount * 0.5)), symbolCount - 1);
    case 'easy':
      return Math.min(Math.max(4, Math.ceil(symbolCount * 0.25)), symbolCount - 1);
    case 'medium':
      return Math.min(2, symbolCount - 1);
    case 'hard':
    default:
      return 0;
  }
}
