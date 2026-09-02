import { useMemo, type ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import WinOverlay from './WinOverlay';
import type { CipherPuzzle, Guesses } from '../../types';

function SymbolCell({
  symbol,
  guess,
  correct,
  selected,
  onSelect,
  disabled,
}: {
  symbol: string;
  guess: string | null;
  correct: boolean;
  selected: boolean;
  onSelect: () => void;
  disabled: boolean;
}) {
  const isWrong = guess != null && !correct && !disabled;
  const isCorrect = guess != null && correct && !disabled;

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05, y: -2 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      onClick={() => !disabled && onSelect()}
      style={{ cursor: disabled ? 'default' : 'pointer' }}
    >
      <Box
        sx={{
          minWidth: { xs: 42, sm: 54 },
          height: { xs: 52, sm: 64 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          border: (t) => `2px solid ${selected ? t.palette.secondary.main : 'transparent'}`,
          background: (t) =>
            isCorrect
              ? `linear-gradient(135deg, ${t.palette.success.dark}22, ${t.palette.success.main}44)`
              : isWrong
              ? `linear-gradient(135deg, ${t.palette.error.dark}22, ${t.palette.error.main}44)`
              : `linear-gradient(135deg, ${t.palette.background.paper}, rgba(255,255,255,0.04))`,
          boxShadow: (t) =>
            isCorrect
              ? `0 0 14px ${t.palette.success.main}`
              : selected
              ? `0 0 14px ${t.palette.secondary.main}`
              : '0 4px 12px rgba(0,0,0,0.3)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Typography variant='caption' sx={{ opacity: 0.6, fontSize: '0.65rem', lineHeight: 1 }}>
          {symbol}
        </Typography>
        <Typography variant='h6' sx={{ fontWeight: 800, lineHeight: 1, fontSize: { xs: '1.1rem', sm: '1.4rem' } }}>
          {guess ?? ''}
        </Typography>
      </Box>
    </motion.div>
  );
}

function renderWord(
  word: string,
  wordIndex: number,
  puzzle: CipherPuzzle,
  guesses: Guesses,
  selectedSymbol: string | null,
  onSelect: (s: string) => void,
  won: boolean,
) {
  const items: ReactNode[] = [];
  let i = 0;
  while (i < word.length) {
    const two = word.slice(i, i + 2);
    if (/^\d{2}$/.test(two)) {
      const guess = guesses[two] ?? null;
      const correct = puzzle.reverseMapping[two] === guess;
      items.push(
        <SymbolCell
          key={`cell-${wordIndex}-${i}`}
          symbol={two}
          guess={guess}
          correct={correct}
          selected={selectedSymbol === two}
          onSelect={() => onSelect(two)}
          disabled={won}
        />,
      );
      i += 2;
    } else {
      const ch = word[i];
      if (ch === ' ' || ch === '\u00A0') {
        items.push(<Box key={`sp-${wordIndex}-${i}`} sx={{ width: 12 }} />);
      } else {
        items.push(
          <Box
            key={`p-${wordIndex}-${i}`}
            sx={{ display: 'flex', alignItems: 'flex-end', px: 0.3, pb: 0.8 }}
          >
            <Typography variant='h6' sx={{ color: 'text.secondary', fontWeight: 700 }}>
              {ch}
            </Typography>
          </Box>,
        );
      }
      i++;
    }
  }
  return items;
}

export default function PuzzleBoard() {
  const puzzle = useAppStore((s) => s.puzzle);
  const guesses = useAppStore((s) => s.guesses);
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const won = useAppStore((s) => s.won);
  const xpPopup = useAppStore((s) => s.xpPopup);
  const levelUp = useAppStore((s) => s.levelUp);
  const selectSymbol = useAppStore((s) => s.selectSymbol);

  if (!puzzle) return null;

  const words = useMemo(() => puzzle.cipherText.split(' ').filter(Boolean), [puzzle]);

  return (
    <Paper
      sx={{
        flex: 1,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        mb: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: { xs: 2, sm: 3.5 },
          rowGap: 1,
          maxWidth: '100%',
        }}
      >
        {words.map((w, i) => (
          <Box
            key={`w-${i}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              flexWrap: 'wrap',
              maxWidth: '100%',
            }}
          >
            {renderWord(w, i, puzzle, guesses, selectedSymbol, selectSymbol, won)}
          </Box>
        ))}
      </Box>

      <WinOverlay />

      <AnimatePresence>
        {xpPopup != null && !won && (
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -60, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ position: 'absolute', top: '40%', pointerEvents: 'none' }}
          >
            <Typography variant='h4' style={{ fontWeight: 800 }} color='success.main'>
              +{xpPopup} XP
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {levelUp && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            style={{ position: 'absolute', top: '35%', pointerEvents: 'none' }}
          >
            <Typography
              variant='h2'
              style={{ fontWeight: 900 }}
              sx={{
                background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #ef4444)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 40px rgba(245,158,11,0.5)',
              }}
            >
              LEVEL UP!
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
}
