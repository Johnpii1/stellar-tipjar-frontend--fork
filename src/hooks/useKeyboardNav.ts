"use client";

import { useCallback } from "react";

type KeyHandlers = Partial<Record<string, (e: React.KeyboardEvent) => void>>;

/**
 * Returns an onKeyDown handler that dispatches to per-key callbacks.
 * Common keys: "Enter", "Escape", "ArrowUp", "ArrowDown", " " (Space)
 */
export function useKeyboardNav(handlers: KeyHandlers) {
  return useCallback(
    (e: React.KeyboardEvent) => {
      const handler = handlers[e.key];
      if (handler) {
        e.preventDefault();
        handler(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(Object.keys(handlers))]
  );
}
