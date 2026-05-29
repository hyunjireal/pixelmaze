/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      // Lazy load to comply with browser autoplay policies
      const audioWindow = window as Window & {
        webkitAudioContext?: typeof AudioContext;
      };
      const AudioContextClass = window.AudioContext || audioWindow.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playMove() {
    this.playTone(150, "square", 0.08, 0.05);
  }

  playRotate() {
    this.playTone(300, "square", 0.07, 0.06);
  }

  playDrop() {
    this.playTone(80, "sawtooth", 0.12, 0.08);
  }

  playClear() {
    if (this.isMuted) return;
    try {
      this.init();
      const ctx = this.ctx;
      if (!ctx) return;

      // Magical retro chord major triad: C5 -> E5 -> G5 -> C6
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gainNode.gain.setValueAtTime(0.08, now + idx * 0.06);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.3);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  playUnlock() {
    if (this.isMuted) return;
    try {
      this.init();
      const ctx = this.ctx;
      if (!ctx) return;

      // Sparkly fantasy riser
      const now = ctx.currentTime;
      const notes = [440.00, 554.37, 659.25, 880.00, 1108.73, 1318.51];
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.1, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.4);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  playGameOver() {
    if (this.isMuted) return;
    try {
      this.init();
      const ctx = this.ctx;
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [220, 196, 174.61, 146.83];
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0.1, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.5);
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

export const sfx = new SoundEngine();
