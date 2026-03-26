import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

import { sendToAnalytics } from "./analytics";

/**
 * Performance budgets based on Google's Core Web Vitals thresholds.
 * Values are in milliseconds (or unitless for CLS).
 */
export const PERFORMANCE_BUDGETS = {
  LCP: { good: 2500, poor: 4000 },   // Largest Contentful Paint
  INP: { good: 200, poor: 500 },     // Interaction to Next Paint
  CLS: { good: 0.1, poor: 0.25 },   // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 },   // First Contentful Paint
  TTFB: { good: 800, poor: 1800 },   // Time to First Byte
} as const;

export type MetricName = keyof typeof PERFORMANCE_BUDGETS;

/**
 * Checks a metric value against the performance budget and warns in dev.
 */
function checkBudget(name: MetricName, value: number): void {
  if (process.env.NODE_ENV !== "development") return;

  const budget = PERFORMANCE_BUDGETS[name];
  if (value > budget.poor) {
    console.warn(`[WebVitals] ⚠️ ${name} is POOR: ${value} (budget: ${budget.poor})`);
  } else if (value > budget.good) {
    console.info(`[WebVitals] 🟡 ${name} needs improvement: ${value} (budget: ${budget.good})`);
  } else {
    console.info(`[WebVitals] ✅ ${name} is GOOD: ${value}`);
  }
}

/**
 * Registers all Core Web Vitals observers and pipes metrics to analytics.
 * Call once at app initialization (e.g. in layout.tsx via a client component).
 */
export function reportWebVitals(): void {
  const report = (metric: Parameters<typeof sendToAnalytics>[0]) => {
    checkBudget(metric.name as MetricName, metric.value);
    sendToAnalytics(metric);
  };

  onCLS(report);
  onFCP(report);
  onINP(report);
  onLCP(report);
  onTTFB(report);
}
