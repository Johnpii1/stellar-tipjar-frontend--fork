"use client";

import { useEffect } from "react";

import { reportWebVitals } from "@/lib/webVitals";

/**
 * Invisible component that bootstraps Web Vitals reporting.
 * Mount once in the root layout (client-side only).
 */
export function PerformanceMonitor() {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return null;
}
