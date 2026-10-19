import Link from "next/link";
import { getFamily } from "@/lib/services";
import type { CaseStudy } from "@/lib/work";

export function CaseCard({ c }: { c: CaseStudy }) {
  return (
    <Link
      href={`/work/${c.slug}`}
      className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-card p-6 transition hover:border-mold hover:bg-card-hover"
    >
      <div className="flex items-center justify-between gap-3 font-mono text-[11px] tracking-widest text-muted uppercase">
        <span>{getFamily(c.family)?.name}</span>
        {c.draft ? (
          <span className="rounded-full border border-line px-2 py-0.5 normal-case tracking-normal">Draft</span>
        ) : c.beforePhysarum ? (
          <span className="rounded-full border border-line px-2 py-0.5 normal-case tracking-normal">Before Physarum</span>
        ) : null}
      </div>
      <div className="mt-10">
        <h3 className="text-xl leading-snug font-semibold tracking-tight">{c.title}</h3>
        <p className="mt-3 text-sm text-muted">{c.outcome}</p>
        <p className="mt-6 text-sm">
          {c.client}
          <span className="ml-2 inline-block transition group-hover:translate-x-1">→</span>
        </p>
      </div>
    </Link>
  );
}
