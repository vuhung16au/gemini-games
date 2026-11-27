export class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean;

  constructor(muted: boolean) {
    this.muted = muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public unlock(): void {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'triangle',
    gainPeak = 0.08,
    delay = 0,
  ): void {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playSelect(): void {
    this.unlock();
    this.playTone(540, 0.05, 'sine', 0.04);
  }

  public playCardPlay(): void {
    this.unlock();
    this.playTone(320, 0.08, 'triangle', 0.08, 0);
    this.playTone(460, 0.09, 'triangle', 0.06, 0.03);
  }

  public playPass(): void {
    this.unlock();
    this.playTone(240, 0.09, 'sine', 0.05, 0);
    this.playTone(190, 0.1, 'sine', 0.04, 0.05);
  }

  public playError(): void {
    this.unlock();
    this.playTone(165, 0.14, 'sawtooth', 0.05, 0);
  }

  public playChatHeo(): void {
    this.unlock();
    this.playTone(140, 0.18, 'sawtooth', 0.09, 0);
    this.playTone(523.25, 0.15, 'triangle', 0.09, 0.06);
    this.playTone(659.25, 0.18, 'triangle', 0.09, 0.14);
  }

  public playWin(): void {
    this.unlock();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.22, 'triangle', 0.08, idx * 0.08);
    });
  }
}
