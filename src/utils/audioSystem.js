/**
 * BLOCKBUSTERS - Web Audio Synthesizer & Procedural Ambient Music Engine
 * Zero external asset dependencies, zero latency, highly responsive.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxGain = null;
    this.bgmGain = null;
    this.masterGain = null;
    this.isMuted = false;
    this.sfxEnabled = true;
    this.bgmEnabled = true;
    this.bgmInterval = null;
    this.bgmStep = 0;
    this.isInitialized = false;

    // Load audio preferences from storage
    this.loadSettings();
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('blockbusters_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.sfxEnabled === 'boolean') this.sfxEnabled = parsed.sfxEnabled;
        if (typeof parsed.bgmEnabled === 'boolean') this.bgmEnabled = parsed.bgmEnabled;
      }
    } catch (e) {
      console.warn('Could not load audio settings from localStorage', e);
    }
  }

  init() {
    if (this.ctx && this.ctx.state !== 'closed') {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? 1 : 0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.bgmEnabled ? 0.35 : 0, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.isInitialized = true;

      if (this.bgmEnabled) {
        this.startBGM();
      }
    } catch (e) {
      console.warn('Web Audio API not supported or user gesture needed', e);
    }
  }

  setSfxEnabled(enabled) {
    this.sfxEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(enabled ? 1 : 0, this.ctx.currentTime);
    }
  }

  setBgmEnabled(enabled) {
    this.bgmEnabled = enabled;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(enabled ? 0.35 : 0, this.ctx.currentTime);
    }
    if (enabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
  }

  // Helper to create simple synth tones
  createOscillator(type, freq, startTime, duration, gainNode = this.sfxGain) {
    if (!this.ctx || !this.sfxEnabled) return null;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      osc.connect(gain);
      gain.connect(gainNode);
      return { osc, gain };
    } catch {
      return null;
    }
  }

  // UI Tap / Click
  playClick() {
    this.init();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const node = this.createOscillator('sine', 600, now, 0.05);
    if (!node) return;
    node.gain.gain.setValueAtTime(0.2, now);
    node.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    node.osc.start(now);
    node.osc.stop(now + 0.05);
  }

  // Block Pick Up
  playPickup() {
    this.init();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const node = this.createOscillator('triangle', 320, now, 0.08);
    if (!node) return;
    node.osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);
    node.gain.gain.setValueAtTime(0.2, now);
    node.gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    node.osc.start(now);
    node.osc.stop(now + 0.08);
  }

  // Block Placed on Board (Thud + Resonance)
  playDrop() {
    this.init();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    
    // Low punch
    const bass = this.createOscillator('sine', 160, now, 0.12);
    if (bass) {
      bass.osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
      bass.gain.gain.setValueAtTime(0.4, now);
      bass.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      bass.osc.start(now);
      bass.osc.stop(now + 0.12);
    }

    // High subtle pop
    const chime = this.createOscillator('triangle', 440, now, 0.1);
    if (chime) {
      chime.gain.gain.setValueAtTime(0.15, now);
      chime.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      chime.osc.start(now);
      chime.osc.stop(now + 0.1);
    }
  }

  // Invalid Placement (Dull buzz)
  playInvalid() {
    this.init();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const node = this.createOscillator('sawtooth', 140, now, 0.15);
    if (!node) return;
    node.osc.frequency.setValueAtTime(140, now);
    node.osc.frequency.setValueAtTime(110, now + 0.07);
    node.gain.gain.setValueAtTime(0.25, now);
    node.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    node.osc.start(now);
    node.osc.stop(now + 0.15);
  }

  // Line Clear Fanfare (Single / Multi-line Chords)
  playLineClear(lineCount = 1, combo = 1) {
    this.init();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    // Base chord frequencies
    const baseFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    const comboBoost = Math.min(combo - 1, 4) * 0.12;

    const count = Math.min(lineCount, 4);
    for (let i = 0; i < count + 2; i++) {
      const freq = baseFreqs[i % baseFreqs.length] * (1 + comboBoost);
      const startTime = now + i * 0.05;
      const duration = 0.35 + lineCount * 0.08;

      const tone = this.createOscillator('triangle', freq, startTime, duration);
      if (tone) {
        tone.gain.gain.setValueAtTime(0.3, startTime);
        tone.gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        tone.osc.start(startTime);
        tone.osc.stop(startTime + duration);
      }
    }
  }

  // Combo Streak chime
  playCombo(comboMultiplier = 2) {
    this.init();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const freq = 440 * Math.pow(1.15, Math.min(comboMultiplier, 8));
    
    const bell = this.createOscillator('sine', freq, now, 0.4);
    if (bell) {
      bell.gain.gain.setValueAtTime(0.35, now);
      bell.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      bell.osc.start(now);
      bell.osc.stop(now + 0.4);
    }
  }

  // New High Score fanfare
  playHighScore() {
    this.init();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const melody = [523.25, 659.25, 783.99, 1046.50, 880.00, 1046.50];
    melody.forEach((freq, idx) => {
      const startTime = now + idx * 0.09;
      const tone = this.createOscillator('triangle', freq, startTime, 0.25);
      if (tone) {
        tone.gain.gain.setValueAtTime(0.35, startTime);
        tone.gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
        tone.osc.start(startTime);
        tone.osc.stop(startTime + 0.25);
      }
    });
  }

  // Game Over sound
  playGameOver() {
    this.init();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const melody = [392.00, 369.99, 329.63, 277.18, 220.00];
    melody.forEach((freq, idx) => {
      const startTime = now + idx * 0.14;
      const tone = this.createOscillator('sawtooth', freq, startTime, 0.3);
      if (tone) {
        tone.gain.gain.setValueAtTime(0.2, startTime);
        tone.gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        tone.osc.start(startTime);
        tone.osc.stop(startTime + 0.3);
      }
    });
  }

  // Time Attack clock ticking
  playCountdownTick() {
    this.init();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const node = this.createOscillator('square', 880, now, 0.04);
    if (!node) return;
    node.gain.gain.setValueAtTime(0.12, now);
    node.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    node.osc.start(now);
    node.osc.stop(now + 0.04);
  }

  // Generative Lo-Fi Ambient Synth Background Music
  startBGM() {
    if (this.bgmInterval) return;
    if (!this.bgmEnabled) return;

    // Ambient chords: Cmaj7, Am7, Fmaj7, G6
    const chordProgressions = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 392.00], // G6
    ];

    this.bgmInterval = setInterval(() => {
      if (!this.ctx || !this.bgmEnabled || this.ctx.state !== 'running') return;
      
      const currentChord = chordProgressions[this.bgmStep % chordProgressions.length];
      const now = this.ctx.currentTime;
      
      // Play warm pad
      currentChord.forEach((freq) => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();
          
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(650, now);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.bgmGain);

          // Slow attack & release envelope
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.045, now + 1.2);
          gain.gain.linearRampToValueAtTime(0.001, now + 3.8);

          osc.start(now);
          osc.stop(now + 4.0);
        } catch {
          // Ignore
        }
      });

      this.bgmStep++;
    }, 4000);
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundManager = new SoundEngine();
