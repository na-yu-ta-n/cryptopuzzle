import { useState } from 'react';
import { Box, Button, Card, CardContent, Chip, FormControl, FormControlLabel, InputLabel, LinearProgress, MenuItem, Paper, Select, Switch, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import Badge from '@mui/material/Badge';
import MapIcon from '@mui/icons-material/Map';
import TodayIcon from '@mui/icons-material/Today';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { motion } from 'framer-motion';
import { useAppStore } from '../stores/useAppStore';
import { getDueReviewMaterials } from '../utils/materials';
import { today } from '../utils/date';
import { PUZZLE_START_COST } from '../utils/life';
import { CATEGORY_OPTIONS } from '../utils/labels';
import WatchAdDialog from './WatchAdDialog';
import type { Settings } from '../types';



export default function StartScreen() {
  const { stats, settings, setSetting, startPuzzle, setScreen, startDaily, dailyDoneDate, customMaterials, srs, lives, maxLives, claimAdLives } = useAppStore();
  const [adOpen, setAdOpen] = useState(false);

  const canPlay = settings.premium || lives >= PUZZLE_START_COST;
  const lifePercent = Math.max(0, Math.min(100, (lives / maxLives) * 100));

  const levelProgress = stats.xp % 100;
  const dailyDone = dailyDoneDate === today();
  const dueCount = getDueReviewMaterials(customMaterials, srs).length;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        gap: 3,
      }}
    >
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <Typography
          variant='h2'
          align='center'
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(90deg, #8b5cf6, #22d3ee, #f59e0b)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 40px rgba(139,92,246,0.3)',
          }}
        >
          クリプトパズル
        </Typography>
      </motion.div>

      <Typography variant='h6' color='text.secondary' align='center'>
        暗号を解いて英語を脳に焼き付ける
      </Typography>

      <Paper
        sx={{
          p: 3,
          width: '100%',
          maxWidth: 720,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 4,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FavoriteIcon color='error' sx={{ fontSize: 32 }} />
            <Typography variant='h4' style={{ fontWeight: 800 }}>
              {lives}
              <Typography component='span' variant='body1' color='text.secondary' sx={{ mx: 0.5 }}>
                /
              </Typography>
              {maxLives}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {!settings.premium && (
              <Button
                variant='outlined'
                color='warning'
                size='small'
                startIcon={<OndemandVideoIcon />}
                onClick={() => setAdOpen(true)}
                disabled={lives >= maxLives}
                sx={{ borderRadius: 4 }}
              >
                動画で +5 ライフ
              </Button>
            )}
            {settings.premium && (
              <Chip icon={<WorkspacePremiumIcon />} label='プレミアム' color='warning' size='small' sx={{ fontWeight: 700 }} />
            )}
          </Box>
        </Box>
        <LinearProgress
          variant='determinate'
          value={lifePercent}
          sx={{
            height: 12,
            borderRadius: 6,
            background: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #ef4444, #f59e0b)', borderRadius: 6 },
          }}
        />
      </Paper>

      <WatchAdDialog
        open={adOpen}
        onClose={() => setAdOpen(false)}
        onReward={() => { claimAdLives(); setAdOpen(false); }}
        rewardText='もう少しでライフがもらえます！'
      />

      <Paper
        sx={{
          p: 3,
          width: '100%',
          maxWidth: 720,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          borderRadius: 4,
        }}
      >
        <Card sx={{ minWidth: 140, textAlign: 'center', background: 'rgba(139,92,246,0.12)' }}>
          <CardContent>
            <LocalFireDepartmentIcon color='warning' sx={{ fontSize: 40 }} />
            <Typography variant='h4' style={{ fontWeight: 800 }}>
              {stats.currentStreak}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              連続ログイン
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 140, textAlign: 'center', background: 'rgba(34,211,238,0.12)' }}>
          <CardContent>
            <TrendingUpIcon color='info' sx={{ fontSize: 40 }} />
            <Typography variant='h4' style={{ fontWeight: 800 }}>
              {stats.totalSolved}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              クリア数
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 140, textAlign: 'center', background: 'rgba(34,197,94,0.12)' }}>
          <CardContent>
            <EmojiEventsIcon color='success' sx={{ fontSize: 40 }} />
            <Typography variant='h4' style={{ fontWeight: 800 }}>
              {stats.badges.length}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              バッジ
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 180, textAlign: 'center', background: 'rgba(245,158,11,0.12)' }}>
          <CardContent>
            <Typography variant='h4' style={{ fontWeight: 800 }}>
              Lv.{stats.level}
            </Typography>
            <Chip label={`XP ${levelProgress}/100`} color='warning' size='small' sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      </Paper>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id='category-label' sx={{ color: 'text.secondary' }}>
          カテゴリ
        </InputLabel>
        <Select
          labelId='category-label'
          value={settings.selectedCategory}
          label='カテゴリ'
          onChange={(e) => setSetting('selectedCategory', e.target.value as (typeof CATEGORY_OPTIONS)[number]['value'])}
          sx={{
            borderRadius: 3,
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
          }}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {c.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel id='difficulty-label' sx={{ color: 'text.secondary' }}>
          難易度
        </InputLabel>
        <Select
          labelId='difficulty-label'
          value={settings.puzzleDifficulty}
          label='難易度'
          onChange={(e) => setSetting('puzzleDifficulty', e.target.value as Settings['puzzleDifficulty'])}
          sx={{
            borderRadius: 3,
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
          }}
        >
          <MenuItem value='superEasy'>超かんたん</MenuItem>
          <MenuItem value='easy'>かんたん</MenuItem>
          <MenuItem value='medium'>ふつう</MenuItem>
          <MenuItem value='hard'>むずかしい</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant='contained'
            size='large'
            startIcon={<MapIcon />}
            onClick={() => setScreen('courses')}
            sx={{
              px: 5,
              py: 2,
              fontSize: '1.4rem',
              borderRadius: 999,
              boxShadow: '0 0 40px rgba(139,92,246,0.5)',
            }}
          >
            コースで学ぶ
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant='outlined'
            size='large'
            startIcon={<PlayArrowIcon />}
            onClick={() => startPuzzle()}
            disabled={!canPlay}
            sx={{ px: 4, py: 2, fontSize: '1.1rem', borderRadius: 999 }}
          >
            フリープレイ
          </Button>
        </motion.div>
      </Box>

      <motion.div whileHover={!dailyDone ? { scale: 1.03 } : undefined} whileTap={!dailyDone ? { scale: 0.97 } : undefined}>
        <Button
          variant={dailyDone ? 'outlined' : 'contained'}
          color='warning'
          size='large'
          startIcon={dailyDone ? <DoneAllIcon /> : <TodayIcon />}
          onClick={() => !dailyDone && canPlay && startDaily()}
          disabled={dailyDone || !canPlay}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 999,
            fontWeight: 800,
            boxShadow: dailyDone ? undefined : '0 0 30px rgba(245,158,11,0.4)',
          }}
        >
          {dailyDone ? '今日のチャレンジ達成！' : 'デイリーチャレンジ（XP 2倍！）'}
        </Button>
      </motion.div>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Badge badgeContent={dueCount} color='error' overlap='rectangular'>
          <Button variant='outlined' startIcon={<SchoolIcon />} onClick={() => setScreen('review')}>
            復習
          </Button>
        </Badge>
        <Button variant='outlined' startIcon={<LibraryBooksIcon />} onClick={() => setScreen('materials')}>
          教材
        </Button>
        <Button variant='outlined' startIcon={<EmojiEventsIcon />} onClick={() => setScreen('stats')}>
          実績
        </Button>
        <Button variant='outlined' startIcon={<SettingsIcon />} onClick={() => setSetting('soundEnabled', !settings.soundEnabled)}>
          音声 {settings.soundEnabled ? 'ON' : 'OFF'}
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={settings.premium}
              onChange={(e) => setSetting('premium', e.target.checked)}
              color='warning'
            />
          }
          label='プレミアム（テスト）'
          sx={{ color: 'text.secondary' }}
        />
      </Box>

      <Typography variant='body2' color='text.secondary' align='center' style={{ maxWidth: 600 }}>
        同じ暗号文字には同じ英字が入ります。すべてのマスを埋めて英文を完成させよう！
      </Typography>
    </Box>
  );
}
