import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Fade, Snackbar } from '@mui/material';
import { useAppStore } from './stores/useAppStore';
import StartScreen from './components/StartScreen';
import PuzzleGame from './components/PuzzleGame';
import ReviewScreen from './components/ReviewScreen';
import MaterialManager from './components/MaterialManager';
import StatsPanel from './components/StatsPanel';
import CourseMap from './components/CourseMap';

export default function App() {
  const screen = useAppStore((s) => s.screen);
  const isHydrated = useAppStore((s) => s.isHydrated);
  const tickLives = useAppStore((s) => s.tickLives);
  const snackbar = useAppStore((s) => s.snackbar);
  const closeSnackbar = useAppStore((s) => s.closeSnackbar);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isHydrated) {
      setReady(true);
    }
  }, [isHydrated]);

  useEffect(() => {
    tickLives();
    const id = setInterval(tickLives, 1000);
    return () => clearInterval(id);
  }, [tickLives]);

  if (!ready) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={60} thickness={4} color='secondary' />
      </Box>
    );
  }

  return (
    <>
      <Fade in timeout={400}>
        <Box>
          {screen === 'start' && <StartScreen />}
          {screen === 'play' && <PuzzleGame />}
          {screen === 'review' && <ReviewScreen />}
          {screen === 'materials' && <MaterialManager />}
          {screen === 'stats' && <StatsPanel />}
          {screen === 'courses' && <CourseMap />}
        </Box>
      </Fade>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity='warning' sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
