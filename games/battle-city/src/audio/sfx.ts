import type { SoundEvent } from '../game/types';

class ChiptuneAudio {
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

  public playBatch(events: SoundEvent[]): void {
    if (this.muted || events.length === 0) return;
    this.unlock();
    if (!this.ctx) return;

    for (const ev of events) {
      this.play(ev);
    }
  }

  private play(ev: SoundEvent): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (ev === 'stage_start') {
      [523, 659, 784, 659, 1046].forEach((f, i) => {
        this.tone(f, f, 0.09, 'square', 0.05, now + i * 0.09);
      });
    } else if (ev === 'fire') {
      this.tone(680, 220, 0.07, 'square', 0.045, now);
    } else if (ev === 'brick') {
      this.tone(220, 110, 0.05, 'triangle', 0.05, now);
    } else if (ev === 'steel') {
      this.tone(880, 660, 0.04, 'square', 0.035, now);
    } else if (ev === 'explosion') {
      this.tone(180, 52, 0.22, 'sawtooth', 0.08, now);
    } else if (ev === 'powerup') {
      [587, 740, 880, 1175].forEach((f, i) => {
        this.tone(f, f, 0.06, 'square', 0.05, now + i * 0.05);
      });
    } else if (ev === 'oneup') {
      [659, 784, 1318, 1046, 1175, 1568].forEach((f, i) => {
        this.tone(f, f, 0.07, 'square', 0.05, now + i * 0.06);
      });
    } else if (ev === 'eagle_dead' || ev === 'game_over') {
      [392, 349, 330, 261].forEach((f, i) => {
        this.tone(f, f * 0.92, 0.16, 'sawtooth', 0.06, now + i * 0.14);
      });
    }
  }

  private tone(
    startFreq: number,
    endFreq: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    startTime: number,
  ): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), startTime + duration);

      gain.gain.setValueAtTime(volume, startTime);
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

export const sfx = new ChiptuneAudio();
