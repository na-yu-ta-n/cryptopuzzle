import { Box } from '@mui/material';
import { useAppStore } from '../stores/useAppStore';
import { usePuzzleKeyboard } from '../hooks/usePuzzleKeyboard';
import { useWinCelebration } from '../hooks/useWinCelebration';
import PuzzleHeader from './puzzle/PuzzleHeader';
import PuzzleBoard from './puzzle/PuzzleBoard';
import PuzzleKeyboard from './puzzle/PuzzleKeyboard';

export default function PuzzleGame() {
  const puzzle = useAppStore((s) => s.puzzle);
  const shake = useAppStore((s) => s.shake);

  usePuzzleKeyboard();
  useWinCelebration();

  if (!puzzle) return null;

  return (
    <Box
      className={shake ? 'shake' : ''}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        background: 'transparent',
      }}
    >
      <PuzzleHeader />
      <PuzzleBoard />
      <PuzzleKeyboard />
    </Box>
  );
}
