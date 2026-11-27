let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'square',
  volume = 0.06,
  delay = 0
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

export function playBakeSound(muted: boolean, completed: boolean): void {
  if (muted) return;
  if (completed) {
    playTone(523.25, 0.08, 'triangle', 0.07, 0);
    playTone(659.25, 0.1, 'triangle', 0.07, 0.06);
  } else {
    playTone(330, 0.05, 'triangle', 0.05, 0);
  }
}

export function playCoinSound(muted: boolean, tipped: boolean): void {
  if (muted) return;
  playTone(987.77, 0.07, 'square', 0.04, 0);
  playTone(1318.51, 0.12, 'square', 0.045, 0.05);
  if (tipped) {
    playTone(1567.98, 0.14, 'square', 0.05, 0.1);
  }
}

export function playUpgradeSound(muted: boolean): void {
  if (muted) return;
  playTone(440, 0.08, 'square', 0.05, 0);
  playTone(554.37, 0.08, 'square', 0.05, 0.07);
  playTone(659.25, 0.14, 'square', 0.06, 0.14);
}
