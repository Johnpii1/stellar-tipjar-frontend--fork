"use client";

import { useCallback, useRef } from "react";

type AnyFunction<T extends unknown[]> = (...args: T) => void;

export function useThrottle<T extends unknown[]>(
  callback: AnyFunction<T>,
  delayMs: number,
): AnyFunction<T> {
  const lastRunRef = useRef(0);
  const trailingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: T) => {
      const now = Date.now();
      const elapsed = now - lastRunRef.current;

      if (elapsed >= delayMs) {
        lastRunRef.current = now;
        callback(...args);
        return;
      }

      if (trailingTimerRef.current) {
        clearTimeout(trailingTimerRef.current);
      }

      const remaining = delayMs - elapsed;
      trailingTimerRef.current = setTimeout(() => {
        lastRunRef.current = Date.now();
        callback(...args);
      }, remaining);
    },
    [callback, delayMs],
  );
}
