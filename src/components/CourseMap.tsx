import { Box, Button, Card, CardActionArea, CardContent, Chip, LinearProgress, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StarIcon from '@mui/icons-material/Star';
import { motion } from 'framer-motion';
import { useAppStore } from '../stores/useAppStore';
import { courses } from '../data/courses';
import { PUZZLE_START_COST } from '../utils/life';
import type { Course, Material } from '../types';

type LessonState = 'done' | 'current' | 'locked';

function lessonState(course: Course, material: Material, completed: string[]): LessonState {
  if (completed.includes(material.id)) return 'done';
  // 最初の未クリアレッスンだけ挑戦可能
  const flat = course.units.flatMap((u) => u.lessons);
  const firstIncomplete = flat.find((l) => !completed.includes(l.id));
  return firstIncomplete?.id === material.id ? 'current' : 'locked';
}

function CourseCard({ course, completedCount, total, onSelect }: { course: Course; completedCount: number; total: number; onSelect: () => void }) {
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: '100%' }}>
      <Card sx={{ borderRadius: 4, background: `linear-gradient(135deg, ${course.color}22, rgba(255,255,255,0.04))`, border: `1px solid ${course.color}55` }}>
        <CardActionArea onClick={onSelect}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='h3'>{course.icon}</Typography>
            <Box sx={{ flex: 1 }}>
              <Typography variant='h6' sx={{ fontWeight: 800 }}>{course.title}</Typography>
              <Typography variant='body2' color='text.secondary'>{course.description}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                <LinearProgress
                  variant='determinate'
                  value={percent}
                  sx={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { background: course.color, borderRadius: 4 } }}
                />
                <Typography variant='caption' sx={{ fontWeight: 700, minWidth: 60 }}>{completedCount}/{total} 完了</Typography>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
}

export default function CourseMap() {
  const { courseProgress, selectedCourseId, setSelectedCourseId, setScreen, startLesson, lives, settings } = useAppStore();
  const canPlay = settings.premium || lives >= PUZZLE_START_COST;

  const course = selectedCourseId ? courses.find((c) => c.id === selectedCourseId) : null;

  if (!course) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 }, gap: 2, maxWidth: 720, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={() => setScreen('start')}>
            戻る
          </Button>
          <Typography variant='h4' sx={{ fontWeight: 800 }}>コース</Typography>
        </Box>
        <Typography variant='body1' color='text.secondary'>
          目標に合わせてコースを選ぼう。レッスンを順番にクリアして進めていこう！
        </Typography>
        {courses.map((c) => {
          const completed = courseProgress[c.id] ?? [];
          const total = c.units.reduce((sum, u) => sum + u.lessons.length, 0);
          return <CourseCard key={c.id} course={c} completedCount={completed.length} total={total} onSelect={() => setSelectedCourseId(c.id)} />;
        })}
      </Box>
    );
  }

  const completed = courseProgress[course.id] ?? [];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 }, gap: 2, maxWidth: 720, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={() => setSelectedCourseId(null)}>
          コース一覧
        </Button>
        <Typography variant='h5' sx={{ fontWeight: 800 }}>{course.icon} {course.title}</Typography>
      </Box>

      {course.units.map((unit) => {
        const unitDone = unit.lessons.every((l) => completed.includes(l.id));
        return (
          <Paper key={unit.id} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant='h6' sx={{ fontWeight: 800 }}>{unit.title}</Typography>
              {unitDone && <Chip icon={<StarIcon />} label='コンプリート！' color='warning' size='small' sx={{ fontWeight: 700 }} />}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {unit.lessons.map((lesson, i) => {
                const state = lessonState(course, lesson, completed);
                return (
                  <motion.div key={lesson.id} whileHover={state !== 'locked' ? { scale: 1.01 } : undefined} whileTap={state !== 'locked' ? { scale: 0.99 } : undefined}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        opacity: state === 'locked' ? 0.45 : 1,
                        background: state === 'done'
                          ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(255,255,255,0.03))'
                          : state === 'current'
                          ? `linear-gradient(135deg, ${course.color}33, rgba(255,255,255,0.05))`
                          : 'rgba(255,255,255,0.03)',
                        border: state === 'current' ? `2px solid ${course.color}` : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: state === 'current' ? `0 0 20px ${course.color}66` : undefined,
                      }}
                    >
                      <CardActionArea
                        disabled={state === 'locked' || !canPlay}
                        onClick={() => startLesson(course.id, unit.id, lesson)}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
                          {state === 'done' ? (
                            <CheckCircleIcon color='success' sx={{ fontSize: 32 }} />
                          ) : state === 'current' ? (
                            canPlay ? (
                              <PlayCircleFilledIcon sx={{ fontSize: 32, color: course.color }} />
                            ) : (
                              <LockIcon sx={{ fontSize: 28, color: 'text.secondary' }} />
                            )
                          ) : (
                            <LockIcon sx={{ fontSize: 28, color: 'text.secondary' }} />
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant='body1' sx={{ fontWeight: 700 }}>
                              レッスン {i + 1}
                            </Typography>
                            <Typography variant='body2' color='text.secondary' noWrap>
                              {state === 'done'
                                ? lesson.en
                                : state === 'current'
                                ? canPlay
                                  ? 'ここに挑戦！'
                                  : 'ライフが足りません'
                                : '前のレッスンをクリアで解放'}
                            </Typography>
                          </Box>
                          {state === 'done' && <Chip label='クリア済' color='success' size='small' variant='outlined' />}
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </motion.div>
                );
              })}
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
}
