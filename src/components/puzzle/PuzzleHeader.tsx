import { Box, Chip, IconButton, LinearProgress, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { CATEGORY_LABELS, PUZZLE_DIFFICULTY_COLORS, PUZZLE_DIFFICULTY_LABELS } from '../../utils/labels';

export default function PuzzleHeader() {
  const puzzle = useAppStore((s) => s.puzzle);
  const stats = useAppStore((s) => s.stats);
  const settings = useAppStore((s) => s.settings);
  const combo = useAppStore((s) => s.combo);
  const lives = useAppStore((s) => s.lives);
  const maxLives = useAppStore((s) => s.maxLives);
  const setScreen = useAppStore((s) => s.setScreen);
  const setSetting = useAppStore((s) => s.setSetting);

  if (!puzzle) return null;

  const progressPercent = stats.xp % 100;

  return (
    <>
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          borderRadius: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color='inherit' onClick={() => setScreen('start')}>
            <ArrowBackIcon />
          </IconButton>
          <Chip
            label={CATEGORY_LABELS[puzzle.material.category ?? 'all'] ?? puzzle.material.category}
            color='secondary'
            size='small'
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label={PUZZLE_DIFFICULTY_LABELS[settings.puzzleDifficulty]}
            color={PUZZLE_DIFFICULTY_COLORS[settings.puzzleDifficulty]}
            size='small'
            sx={{ fontWeight: 700 }}
          />
          <Chip label={`Lv.${stats.level}`} color='primary' size='small' sx={{ fontWeight: 700 }} />
          <Chip
            icon={settings.premium ? <WorkspacePremiumIcon /> : <FavoriteIcon />}
            label={settings.premium ? '∞' : `${lives}/${maxLives}`}
            color='error'
            size='small'
            sx={{ fontWeight: 700 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocalFireDepartmentIcon color='warning' />
            <Typography variant='body1' style={{ fontWeight: 700 }}>
              {stats.currentStreak}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SportsScoreIcon color='info' />
            <motion.div
              key={`combo-${combo}`}
              initial={{ scale: 1.5, y: -10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <Typography variant='body1' style={{ fontWeight: 700 }}>
                {combo} combo
              </Typography>
            </motion.div>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant='body2' color='text.secondary'>
              XP
            </Typography>
            <Typography variant='body1' style={{ fontWeight: 700 }}>
              {stats.xp}
            </Typography>
          </Box>
          <IconButton color='inherit' onClick={() => setSetting('soundEnabled', !settings.soundEnabled)}>
            {settings.soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </IconButton>
        </Box>
      </Paper>

      <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto', mb: 2 }}>
        <LinearProgress
          variant='determinate'
          value={progressPercent}
          sx={{
            height: 10,
            borderRadius: 5,
            background: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #8b5cf6, #22d3ee)',
              borderRadius: 5,
            },
          }}
        />
      </Box>
    </>
  );
}
