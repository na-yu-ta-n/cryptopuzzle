import { useState, type ReactNode } from 'react';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarsIcon from '@mui/icons-material/Stars';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CastleIcon from '@mui/icons-material/Castle';
import { useAppStore } from '../stores/useAppStore';
import { BADGES } from '../utils/badges';

const iconMap: Record<string, ReactNode> = {
  'emoji-events': <EmojiEventsIcon />,
  'local-fire-department': <LocalFireDepartmentIcon />,
  stars: <StarsIcon />,
  'military-tech': <MilitaryTechIcon />,
  'workspace-premium': <WorkspacePremiumIcon />,
  castle: <CastleIcon />,
};

export default function StatsPanel() {
  const { stats, setScreen, resetProgress } = useAppStore();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const earned = new Set(stats.badges);
  const levelProgress = stats.xp % 100;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        gap: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={() => setScreen('start')}>
          戻る
        </Button>
        <Typography variant='h4' style={{ fontWeight: 800 }}>
          実績
        </Typography>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 4, display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <LocalFireDepartmentIcon color='warning' sx={{ fontSize: 48 }} />
          <Typography variant='h3' style={{ fontWeight: 800 }}>
            {stats.currentStreak}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            現在の連続ログイン
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <TrendingUpIcon color='info' sx={{ fontSize: 48 }} />
          <Typography variant='h3' style={{ fontWeight: 800 }}>
            {stats.totalSolved}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            累計クリア
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <EmojiEventsIcon color='success' sx={{ fontSize: 48 }} />
          <Typography variant='h3' style={{ fontWeight: 800 }}>
            {stats.badges.length}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            バッジ
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', minWidth: 180 }}>
          <Typography variant='h3' style={{ fontWeight: 800 }}>
            Lv.{stats.level}
          </Typography>
          <LinearProgress
            variant='determinate'
            value={levelProgress}
            sx={{
              mt: 1,
              height: 12,
              borderRadius: 6,
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #8b5cf6, #22d3ee)',
                borderRadius: 6,
              },
            }}
          />
          <Typography variant='caption' color='text.secondary'>
            XP {stats.xp}
          </Typography>
        </Box>
      </Paper>

      <Typography variant='h5' style={{ fontWeight: 700 }}>
        バッジ一覧
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {BADGES.map((b) => {
          const has = earned.has(b.id);
          return (
            <Paper
              key={b.id}
              sx={{
                p: 2,
                flex: '1 1 240px',
                maxWidth: 320,
                borderRadius: 3,
                opacity: has ? 1 : 0.5,
                background: has ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                boxShadow: has ? '0 0 20px rgba(245,158,11,0.2)' : undefined,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: has ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.08)',
                  color: has ? 'warning.main' : 'text.secondary',
                }}
              >
                {iconMap[b.icon] ?? <EmojiEventsIcon />}
              </Box>
              <Box>
                <Typography variant='h6' style={{ fontWeight: 700 }}>
                  {b.name}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {b.description}
                </Typography>
                {has && <Chip label='獲得済み' color='warning' size='small' sx={{ mt: 0.5 }} />}
              </Box>
            </Paper>
          );
        })}
      </Box>

      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
        <Button color='error' variant='outlined' onClick={() => setConfirmOpen(true)}>
          進捗をリセット
        </Button>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>進捗をリセットしますか？</DialogTitle>
        <DialogContent>
          <Typography>すべてのXP、ストリーク、バッジ、カスタム教材が消えます。</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>キャンセル</Button>
          <Button
            color='error'
            onClick={() => {
              resetProgress();
              setConfirmOpen(false);
              setScreen('start');
            }}
          >
            リセット
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
