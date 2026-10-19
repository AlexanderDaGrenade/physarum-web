import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SavingsQuiz } from "@/components/services/SavingsQuiz";
import { CtaBand } from "@/components/ui/CtaBand";
import { Section } from "@/components/ui/Section";
import { CaseCard } from "@/components/work/CaseCard";
import { families, getFamily, servicesByFamily } from "@/lib/services";
import { caseStudiesFor } from "@/lib/work";

type Props = { params: Promise<{ family: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => families.map((f) => ({ family: f.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = getFamily((await params).family);
  if (!f) return {};
  const names = servicesByFamily(f.slug).map((s) => s.name).join(", ");
  return {
    title: f.name,
    description: `${f.intro} ${names}.`,
    alternates: { canonical: `/services/${f.slug}` },
  };
}

export default async function FamilyPage({ params }: Props) {
  const f = getFamily((await params).family);
  if (!f) notFound();
  const items = servicesByFamily(f.slug);
  const work = caseStudiesFor(f.slug);
  const quiz = f.slug === "ai-automation-agents";

  return (
    <>
      <header className="mx-auto max-w-7xl px-4 pt-20 pb-6 md:px-8 md:pt-28">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">{f.name}</p>
        <h1 className="mt-4 max-w-5xl text-5xl leading-[1.05] font-semibold tracking-tight md:text-7xl">{f.headline}</h1>
        <p className="mt-6 max-w-2xl text-xl text-muted">{f.intro}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-full bg-fg px-6 py-3 font-medium text-bg transition hover:opacity-85">
            {f.cta.label}
          </Link>
          {quiz && (
            <a href="#savings" className="rounded-full border border-line px-6 py-3 font-medium transition hover:border-fg">
              Calculate your savings
            </a>
          )}
        </div>
        <nav aria-label={`${f.name} services`} className="mt-10 flex flex-wrap gap-2">
          {items.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-fg hover:text-fg">
              {s.name}
            </a>
          ))}
        </nav>
        <span data-trail-start className="mt-10 block size-1" />
      </header>

      <Section eyebrow="The problems we solve" title="What usually goes wrong — and what we do instead.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {f.problems.map((p) => (
            <div key={p.title} className="rounded-2xl border border-line p-6">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-3 text-muted">{p.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      {f.comparison && (
        <Section eyebrow="The old way vs. our way" title="Measured on what matters.">
          <div className="overflow-hidden rounded-2xl border border-line">
            <div className="grid grid-cols-3 border-b border-line bg-card font-mono text-xs tracking-widest text-muted uppercase">
              <span className="p-4 md:p-5">Area</span>
              <span className="p-4 md:p-5">The old way</span>
              <span className="p-4 text-fg md:p-5">Our way</span>
            </div>
            {f.comparison.map((c) => (
              <div key={c.area} className="grid grid-cols-3 border-b border-line last:border-b-0">
                <span className="p-4 font-medium md:p-5">{c.area}</span>
                <span className="p-4 text-muted line-through decoration-muted/40 md:p-5">{c.old}</span>
                <span className="p-4 md:p-5">{c.ours}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section eyebrow="What we offer" title={`${f.name} services`}>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((s) => (
            <article key={s.slug} id={s.slug} className="scroll-mt-24 rounded-2xl border border-line bg-card p-6 md:p-8">
              <h3 className="text-2xl font-semibold tracking-tight">{s.name}</h3>
              <p className="mt-3 text-muted">{s.summary}</p>
              <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-mold" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {quiz && (
        <Section id="savings" eyebrow="Calculate your savings" title="How many hours could AI save you?" intro="Four quick questions. No email needed." className="scroll-mt-16">
          <SavingsQuiz />
        </Section>
      )}

      <Section eyebrow="What makes us different" title="Why teams choose Physarum.">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {f.difference.map((d) => (
            <div key={d.title} className="border-t border-line pt-5">
              <h3 className="text-lg font-semibold">{d.title}</h3>
              <p className="mt-2 text-muted">{d.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {work.length > 0 && (
        <Section eyebrow="Proven paths" title={`${f.name} in practice`}>
          <div className="grid gap-4 md:grid-cols-2">
            {work.map((c) => (
              <CaseCard key={c.slug} c={c} />
            ))}
          </div>
          <Link href="/work" className="mt-8 inline-block text-sm text-muted hover:text-fg">
            All work →
          </Link>
        </Section>
      )}

      <CtaBand title={f.cta.title} body={f.cta.body} label={f.cta.label} />
    </>
  );
}
