import Link from "next/link";
import { GrowingMark } from "@/components/brand/GrowingMark";
import { HowWeWork } from "@/components/home/HowWeWork";
import { MazeMold } from "@/components/hero/MazeMold";
import { IntroSequence } from "@/components/intro/IntroSequence";
import { ServiceHero } from "@/components/hero/ServiceHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { Section } from "@/components/ui/Section";
import { CaseCard } from "@/components/work/CaseCard";
import { families, servicesByFamily } from "@/lib/services";
import { caseStudies } from "@/lib/work";

const principles = [
  {
    title: "One team, end to end",
    body: "Data, models, product and growth under one roof — so nothing gets lost between vendors.",
  },
  {
    title: "Measured, not assumed",
    body: "Every engagement ships with the evals, analytics or QA reports that show it worked.",
  },
  {
    title: "Confidential by default",
    body: "NDAs as standard, least-privilege access to your data, and work we never reuse without permission.",
  },
  {
    title: "Distributed across time zones",
    body: "A team that has delivered for clients worldwide, so work keeps moving while you sleep.",
  },
];

export default function Home() {
  return (
    <>
      <IntroSequence />
      <section className="relative overflow-hidden pt-14 pb-16 md:pt-20 md:pb-24">
        <MazeMold className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_50%_45%,#000_45%,transparent_92%)]" />
        <div className="relative">
          <GrowingMark data-maze-start className="mx-auto mb-10 h-16 w-auto text-fg md:h-20" />
          <ServiceHero />
          <div className="mt-10 flex flex-wrap justify-center gap-3 px-4">
            <Link href="/contact" className="rounded-full bg-fg px-6 py-3 font-medium text-bg transition hover:opacity-85">
              Start a project
            </Link>
            <Link href="/work" className="rounded-full border border-line px-6 py-3 font-medium transition hover:border-fg">
              See our work
            </Link>
          </div>
          <span data-trail-start className="mx-auto mt-14 block size-1" />
        </div>
      </section>

      <Section
        eyebrow="Proven paths"
        title="Work across data, product and growth."
        intro="Much of our AI work is under NDA, so some clients appear by description rather than name."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((c) => (
            <CaseCard key={c.slug} c={c} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="How we work"
        title="Explore every route. Keep the one that works."
        intro="Physarum polycephalum finds the shortest path through a maze with no map: it spreads, abandons dead ends and reinforces the best route. That’s our process too."
      >
        <HowWeWork />
      </Section>

      <Section eyebrow="Capabilities" title="Eight services, five ways in.">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {families.map((f) => (
            <Link key={f.slug} href={`/services/${f.slug}`} className="group bg-bg p-6 transition hover:bg-card md:p-8">
              <h3 className="text-2xl font-semibold tracking-tight">{f.name}</h3>
              <p className="mt-2 text-sm text-muted">{f.tagline}</p>
              <ul className="mt-6 space-y-2">
                {servicesByFamily(f.slug).map((s) => (
                  <li key={s.slug} className="border-t border-line pt-2">
                    {s.name}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted group-hover:text-fg">Explore {f.name} →</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Why Physarum" title="Built like the organism: decentralised, adaptive, efficient.">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="border-t border-line pt-5">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
