/**
 * Audio synthesis & sound effects for Soa Voice (NailsbySoa)
 * Supports:
 * - AI Stitch Character Voice via Gemini TTS ('Puck' voice model with steady, normal pace)
 * - Browser SpeechSynthesis fallback with Stitch-like pitch (1.25) and steady normal pace (0.95)
 * - Startup synth noise and 8-bit blip sounds
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private watchdogTimer: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoice();
      };
      this.initVoice();
    }
  }

  public getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private initVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Soft, cool, friendly female voice
    const preferred = voices.find(
      (v) =>
        (v.name.includes('Samantha') ||
          v.name.includes('Victoria') ||
          v.name.includes('Karen') ||
          v.name.includes('Google US English') ||
          v.name.includes('Ava') ||
          v.name.includes('Moira') ||
          v.name.includes('Zira') ||
          v.name.toLowerCase().includes('female')) &&
        v.lang.startsWith('en')
    );
    this.selectedVoice = preferred || voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
  }

  /**
   * Exact Startup Sound from nailsbysoa.netlify.app:
   * Dual-oscillator ascending warp synth (triangle + sine)
   */
  playDiscLoadSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(260, t);
      osc1.frequency.exponentialRampToValueAtTime(880, t + 0.4);
      osc1.frequency.exponentialRampToValueAtTime(1760, t + 0.9);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(520, t);
      osc2.frequency.exponentialRampToValueAtTime(1320, t + 0.5);
      osc2.frequency.exponentialRampToValueAtTime(2200, t + 1.1);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 1.2);
      osc2.stop(t + 1.2);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  /**
   * Exact Bouncing Blip Sound from nailsbysoa.netlify.app
   */
  playBouncingBlip(freq = 520) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.12);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.15);
    } catch (e) {}
  }

  playSparkleChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [1046.5, 1318.5, 1567.98, 2093.0];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch (e) {}
  }

  playMicStart() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  playSuccessSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [784, 987.77, 1174.66, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.1, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.45);
      });
    } catch (e) {}
  }

  /**
   * Speaks the concise voice line using AI Stitch character voice
   * - Steady, normal pace (not rushed)
   * - Never reads paragraphs
   * - Prioritizes high-quality Gemini TTS 'Puck' model with fallback to tuned SpeechSynthesis
   */
  async speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
    },
    language: 'en' | 'fr' = 'en'
  ) {
    this.stopSpeaking();

    // Clean text of symbols
    const cleanText = text
      .replace(/[*#•✦💅✨💎👑🎟️📅🍀]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      options?.onEnd?.();
      return;
    }

    let hasEnded = false;
    const finish = () => {
      if (hasEnded) return;
      hasEnded = true;
      if (this.watchdogTimer) {
        clearTimeout(this.watchdogTimer);
        this.watchdogTimer = null;
      }
      this.currentUtterance = null;
      this.currentAudioElement = null;
      options?.onEnd?.();
    };

    // Try backend AI Stitch TTS (Gemini 'Puck' voice)
    try {
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, language }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.audioUrl) {
          options?.onStart?.();
          const audio = new Audio(data.audioUrl);
          audio.playbackRate = 1.0; // Steady, normal pace

          audio.onended = () => {
            finish();
          };

          audio.onerror = () => {
            finish();
          };

          this.currentAudioElement = audio;
          await audio.play();

          // Safety watchdog
          this.watchdogTimer = setTimeout(() => {
            finish();
          }, 15000);

          return;
        }
      }
    } catch (e) {
      // Fall through to browser speech synthesis
    }

    // Fallback: Browser SpeechSynthesis with Stitch voice parameters
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'fr' ? 'fr-FR' : 'en-US';

      const voices = window.speechSynthesis.getVoices();
      if (language === 'fr') {
        const frVoice = voices.find(
          (v) =>
            v.name.includes('Amelie') ||
            v.name.includes('Google français') ||
            v.name.includes('Hortense') ||
            v.name.includes('Julie') ||
            v.name.toLowerCase().includes('female') ||
            v.lang.startsWith('fr')
        );
        if (frVoice) {
          utterance.voice = frVoice;
        }
      } else if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      // Soft, friendly, natural female pace and pitch:
      utterance.rate = 0.98; // Steady, calm, warm pace
      utterance.pitch = 1.12; // Gentle, soft female pitch
      utterance.volume = 1.0;

      utterance.onstart = () => {
        options?.onStart?.();
      };

      utterance.onend = () => {
        finish();
      };

      utterance.onerror = () => {
        finish();
      };

      // Watchdog timeout to guarantee completion
      const maxDurationMs = Math.max(2500, (cleanText.length / 9) * 1000 + 1500);
      this.watchdogTimer = setTimeout(() => {
        this.stopSpeaking();
        finish();
      }, maxDurationMs);

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      finish();
    }
  }

  stopSpeaking() {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch (e) {}
      this.currentAudioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
      this.currentUtterance = null;
    }

    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
  }

  isSpeaking(): boolean {
    if (this.currentAudioElement && !this.currentAudioElement.paused) return true;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }
}

export const audioService = new AudioService();
