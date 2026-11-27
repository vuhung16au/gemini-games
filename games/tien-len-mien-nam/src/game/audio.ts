class SoundManager {
  private ctx: AudioContext | null = null;
  private muted = false;

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  private ensureCtx(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = 'triangle',
    gainPeak = 0.08,
    delay = 0,
  ) {
    const ctx = this.ensureCtx();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playSelect() {
    this.tone(540, 0.045, 'sine', 0.045);
  }

  playCard() {
    this.tone(240, 0.07, 'triangle', 0.09);
    this.tone(360, 0.05, 'sine', 0.05, 0.02);
  }

  playPass() {
    this.tone(190, 0.09, 'sine', 0.05);
    this.tone(145, 0.1, 'sine', 0.04, 0.04);
  }

  playBomb() {
    this.tone(160, 0.16, 'sawtooth', 0.08);
    this.tone(320, 0.18, 'triangle', 0.09, 0.04);
    this.tone(480, 0.22, 'triangle', 0.08, 0.09);
  }

  playError() {
    this.tone(175, 0.09, 'square', 0.04);
  }

  playWin() {
    const notes = [392, 493.88, 587.33, 783.99];
    notes.forEach((n, idx) => {
      this.tone(n, 0.18, 'triangle', 0.075, idx * 0.08);
    });
  }
}

export const soundManager = new SoundManager();
