import { useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { ALPHABET } from '../utils/cipher';
import { PUZZLE_START_COST } from '../utils/life';

export function usePuzzleKeyboard() {
  const puzzle = useAppStore((s) => s.puzzle);
  const getState = useAppStore.getState;

  useEffect(() => {
    if (!puzzle) return;

    const onKey = (e: KeyboardEvent) => {
      const state = getState();
      if (!state.puzzle || state.screen !== 'play') return;

      if (state.won) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (state.session.type === 'daily') {
            state.setScreen('start');
          } else if (!state.settings.premium && state.lives < PUZZLE_START_COST) {
            return;
          } else if (state.session.type === 'lesson') {
            state.startNextLesson();
          } else if (state.session.type === 'review') {
            state.startNextReview();
          } else {
            state.startRandom();
          }
        }
        return;
      }

      if (e.key === 'Backspace') {
        state.clearGuess();
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (state.selectedSymbol) {
          const idx = state.puzzle.usedSymbols.indexOf(state.selectedSymbol);
          state.selectSymbol(state.puzzle.usedSymbols[(idx + 1) % state.puzzle.usedSymbols.length]);
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        if (state.selectedSymbol) {
          const idx = state.puzzle.usedSymbols.indexOf(state.selectedSymbol);
          state.selectSymbol(
            state.puzzle.usedSymbols[(idx - 1 + state.puzzle.usedSymbols.length) % state.puzzle.usedSymbols.length],
          );
        }
        return;
      }

      const upper = e.key.toUpperCase();
      if (ALPHABET.includes(upper)) {
        state.setGuess(upper);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [puzzle, getState]);
}
