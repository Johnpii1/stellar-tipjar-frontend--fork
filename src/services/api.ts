import { RateLimiter, formatRetryAfter } from "@/utils/rateLimiter";
import { RequestQueue } from "@/utils/requestQueue";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const DEFAULT_RETRIES = 3;
const RATE_LIMITER = new RateLimiter(10, 60_000, 200);
const REQUEST_QUEUE = new RequestQueue();

export interface CreatorProfile {
  username: string;
  displayName: string;
  bio: string;
  preferredAsset: string;
}

/**
 * Shared fetch helper used by all API methods.
 * Centralizing this logic keeps retries, headers, and error handling consistent.
 */
export class ApiRateLimitError extends Error {
  readonly retryAfterMs: number;

  constructor(retryAfterMs: number) {
    super(
      `Too many requests. Please wait ${formatRetryAfter(retryAfterMs)} before trying again.`,
    );
    this.name = "ApiRateLimitError";
    this.retryAfterMs = retryAfterMs;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getBackoffDelay(attempt: number): number {
  const baseDelayMs = 300;
  const maxDelayMs = 5000;
  return Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

function isSafeToQueue(method: string): boolean {
  return method === "GET" || method === "HEAD";
}

async function executeRequest<T>(
  path: string,
  init?: RequestInit,
  retries = DEFAULT_RETRIES,
): Promise<T> {
  let attempt = 0;

  while (attempt <= retries) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      ...init,
      // For frequently updated blockchain data, contributors can switch this to no-store.
      next: { revalidate: 30 },
    });

    if (response.ok) {
      return (await response.json()) as T;
    }

    if (attempt < retries && isRetryableStatus(response.status)) {
      const retryAfterHeader = response.headers.get("retry-after");
      const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : 0;
      const retryDelay =
        Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
          ? retryAfterSeconds * 1000
          : getBackoffDelay(attempt);

      await sleep(retryDelay);
      attempt += 1;
      continue;
    }

    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  throw new Error("API request failed after retries.");
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() ?? "GET";
  const check = RATE_LIMITER.canMakeRequest();

  if (!check.allowed) {
    if (isSafeToQueue(method)) {
      await sleep(check.retryAfterMs);
      return REQUEST_QUEUE.enqueue(async () => request<T>(path, init));
    }

    throw new ApiRateLimitError(check.retryAfterMs);
  }

  RATE_LIMITER.recordRequest();
  return executeRequest<T>(path, init);
}

export function getApiRateLimitState() {
  return RATE_LIMITER.getState();
}

export async function getCreatorProfile(username: string): Promise<CreatorProfile> {
  try {
    return await request<CreatorProfile>(`/creators/${username}`);
  } catch {
    // Fallback makes local UI work before backend endpoints are available.
    return {
      username,
      displayName: `@${username}`,
      bio: "Creator bio will be loaded from the backend API.",
      preferredAsset: "XLM",
    };
  }
}

export async function createTipIntent(payload: {
  username: string;
  amount: string;
  assetCode: string;
}) {
  return request<{ intentId: string; checkoutUrl?: string }>("/tips/intents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
