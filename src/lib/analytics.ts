import type { Metric } from "web-vitals";

export type AnalyticsMetric = {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType: string;
};

/**
 * Sends a Web Vitals metric to the analytics endpoint.
 * Uses sendBeacon when available for non-blocking delivery,
 * falls back to fetch with keepalive.
 */
export function sendToAnalytics(metric: Metric): void {
  const payload: AnalyticsMetric = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  };

  const body = JSON.stringify(payload);
  const url = "/api/analytics";

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, {
      body,
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    });
  }
}
