"use client";

import { WalletConnector } from "@/components/WalletConnector";
import { useRateLimit } from "@/hooks/useRateLimit";

export default function TipsPage() {
  const { remaining, limit, isLimited, countdownLabel } = useRateLimit();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Send a Tip</h1>
        <p className="mt-2 max-w-2xl text-ink/75">
          This is a placeholder flow. The final experience will connect your wallet, create a tip
          intent via API, and submit a Stellar transaction.
        </p>
      </div>

      <div className="rounded-3xl border border-ink/10 bg-[color:var(--surface)] p-6 shadow-card sm:p-8">
        <h2 className="text-xl font-semibold text-ink">Wallet Connection Placeholder</h2>
        <p className="mt-2 text-sm text-ink/70">
          Connect button currently uses local state only. Replace with real wallet provider logic in
          <code className="mx-1 rounded bg-ink/5 px-1.5 py-0.5 text-xs">src/hooks/useWallet.ts</code>.
        </p>
        <div className="mt-4">
          <WalletConnector />
        </div>

        <div className="mt-4 rounded-xl border border-ink/10 bg-ink/[0.02] p-4 text-sm text-ink/75">
          <p>
            API usage: {limit - remaining}/{limit} requests in the current minute.
          </p>
          <p className={isLimited ? "mt-1 text-red-600" : "mt-1 text-emerald-700"}>
            {isLimited
              ? `Rate limit reached. Try again in ${countdownLabel}.`
              : "Requests are currently within limits."}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-ink">
            Creator Username
            <input
              disabled
              placeholder="alice"
              className="mt-1 w-full rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm text-ink/70"
            />
          </label>
          <label className="text-sm font-medium text-ink">
            Amount
            <input
              disabled
              placeholder="10"
              className="mt-1 w-full rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm text-ink/70"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
