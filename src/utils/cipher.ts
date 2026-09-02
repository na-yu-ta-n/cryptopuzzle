import type { Material, CipherPuzzle } from '../types';
import { shuffle } from './arrays';

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = ALPHABET.map((_, i) => String(i + 1).padStart(2, '0'));

function indexOf(letter: string): number {
  return ALPHABET.indexOf(letter);
}

function makeDerangement(used: string[]): Map<string, string> {
  const all = [...NUMBERS];
  const shuffled = shuffle(all);

  const mapping = new Map<string, string>();
  for (let i = 0; i < ALPHABET.length; i++) {
    mapping.set(ALPHABET[i], shuffled[i]);
  }

  // Remove fixed points for used letters (e.g. A should not map to 01).
  const fixed: string[] = [];
  for (const c of used) {
    const expected = NUMBERS[indexOf(c)];
    if (mapping.get(c) === expected) fixed.push(c);
  }

  if (fixed.length === 0) return mapping;

  const fixedValues = fixed.map((c) => mapping.get(c)!);
  const rotated = [...fixedValues.slice(1), fixedValues[0]];
  for (let i = 0; i < fixed.length; i++) {
    mapping.set(fixed[i], rotated[i]);
  }

  return mapping;
}

export function createCipher(material: Material, idOverride?: string): CipherPuzzle {
  const clean = material.en.toUpperCase();
  const used = [...new Set(clean.split('').filter((ch) => ALPHABET.includes(ch)))];

  let mapping: Map<string, string>;
  if (used.length <= 1) {
    // Special case: one unique letter. Pick a random number that is not its own.
    const shuffled = shuffle(NUMBERS);
    const self = NUMBERS[indexOf(used[0] ?? 'A')];
    const chosen = shuffled.find((n) => n !== self) ?? '02';
    mapping = new Map([[used[0] ?? 'A', chosen]]);
    for (const c of ALPHABET) {
      if (!mapping.has(c)) {
        const remaining = shuffled.filter((s) => ![...mapping.values()].includes(s));
        mapping.set(c, remaining[0] ?? c);
      }
    }
  } else {
    mapping = makeDerangement(used);
  }

  const mappingRecord: Record<string, string> = {};
  const reverseMapping: Record<string, string> = {};
  for (const [k, v] of mapping) {
    mappingRecord[k] = v;
    reverseMapping[v] = k;
  }

  let cipherText = '';
  for (const ch of clean) {
    if (ALPHABET.includes(ch)) {
      cipherText += mappingRecord[ch];
    } else if (ch === ' ') {
      cipherText += ' ';
    } else if ("'.,!?-;:\"()".includes(ch)) {
      cipherText += ch;
    } else {
      cipherText += ch;
    }
  }

  // Extract used 2-digit number tokens from the cipherText.
  const usedSymbols: string[] = [];
  const regex = /\d{2}/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(cipherText)) !== null) {
    if (!usedSymbols.includes(m[0])) usedSymbols.push(m[0]);
  }

  return {
    id: idOverride ?? crypto.randomUUID(),
    material,
    cipherText,
    mapping: mappingRecord,
    reverseMapping,
    usedSymbols,
  };
}

export function getDifficultyMultiplier(difficulty?: string): number {
  switch (difficulty) {
    case 'easy': return 1;
    case 'medium': return 1.5;
    case 'hard': return 2;
    default: return 1;
  }
}

export function calculateXp(material: Material, mistakes: number): number {
  const base = 10;
  const wordCount = material.en.split(/\s+/).length;
  const diff = getDifficultyMultiplier(material.difficulty);
  const perfectBonus = mistakes === 0 ? 10 : 0;
  return Math.round((base + wordCount * 2) * diff + perfectBonus);
}
