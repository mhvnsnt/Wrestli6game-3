/**
 * Procedural Sound Engine for Wrestling Impacts
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) this.ctx = new AudioContext();
  }

  private soundtrackStarted = false;
  private soundtrackTimeout: number | null = null;

  startSoundtrack() {
    if (this.soundtrackStarted) return;
    this.init();
    if (!this.ctx) return;
    this.soundtrackStarted = true;
    
    const loop = () => {
      if (!this.soundtrackStarted) return;
      const now = this.ctx!.currentTime;
      const beat = 0.5; // 120 BPM
      for (let i = 0; i < 8; i++) {
          const time = now + i * beat;
          // Sub-kick
          if (i % 2 === 0) this.playSubKick(time);
          // Snare
          if (i % 4 === 2) this.playSnare(time);
          // Lead pulse
          this.playLead(time, [110, 110, 123, 110][i % 4]);
      }
      this.soundtrackTimeout = window.setTimeout(loop, 4000);
    };
    loop();
  }

  stopSoundtrack() {
    this.soundtrackStarted = false;
    if (this.soundtrackTimeout) {
      window.clearTimeout(this.soundtrackTimeout);
      this.soundtrackTimeout = null;
    }
  }

  private playSubKick(t: number) {
    const osc = this.ctx!.createOscillator();
    const g = this.ctx!.createGain();
    osc.frequency.setValueAtTime(60, t);
    osc.frequency.exponentialRampToValueAtTime(10, t + 0.1);
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    osc.connect(g); g.connect(this.ctx!.destination);
    osc.start(t); osc.stop(t + 0.1);
  }

  private playSnare(t: number) {
    const osc = this.ctx!.createOscillator();
    const g = this.ctx!.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, t);
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    osc.connect(g); g.connect(this.ctx!.destination);
    osc.start(t); osc.stop(t + 0.05);
  }

  private playLead(t: number, f: number) {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.05, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      osc.connect(g); g.connect(this.ctx!.destination);
      osc.start(t); osc.stop(t + 0.2);
  }

  playImpact(type: 'light' | 'heavy' | 'thud' | 'clank' | 'grapple' | 'wood' | 'glass' | 'snap' | 'ring_bell') {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (type === 'light') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'heavy') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 0.35);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
      // Layer bass hit
      const sub = this.ctx.createOscillator();
      const subG = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(40, now);
      subG.gain.setValueAtTime(0.4, now);
      subG.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      sub.connect(subG);
      subG.connect(this.ctx.destination);
      sub.start(now); sub.stop(now + 0.5);
    } else if (type === 'clank') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'thud') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.3);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'wood') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    } else if (type === 'glass') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'snap') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'ring_bell') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
        osc.start(now);
        osc.stop(now + 1.5);
    } else if (type === 'grapple') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    }
  }

  private currentThemeOsc: { stop: () => void } | null = null;

  toggleTheme(active: boolean, themeId?: string) {
    if (this.currentThemeOsc) {
      this.currentThemeOsc.stop();
      this.currentThemeOsc = null;
    }
    if (active && themeId) {
      this.currentThemeOsc = this.playTheme(themeId);
    }
  }

  playTheme(themeId: string) {
    if (!themeId) return { stop: () => {} };
    this.init();
    if (!this.ctx) return { stop: () => {} };
    const now = this.ctx.currentTime;
    // Generate a procedural theme based on ID hash
    const hash = themeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseFreq = 50 + (hash % 100);
    
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(baseFreq, now);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.1, now + 0.5);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(now);
    
    // Stop after some time or when requested
    return { stop: () => {
        g.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 0.5);
        setTimeout(() => osc.stop(), 500);
    }};
  }

  playCrowdReaction(type: 'cheer' | 'boo' | 'gasp' | 'shock') {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const g = this.ctx.createGain();
    const duration = type === 'cheer' || type === 'boo' ? 1.5 : 0.4;
    
    // Simple white noise for crowd
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'gasp' ? 400 : 800, now);
    
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.15, now + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    noise.connect(filter);
    filter.connect(g);
    g.connect(this.ctx.destination);
    noise.start(now);
  }

  playCrowdChant(themeId: string) {
    if (!themeId) return { stop: () => {} };
    this.init();
    if (!this.ctx) return { stop: () => {} };
    const now = this.ctx.currentTime;
    // Low frequency rhythmic chant
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.frequency.setValueAtTime(80, now);
    osc.type = 'sawtooth';
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.05, now + 1);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(now);
    return { stop: () => {
        g.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 1);
        setTimeout(() => osc.stop(), 1000);
    }};
  }
}

export const sounds = new SoundEngine();
