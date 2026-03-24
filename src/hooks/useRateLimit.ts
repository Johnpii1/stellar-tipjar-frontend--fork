"use client";

import { useEffect, useMemo, useState } from "react";

import { getApiRateLimitState } from "@/services/api";
import { formatRetryAfter } from "@/utils/rateLimiter";

export interface UseRateLimitResult {
  remaining: number;
  limit: number;
  used: number;
  retryAfterMs: number;
  countdownLabel: string | null;
  isLimited: boolean;
}

export function useRateLimit(pollIntervalMs = 1000): UseRateLimitResult {
  const [state, setState] = useState(() => getApiRateLimitState());

  useEffect(() => {
    const timer = setInterval(() => {
      setState(getApiRateLimitState());
    }, pollIntervalMs);
    return () => clearInterval(timer);
  }, [pollIntervalMs]);

  return useMemo(() => {
    return {
      remaining: state.remaining,
      limit: state.limit,
      used: state.used,
      retryAfterMs: state.retryAfterMs,
      countdownLabel: state.retryAfterMs > 0 ? formatRetryAfter(state.retryAfterMs) : null,
      isLimited: state.retryAfterMs > 0,
    };
  }, [state]);
}
