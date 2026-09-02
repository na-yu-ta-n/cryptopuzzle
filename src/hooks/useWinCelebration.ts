import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../stores/useAppStore';

const CONFETTI_COLORS = ['#8b5cf6', '#22d3ee', '#f59e0b', '#22c55e', '#ef4444', '#ec4899'];

export function useWinCelebration() {
  const won = useAppStore((s) => s.won);
  const levelUp = useAppStore((s) => s.levelUp);
  const xpPopup = useAppStore((s) => s.xpPopup);
  const clearXpPopup = useAppStore((s) => s.clearXpPopup);
  const clearLevelUp = useAppStore((s) => s.clearLevelUp);
  const firedConfetti = useRef(false);

  useEffect(() => {
    if (won && !firedConfetti.current) {
      firedConfetti.current = true;
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
        colors: CONFETTI_COLORS,
        scalar: 1.2,
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.8 },
          colors: ['#f59e0b', '#22d3ee', '#ec4899'],
          angle: 120,
          scalar: 0.9,
        });
      }, 250);
      if (levelUp) {
        setTimeout(() => {
          confetti({
            particleCount: 120,
            spread: 160,
            origin: { y: 0.5 },
            colors: ['#fbbf24', '#f59e0b', '#f97316'],
            scalar: 1.5,
          });
        }, 500);
      }
    } else if (!won) {
      firedConfetti.current = false;
    }
  }, [won, levelUp]);

  useEffect(() => {
    if (xpPopup != null) {
      const t = setTimeout(clearXpPopup, 2500);
      return () => clearTimeout(t);
    }
  }, [xpPopup, clearXpPopup]);

  useEffect(() => {
    if (levelUp) {
      const t = setTimeout(clearLevelUp, 3000);
      return () => clearTimeout(t);
    }
  }, [levelUp, clearLevelUp]);
}
