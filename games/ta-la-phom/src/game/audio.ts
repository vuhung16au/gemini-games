/**
 * Procedural Web Audio API synthesizer for Tá Lả (Phỏm) card SFX.
 * Zero external audio files required.
 */
export class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean;

  constructor(initialMuted = false) {
    this.muted = initialMuted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  unlock(): void {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  private playTone(
    startFreq: number,
    endFreq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.08,
    delay = 0,
  ): void {
    if (this.muted) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  playDraw(): void {
    this.playTone(300, 440, 0.06, 'sine', 0.065);
  }

  playDiscard(): void {
    this.playTone(340, 190, 0.055, 'sine', 0.07);
  }

  playEat(): void {
    this.playTone(523.25, 659.25, 0.09, 'triangle', 0.1);
    this.playTone(659.25, 783.99, 0.1, 'triangle', 0.1, 0.06);
  }

  playMeld(): void {
    this.playTone(440, 587.33, 0.09, 'triangle', 0.09);
    this.playTone(587.33, 880, 0.12, 'triangle', 0.09, 0.07);
  }

  playWin(): void {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      this.playTone(freq, freq * 1.02, 0.22, 'triangle', 0.11, idx * 0.08);
    });
  }
}
