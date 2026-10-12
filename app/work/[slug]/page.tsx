import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/ui/CtaBand";
import { Section } from "@/components/ui/Section";
import { getFamily, services } from "@/lib/services";
import { caseStudies, getCaseStudy } from "@/lib/work";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => caseStudies.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCaseStudy((await params).slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.outcome,
    alternates: { canonical: `/work/${c.slug}` },
    // Drafts are not real engagements; keep them out of search results.
    robots: c.draft ? { index: false } : undefined,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) notFound();
  const { default: Body } = await import(`@/content/work/${slug}.mdx`);
  const used = services.filter((s) => c.services.includes(s.slug));

  return (
    <>
      <header className="mx-auto max-w-4xl px-4 pt-20 md:px-8 md:pt-28">
        <Link href="/work" className="font-mono text-xs tracking-widest text-muted uppercase hover:text-fg">
          ← Work
        </Link>
        {c.draft && (
          <p className="mt-6 rounded-xl border border-mold/40 bg-mold-soft px-4 py-3 text-sm">
            Draft case study — placeholder copy until the real brief is supplied.
          </p>
        )}
        <h1 className="mt-6 text-4xl leading-tight font-semibold tracking-tight md:text-6xl">{c.title}</h1>
        <p className="mt-6 text-xl text-muted">{c.outcome}</p>
        <dl className="mt-10 grid gap-6 border-t border-line pt-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">Client</dt>
            <dd className="mt-1">{c.client}</dd>
          </div>
          <div>
            <dt className="text-muted">Area</dt>
            <dd className="mt-1">{getFamily(c.family)?.name}</dd>
          </div>
          <div>
            <dt className="text-muted">Services</dt>
            <dd className="mt-1">{used.map((s) => s.name).join(", ")}</dd>
          </div>
        </dl>
        <span data-trail-start className="mt-10 block size-1" />
      </header>
      <Section eyebrow="Case study" narrow>
        <article>
          <Body />
        </article>
      </Section>
      <CtaBand />
    </>
  );
}
