import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, LinearProgress, Typography } from '@mui/material';

interface WatchAdDialogProps {
  open: boolean;
  onClose: () => void;
  onReward: () => void;
  title?: string;
  rewardText?: string;
}

export default function WatchAdDialog({
  open,
  onClose,
  onReward,
  title = '動画広告再生中',
  rewardText = 'もう少しでライフがもらえます！',
}: WatchAdDialogProps) {
  const [progress, setProgress] = useState(0);
  const onRewardRef = useRef(onReward);
  onRewardRef.current = onReward;

  useEffect(() => {
    if (!open) {
      setProgress(0);
      return;
    }
    const start = Date.now();
    const duration = 3000;
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);
      if (elapsed >= duration) {
        clearInterval(timer);
        onRewardRef.current();
      }
    }, 50);
    return () => clearInterval(timer);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 800 }}>{title}</DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography color='text.secondary' sx={{ mb: 2 }}>
          {rewardText}
        </Typography>
        <LinearProgress variant='determinate' value={progress} sx={{ height: 12, borderRadius: 6 }} />
        <Typography variant='caption' color='text.secondary' sx={{ mt: 1, display: 'block' }}>
          {Math.ceil((100 - progress) / 100 * 3)}秒
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
