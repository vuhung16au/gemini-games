import type { DinoSoundEvent } from '../game/types';

class DinoAudio {
  private ctx: AudioContext | null = null;
  private muted = false;

  public setMuted(muted: boolean): void {
    this.muted = muted;
  }

  public unlock(): void {
    if (this.muted) return;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          this.ctx = null;
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }
  }

  public playBatch(events: DinoSoundEvent[]): void {
    if (this.muted || events.length === 0) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (const ev of events) {
      if (ev === 'jump') {
        this.tone(520, 0.08, 'square', now);
      } else if (ev === 'milestone') {
        this.tone(740, 0.07, 'square', now);
        this.tone(980, 0.12, 'square', now + 0.08);
      } else if (ev === 'crash') {
        this.tone(220, 0.12, 'square', now);
        this.tone(150, 0.22, 'sawtooth', now + 0.1);
      }
    }
  }

  private tone(freq: number, duration: number, type: OscillatorType, startTime: number): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.06, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.01);
    } catch {
      // Ignore Web Audio errors
    }
  }
}

export const sfx = new DinoAudio();
