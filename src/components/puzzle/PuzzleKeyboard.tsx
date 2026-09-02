import { useMemo, useState } from 'react';
import { Box, Button, Chip, LinearProgress, Paper, Typography } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { useAppStore } from '../../stores/useAppStore';
import { HINT_COST, PUZZLE_START_COST } from '../../utils/life';
import WatchAdDialog from '../WatchAdDialog';

const QWERTY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export default function PuzzleKeyboard() {
  const puzzle = useAppStore((s) => s.puzzle);
  const guesses = useAppStore((s) => s.guesses);
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const won = useAppStore((s) => s.won);
  const mistakes = useAppStore((s) => s.mistakes);
  const session = useAppStore((s) => s.session);
  const settings = useAppStore((s) => s.settings);
  const lives = useAppStore((s) => s.lives);
  const maxLives = useAppStore((s) => s.maxLives);
  const setGuess = useAppStore((s) => s.setGuess);
  const selectSymbol = useAppStore((s) => s.selectSymbol);
  const useHint = useAppStore((s) => s.useHint);
  const startRandom = useAppStore((s) => s.startRandom);
  const claimAdLives = useAppStore((s) => s.claimAdLives);
  const [adOpen, setAdOpen] = useState(false);

  if (!puzzle) return null;

  const canHint = settings.premium || lives >= HINT_COST;
  const canNext = settings.premium || lives >= PUZZLE_START_COST;

  const progress = useMemo(() => {
    const filled = puzzle.usedSymbols.filter((s) => guesses[s] != null).length;
    return { filled, total: puzzle.usedSymbols.length };
  }, [puzzle, guesses]);

  const nextProgress = Math.max(0, Math.min(1, progress.filled / progress.total));

  const answerLetters = useMemo(
    () => new Set(puzzle.usedSymbols.map((s) => puzzle.reverseMapping[s])),
    [puzzle],
  );
  const guessedLetters = useMemo(
    () => new Set(Object.values(guesses).filter((g): g is string => g != null)),
    [guesses],
  );

  const remainingLetters = [...answerLetters].filter((l) => !guessedLetters.has(l)).length;

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='body2' color='text.secondary'>
          選択: {selectedSymbol ? `${selectedSymbol}` : 'なし'} / ミス: {mistakes}
        </Typography>
        <LinearProgress
          variant='determinate'
          value={nextProgress * 100}
          sx={{ width: 120, height: 6, borderRadius: 3 }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='caption' color='text.secondary'>
            残り英字
          </Typography>
          <Chip
            label={`${remainingLetters}`}
            size='small'
            color='secondary'
            sx={{ fontWeight: 700 }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, alignItems: 'center' }}>
          {QWERTY_ROWS.map((row, rowIdx) => (
            <Box key={rowIdx} sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 0.4, sm: 0.8 } }}>
              {row.map((l) => {
                const isAnswer = answerLetters.has(l);
                const isUsed = guessedLetters.has(l);
                const isCurrent = selectedSymbol ? guesses[selectedSymbol] === l : false;

                let variant: 'text' | 'outlined' | 'contained' = 'text';
                let color: 'secondary' | 'error' | 'primary' | 'inherit' | 'success' | 'info' | 'warning' = 'secondary';
                let sx = {};

                if (isCurrent) {
                  variant = 'contained';
                  color = 'secondary';
                  sx = { boxShadow: '0 0 12px rgba(34,211,238,0.5)' };
                } else if (isUsed) {
                  variant = 'outlined';
                  color = 'error';
                  sx = { opacity: 0.35, textDecoration: 'line-through', borderColor: 'error.main' };
                } else if (isAnswer) {
                  variant = 'outlined';
                  color = 'secondary';
                  sx = { borderColor: 'secondary.main', color: '#fff' };
                } else {
                  variant = 'text';
                  color = 'secondary';
                  sx = { opacity: 0.25, color: 'text.secondary' };
                }

                return (
                  <Button
                    key={l}
                    variant={variant}
                    color={color}
                    size='small'
                    onClick={() => setGuess(l)}
                    disabled={won || (isUsed && !isCurrent)}
                    sx={{
                      minWidth: { xs: 30, sm: 38 },
                      height: { xs: 38, sm: 44 },
                      p: 0,
                      fontSize: { xs: '0.9rem', sm: '1.05rem' },
                      fontWeight: 700,
                      ...sx,
                    }}
                  >
                    {l}
                  </Button>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Button
          variant='outlined'
          startIcon={<LightbulbIcon />}
          onClick={useHint}
          disabled={won || !canHint}
          sx={{ borderColor: 'warning.main', color: 'warning.main' }}
        >
          ヒント (-{HINT_COST})
        </Button>
        <Button
          variant='outlined'
          startIcon={<CheckCircleIcon />}
          onClick={() => {
            if (selectedSymbol) {
              const idx = puzzle.usedSymbols.indexOf(selectedSymbol);
              selectSymbol(puzzle.usedSymbols[(idx + 1) % puzzle.usedSymbols.length]);
            }
          }}
          disabled={won}
        >
          確認 / 進む
        </Button>
        {session.type === 'free' && (
          <Button
            variant='contained'
            endIcon={<NavigateNextIcon />}
            onClick={startRandom}
            disabled={won || !canNext}
          >
            スキップ / 次へ
          </Button>
        )}
      </Box>

      {!settings.premium && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Button
            variant='text'
            size='small'
            color='warning'
            startIcon={<OndemandVideoIcon />}
            onClick={() => setAdOpen(true)}
            disabled={won || adOpen || lives >= maxLives}
            sx={{ textTransform: 'none' }}
          >
            動画を見てライフ +5
          </Button>
        </Box>
      )}

      <WatchAdDialog
        open={adOpen}
        onClose={() => setAdOpen(false)}
        onReward={() => { claimAdLives(); setAdOpen(false); }}
        rewardText='もう少しでライフがもらえます！'
      />
    </Paper>
  );
}
