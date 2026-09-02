import { useEffect, useState } from 'react';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAppStore } from '../../stores/useAppStore';
import { getBadge } from '../../utils/badges';
import { PUZZLE_START_COST } from '../../utils/life';

export default function WinOverlay() {
  const puzzle = useAppStore((s) => s.puzzle);
  const won = useAppStore((s) => s.won);
  const session = useAppStore((s) => s.session);
  const xpPopup = useAppStore((s) => s.xpPopup);
  const newBadges = useAppStore((s) => s.newBadges);
  const lives = useAppStore((s) => s.lives);
  const settings = useAppStore((s) => s.settings);
  const startNextLesson = useAppStore((s) => s.startNextLesson);
  const startNextReview = useAppStore((s) => s.startNextReview);
  const startRandom = useAppStore((s) => s.startRandom);
  const setScreen = useAppStore((s) => s.setScreen);

  const [badgeOpen, setBadgeOpen] = useState(false);
  const [badgeIndex, setBadgeIndex] = useState(0);

  const canNext = settings.premium || lives >= PUZZLE_START_COST;

  useEffect(() => {
    if (won && newBadges.length > 0) {
      setBadgeOpen(true);
      setBadgeIndex(0);
    }
  }, [won, newBadges.length]);

  if (!won || !puzzle) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(10,10,18,0.92)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
            gap: 2,
          }}
        >
          <Typography variant='h2' style={{ fontWeight: 800 }} color='success.main' className='pop-anim'>
            正解！
          </Typography>
          <Typography variant='h5' style={{ fontWeight: 700 }}>
            {puzzle.material.en}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {puzzle.material.ja}
          </Typography>
          {puzzle.material.words && puzzle.material.words.length > 0 && (
            <Paper sx={{ p: 2, borderRadius: 3, background: 'rgba(139,92,246,0.1)', maxWidth: 480 }}>
              <Typography variant='caption' color='secondary' sx={{ fontWeight: 800, display: 'block', mb: 1 }}>
                覚えておきたい表現
              </Typography>
              {puzzle.material.words.map((w) => (
                <Box key={w.en} sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Typography variant='body2' sx={{ fontWeight: 700 }}>{w.en}</Typography>
                  <Typography variant='body2' color='text.secondary'>… {w.ja}</Typography>
                </Box>
              ))}
            </Paper>
          )}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip icon={<SportsScoreIcon />} label={`+${xpPopup ?? 0} XP`} color='success' sx={{ fontWeight: 700 }} />
            {session.type === 'daily' && <Chip label='デイリー達成 XP2倍！' color='warning' sx={{ fontWeight: 700 }} />}
            {session.type === 'review' && <Chip label='復習ボーナス +5XP' color='info' sx={{ fontWeight: 700 }} />}
            {newBadges.length > 0 && <Chip icon={<EmojiEventsIcon />} label={`新バッジ x${newBadges.length}`} color='warning' sx={{ fontWeight: 700 }} />}
          </Box>
          {session.type === 'lesson' ? (
            <Button variant='contained' size='large' endIcon={<NavigateNextIcon />} onClick={startNextLesson} disabled={!canNext}>
              次のレッスン
            </Button>
          ) : session.type === 'review' ? (
            <Button variant='contained' size='large' endIcon={<NavigateNextIcon />} onClick={startNextReview} disabled={!canNext}>
              次の復習
            </Button>
          ) : session.type === 'daily' ? (
            <Button variant='contained' size='large' endIcon={<NavigateNextIcon />} onClick={() => setScreen('start')}>
              トップに戻る
            </Button>
          ) : (
            <Button variant='contained' size='large' endIcon={<NavigateNextIcon />} onClick={startRandom} disabled={!canNext}>
              次のパズル
            </Button>
          )}
          <Button variant='outlined' onClick={() => setScreen('start')}>
            トップに戻る
          </Button>
        </Box>
      </motion.div>

      <Dialog open={badgeOpen} onClose={() => { setBadgeOpen(false); setBadgeIndex(0); }} maxWidth='xs' fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 800 }}>
          <EmojiEventsIcon color='warning' sx={{ mr: 1 }} />
          新しいバッジ！
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          {newBadges.map((bid, i) => {
            const b = getBadge(bid);
            if (!b) return null;
            return (
              <Fade in={i === badgeIndex} key={bid}>
                <Box>
                  <Typography variant='h4' className='pop-anim'>🏅</Typography>
                  <Typography variant='h5' style={{ fontWeight: 700 }}>{b.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>{b.description}</Typography>
                </Box>
              </Fade>
            );
          })}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => { setBadgeOpen(false); setBadgeIndex(0); }} variant='contained'>
            やった！
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
