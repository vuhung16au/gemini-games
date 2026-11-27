import type { SoundEvent } from '../game/types';

class MarioAudio {
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

    if (ev === 'jump') {
      this.tone(300, 620, 0.11, 'square', 0.05, now);
    } else if (ev === 'coin') {
      this.tone(988, 988, 0.06, 'square', 0.05, now);
      this.tone(1319, 1319, 0.14, 'square', 0.05, now + 0.06);
    } else if (ev === 'powerup') {
      [523, 659, 784, 1046, 1319].forEach((f, i) => {
        this.tone(f, f, 0.06, 'square', 0.05, now + i * 0.05);
      });
    } else if (ev === 'oneup') {
      [330, 392, 659, 523, 587, 784].forEach((f, i) => {
        this.tone(f, f, 0.07, 'square', 0.05, now + i * 0.06);
      });
    } else if (ev === 'brick') {
      this.tone(190, 90, 0.09, 'sawtooth', 0.06, now);
    } else if (ev === 'bump') {
      this.tone(160, 120, 0.05, 'triangle', 0.05, now);
    } else if (ev === 'stomp') {
      this.tone(420, 180, 0.08, 'triangle', 0.06, now);
    } else if (ev === 'fireball') {
      this.tone(720, 340, 0.06, 'square', 0.04, now);
    } else if (ev === 'flagpole' || ev === 'castle_clear') {
      [523, 659, 784, 1046, 784, 1046].forEach((f, i) => {
        this.tone(f, f, 0.11, 'square', 0.055, now + i * 0.09);
      });
    } else if (ev === 'hurt') {
      this.tone(330, 140, 0.18, 'sawtooth', 0.06, now);
    } else if (ev === 'game_over') {
      [392, 330, 261, 196].forEach((f, i) => {
        this.tone(f, f * 0.9, 0.18, 'triangle', 0.06, now + i * 0.16);
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

export const sfx = new MarioAudio();
