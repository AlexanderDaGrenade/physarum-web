import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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

  return (
    <>
      <header className="mx-auto max-w-7xl px-4 pt-20 pb-6 md:px-8 md:pt-28">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">Services</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">{f.name}</h1>
        <p className="mt-6 max-w-2xl text-xl text-muted">{f.intro}</p>
        <nav aria-label={`${f.name} services`} className="mt-10 flex flex-wrap gap-2">
          {items.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="rounded-full border border-line px-4 py-2 text-sm transition hover:border-fg">
              {s.name}
            </a>
          ))}
        </nav>
        <span data-trail-start className="mt-10 block size-1" />
      </header>

      {items.map((s) => (
        <Section key={s.slug} id={s.slug} eyebrow={f.name} title={s.name} intro={s.summary} className="scroll-mt-16">
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {s.deliverables.map((d) => (
              <li key={d} className="bg-bg p-5">
                {d}
              </li>
            ))}
          </ul>
        </Section>
      ))}

      {work.length > 0 && (
        <Section eyebrow="Related work" title={`${f.name} in practice`}>
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

      <CtaBand title={`Talk to us about ${f.name}`} />
    </>
  );
}
