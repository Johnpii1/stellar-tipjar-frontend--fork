export interface RateLimitState {
  limit: number;
  windowMs: number;
  used: number;
  remaining: number;
  retryAfterMs: number;
  resetAt: number;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  retryAfterMs: number;
}

export class RateLimiter {
  private requests: number[] = [];

  constructor(
    private readonly limit = 10,
    private readonly windowMs = 60_000,
    private readonly minIntervalMs = 200,
  ) {}

  private prune(now: number): void {
    this.requests = this.requests.filter((timestamp) => now - timestamp < this.windowMs);
  }

  canMakeRequest(now = Date.now()): RateLimitCheckResult {
    this.prune(now);

    if (this.requests.length >= this.limit) {
      const oldestTimestamp = this.requests[0];
      const retryAfterMs = Math.max(0, this.windowMs - (now - oldestTimestamp));
      return { allowed: false, retryAfterMs };
    }

    const latestTimestamp = this.requests[this.requests.length - 1];
    if (typeof latestTimestamp === "number") {
      const elapsed = now - latestTimestamp;
      if (elapsed < this.minIntervalMs) {
        return { allowed: false, retryAfterMs: this.minIntervalMs - elapsed };
      }
    }

    return { allowed: true, retryAfterMs: 0 };
  }

  recordRequest(now = Date.now()): void {
    this.prune(now);
    this.requests.push(now);
  }

  getState(now = Date.now()): RateLimitState {
    this.prune(now);

    const used = this.requests.length;
    const remaining = Math.max(0, this.limit - used);
    const retryAfterMs =
      used >= this.limit ? Math.max(0, this.windowMs - (now - this.requests[0])) : 0;
    const resetAt = retryAfterMs > 0 ? now + retryAfterMs : now + this.windowMs;

    return {
      limit: this.limit,
      windowMs: this.windowMs,
      used,
      remaining,
      retryAfterMs,
      resetAt,
    };
  }
}

export function formatRetryAfter(retryAfterMs: number): string {
  const totalSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) {
    return `${seconds}s`;
  }

  if (seconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${seconds}s`;
}
