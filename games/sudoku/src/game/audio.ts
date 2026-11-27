/**
 * Procedural Web Audio API synthesizer for Sudoku SFX.
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

  playPlace(): void {
    if (this.muted) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.055);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  playError(): void {
    if (this.muted) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(125, now + 0.14);

    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  playWin(): void {
    if (this.muted) return;
    this.unlock();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const start = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.24);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.25);
    });
  }
}
