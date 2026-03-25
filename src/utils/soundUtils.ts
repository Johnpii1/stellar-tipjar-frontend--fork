/**
 * soundUtils.ts
 * Web Audio API–based notification sound. No external audio files needed.
 * Mute preference is persisted in localStorage.
 */

const MUTE_KEY = "tipjar:soundMuted";

/** Returns true if the user has muted notification sounds. */
export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MUTE_KEY) === "true";
}

/** Persists the mute preference. */
export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MUTE_KEY, String(muted));
}

/**
 * Plays a short ascending two-tone chime using the Web Audio API.
 * Safe to call on any browser; silently no-ops if audio is unavailable.
 */
export function playNotificationSound(): void {
  if (typeof window === "undefined") return;
  if (isSoundMuted()) return;

  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    const playTone = (
      frequency: number,
      startTime: number,
      duration: number
    ) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, startTime);

      // Fade in quickly then fade out smoothly
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(523.25, now, 0.18);        // C5
    playTone(783.99, now + 0.12, 0.22); // G5

    // Clean up the audio context after tones finish
    setTimeout(() => ctx.close(), 600);
  } catch {
    // Audio not available or blocked – silently ignore
  }
}
