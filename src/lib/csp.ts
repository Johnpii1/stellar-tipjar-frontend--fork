/**
 * Content Security Policy configuration.
 *
 * Directives are intentionally strict. The only loosened rules are:
 *  - `script-src 'unsafe-eval'`  – required by Next.js dev HMR and some Stellar SDK internals
 *  - `style-src 'unsafe-inline'` – required by Tailwind's runtime style injection
 *
 * In production you can tighten these further by adopting nonce-based CSP
 * once the app no longer relies on inline styles/eval.
 */

const STELLAR_HORIZON_MAINNET = "https://horizon.stellar.org";
const STELLAR_HORIZON_TESTNET = "https://horizon-testnet.stellar.org";
const STELLAR_FRIENDBOT = "https://friendbot.stellar.org";

/** Derive the runtime API origin from the env var (falls back to localhost). */
function getApiOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  try {
    return new URL(raw).origin;
  } catch {
    return raw;
  }
}

export function buildCspHeader(): string {
  const apiOrigin = getApiOrigin();

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      // Required by Next.js (HMR in dev, chunk loading in prod)
      "'unsafe-eval'",
      "'unsafe-inline'",
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'"],
    "connect-src": [
      "'self'",
      apiOrigin,
      STELLAR_HORIZON_MAINNET,
      STELLAR_HORIZON_TESTNET,
      STELLAR_FRIENDBOT,
    ],
    "frame-src": ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([key, values]) => (values.length ? `${key} ${values.join(" ")}` : key))
    .join("; ");
}
