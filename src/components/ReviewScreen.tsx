import { useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplayIcon from '@mui/icons-material/Replay';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SchoolIcon from '@mui/icons-material/School';
import { useAppStore } from '../stores/useAppStore';
import { allMaterials, getDueReviewMaterials } from '../utils/materials';
import { shuffle } from '../utils/arrays';
import { CATEGORY_LABELS } from '../utils/labels';
import { PUZZLE_START_COST } from '../utils/life';
import type { Material, SolvedRecord } from '../types';

function uniqueLatest(history: SolvedRecord[]): SolvedRecord[] {
  const seen = new Map<string, SolvedRecord>();
  // history is newest-first, so the first occurrence is the latest.
  for (const r of history) {
    if (!seen.has(r.materialId)) seen.set(r.materialId, r);
  }
  return [...seen.values()];
}

export default function ReviewScreen() {
  const { stats, customMaterials, srs, setScreen, startPuzzle, startReview, lives, settings } = useAppStore();
  const [shuffled, setShuffled] = useState(false);
  const canPlay = settings.premium || lives >= PUZZLE_START_COST;

  const allMaterialsList = useMemo<Material[]>(
    () => allMaterials(customMaterials),
    [customMaterials]
  );

  const dueMaterials = useMemo(() => getDueReviewMaterials(customMaterials, srs), [customMaterials, srs]);

  const reviewList = useMemo(() => {
    const unique = uniqueLatest(stats.history).slice(0, 20);
    return shuffled ? shuffle(unique) : unique;
  }, [stats.history, shuffled]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={() => setScreen('start')}>
          戻る
        </Button>
        <Typography variant='h4' style={{ fontWeight: 800 }}>
          復習
        </Typography>
      </Box>

      <Typography variant='body1' color='text.secondary'>
        過去に解いた問題をもう一度解いて、英語を定着させよう。
      </Typography>

      {dueMaterials.length > 0 && (
        <Card sx={{ borderRadius: 3, p: 2, background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(255,255,255,0.03))', border: '1px solid rgba(239,68,68,0.4)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SchoolIcon color='error' />
              <Typography variant='h6' sx={{ fontWeight: 800 }}>
                今日の復習 {dueMaterials.length}件（ボーナスXPつき！）
              </Typography>
            </Box>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              忘却曲線に基づいて、忘れかけたタイミングで再出題。今解くと記憶に定着しやすいよ。
            </Typography>
            <Button variant='contained' color='error' size='large' onClick={() => startReview(dueMaterials[0])} disabled={!canPlay}>
              復習を始める
            </Button>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant='outlined'
          startIcon={<ShuffleIcon />}
          onClick={() => setShuffled((s) => !s)}
        >
          {shuffled ? '元の順序' : 'ランダム表示'}
        </Button>
      </Box>

      {reviewList.length === 0 ? (
        <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: 'rgba(255,255,255,0.05)' }}>
          <CardContent>
            <Typography variant='h6' color='text.secondary'>
              まだ解いた問題がありません。まずパズルを1問解きましょう！
            </Typography>
          </CardContent>
        </Card>
      ) : (
        reviewList.map((record) => {
          const material = allMaterialsList.find((m) => m.id === record.materialId);
          return (
            <Card
              key={record.materialId}
              sx={{
                borderRadius: 3,
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                gap: 2,
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  {material?.category && (
                    <Chip label={CATEGORY_LABELS[material.category] ?? material.category} color='secondary' size='small' />
                  )}
                  <Chip label={`+${record.xp} XP`} color='success' size='small' />
                </Box>
                <Typography variant='h6' style={{ fontWeight: 700 }}>
                  {material?.en ?? '不明な問題'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {material?.ja}
                </Typography>
                <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 0.5 }}>
                  解いた日: {record.date} / ミス: {record.attempts}回
                </Typography>
              </CardContent>
              <Button
                variant='contained'
                startIcon={<ReplayIcon />}
                onClick={() => {
                  if (material) startPuzzle(material);
                }}
                disabled={!material || !canPlay}
              >
                もう一度解く
              </Button>
            </Card>
          );
        })
      )}
    </Box>
  );
}
