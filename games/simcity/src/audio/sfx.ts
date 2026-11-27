export type SimSoundEffect =
  | 'build'
  | 'road'
  | 'bulldoze'
  | 'levelUp'
  | 'coin'
  | 'milestone'
  | 'error';

class SoundEngine {
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

  public play(effect: SimSoundEffect): void {
    if (this.muted) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (effect === 'build') {
      this.tone(440, 620, 0.08, 'triangle', 0.08, now);
    } else if (effect === 'road') {
      this.tone(260, 320, 0.05, 'sine', 0.06, now);
    } else if (effect === 'bulldoze') {
      this.tone(170, 75, 0.14, 'sawtooth', 0.07, now);
    } else if (effect === 'levelUp') {
      this.tone(523, 523, 0.07, 'triangle', 0.06, now);
      this.tone(659, 659, 0.09, 'triangle', 0.06, now + 0.07);
    } else if (effect === 'coin') {
      this.tone(880, 1175, 0.09, 'sine', 0.04, now);
    } else if (effect === 'milestone') {
      [523, 659, 784, 1046].forEach((freq, i) => {
        this.tone(freq, freq, 0.14, 'triangle', 0.07, now + i * 0.09);
      });
    } else if (effect === 'error') {
      this.tone(210, 150, 0.11, 'square', 0.04, now);
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
      // Ignore Web Audio errors in headless environments
    }
  }
}

export const sfx = new SoundEngine();
