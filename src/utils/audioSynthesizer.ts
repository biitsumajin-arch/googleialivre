// Web Audio API pure synthesizer for authentic Japanese temple bell / singing bowl & serene resonance
class ZenAudioAmbience {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private rainNode: AudioNode | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a resonant Japanese temple bell / Rin (鈴) gong
  public playTempleBell(pitchMultiplier: number = 1.0) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const baseFreq = 432 * pitchMultiplier; // Sacred 432Hz tuning

      // Frequencies for a bronze bell: Fundamental + Inharmonic overtones
      const partials = [
        { freq: baseFreq, gain: 0.4, decay: 4.5 },
        { freq: baseFreq * 2.02, gain: 0.25, decay: 3.8 },
        { freq: baseFreq * 2.76, gain: 0.18, decay: 2.9 },
        { freq: baseFreq * 4.15, gain: 0.12, decay: 2.1 },
        { freq: baseFreq * 5.43, gain: 0.06, decay: 1.4 }
      ];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.35, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);
      masterGain.connect(ctx.destination);

      partials.forEach(p => {
        const osc = ctx.createOscillator();
        const pGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(p.freq, now);

        // Subtle pitch dip simulating strike impact
        osc.frequency.exponentialRampToValueAtTime(p.freq * 0.995, now + p.decay);

        pGain.gain.setValueAtTime(p.gain, now);
        pGain.gain.exponentialRampToValueAtTime(0.00001, now + p.decay);

        osc.connect(pGain);
        pGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 5.0);
      });
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Generate subtle tranquil bamboo wind chime / soft water drop
  public playWaterDrop() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore audio failure
    }
  }
}

export const zenAudio = new ZenAudioAmbience();
