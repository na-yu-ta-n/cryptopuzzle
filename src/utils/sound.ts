let ctx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (ctx?.state === 'suspended') {
    void ctx.resume();
  }
  return ctx;
}

function playTone(freq: number, type: OscillatorType, duration: number, volume = 0.15) {
  const audio = getAudioContext();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime);
  gain.gain.setValueAtTime(volume, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + duration);
}

export const sounds = {
  correct(enabled: boolean) {
    if (!enabled) return;
    playTone(880, 'sine', 0.12, 0.12);
    setTimeout(() => playTone(1100, 'sine', 0.18, 0.12), 80);
  },
  wrong(enabled: boolean) {
    if (!enabled) return;
    playTone(160, 'sawtooth', 0.25, 0.1);
  },
  win(enabled: boolean) {
    if (!enabled) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'triangle', 0.45, 0.13), i * 90);
    });
  },
  levelUp(enabled: boolean) {
    if (!enabled) return;
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'triangle', 0.35, 0.12), i * 80);
    });
  },
  combo(enabled: boolean, streak: number) {
    if (!enabled) return;
    const base = 880 + Math.min(streak, 10) * 60;
    playTone(base, 'sine', 0.12, 0.12);
    setTimeout(() => playTone(base + 220, 'sine', 0.18, 0.12), 60);
    if (streak >= 5) {
      setTimeout(() => playTone(base + 440, 'triangle', 0.25, 0.1), 120);
    }
  },
  badge(enabled: boolean) {
    if (!enabled) return;
    [880, 1100, 1320, 1760].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'sine', 0.25, 0.1), i * 80);
    });
  },
  click(enabled: boolean) {
    if (!enabled) return;
    playTone(600, 'sine', 0.05, 0.06);
  },
};
