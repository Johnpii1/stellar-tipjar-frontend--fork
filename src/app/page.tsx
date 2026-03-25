import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/Button";
import { SectionCard } from "@/components/SectionCard";
import { buildMetadata, websiteJsonLd } from "@/utils/seo";

export const metadata: Metadata = buildMetadata({
  title: "Stellar Tip Jar",
  description: "Support creators globally with low-fee Stellar tips.",
});

export default function Home() {
  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <section className="soft-grid overflow-hidden rounded-3xl border border-ink/10 bg-[color:var(--surface)] p-8 shadow-card sm:p-12">
        <span className="inline-flex rounded-full bg-wave/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-wave">
          Open Source + Stellar
        </span>
        <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Support creators globally with low-fee Stellar tips.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/75 sm:text-lg">
          Stellar Tip Jar helps communities send direct support to creators with modern blockchain
          payments. This starter frontend is built for contributors: clear structure, reusable UI,
          and room for wallet + backend integrations.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/explore">
            <Button>Explore Creators</Button>
          </Link>
          <Link href="/tips">
            <Button variant="secondary">Send a Tip</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SectionCard
          title="Creator Profiles"
          description="Dynamic profile pages like /creator/alice that can fetch data from your backend API."
          icon={<span className="text-lg">1</span>}
        />
        <SectionCard
          title="Wallet-Ready"
          description="A wallet placeholder hook and connector are included, ready for Freighter integration."
          icon={<span className="text-lg">2</span>}
        />
        <SectionCard
          title="Contributor Friendly"
          description="Simple folder boundaries (app, components, hooks, services, utils, styles)."
          icon={<span className="text-lg">3</span>}
        />
      </section>
    </div>
  );
}
