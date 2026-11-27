export type MineSound = 'reveal' | 'flag' | 'win' | 'explode';

class MineAudio {
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

  public play(sound: MineSound): void {
    if (this.muted) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (sound === 'reveal') {
      this.tone(480, 640, 0.045, 'triangle', 0.05, now);
    } else if (sound === 'flag') {
      this.tone(720, 820, 0.04, 'sine', 0.04, now);
    } else if (sound === 'win') {
      [523, 659, 784, 1046].forEach((f, i) => {
        this.tone(f, f, 0.1, 'triangle', 0.06, now + i * 0.08);
      });
    } else if (sound === 'explode') {
      this.tone(160, 48, 0.28, 'sawtooth', 0.08, now);
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
      osc.frequency.exponentialRampToValueAtTime(Math.max(35, endFreq), startTime + duration);
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.01);
    } catch {
      // Ignore audio errors
    }
  }
}

export const sfx = new MineAudio();
