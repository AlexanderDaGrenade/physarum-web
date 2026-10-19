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
    title: "Clear pricing, no hidden bills",
    body: "A fixed budget agreed upfront, so you know what you’ll pay before we start.",
  },
  {
    title: "You own the code",
    body: "Everything we build is yours from day one — code, data and designs.",
  },
  {
    title: "Plain English, weekly updates",
    body: "No tech jargon. Realistic timelines and a progress update every week.",
  },
  {
    title: "Support after launch",
    body: "We stay on to fix bugs, ship updates and keep things running.",
  },
  {
    title: "Measured, not assumed",
    body: "Every project ships with the tests, evaluations or dashboards that show it worked.",
  },
  {
    title: "Confidential by default",
    body: "NDAs as standard and least-privilege access to your data.",
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
        title="From the client’s problem to their result."
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

      <Section eyebrow="What we do" title="Five ways we help you grow.">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {families.map((f) => (
            <Link key={f.slug} href={`/services/${f.slug}`} className="group bg-bg p-6 transition hover:bg-card md:p-8">
              <h3 className="text-xl font-semibold tracking-tight">{f.name}</h3>
              <p className="mt-2 text-sm text-muted">{f.tagline}</p>
              <ul className="mt-6 space-y-2">
                {servicesByFamily(f.slug).map((s) => (
                  <li key={s.slug} className="border-t border-line pt-2">
                    {s.name}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted group-hover:text-fg">Explore →</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Calculate your savings" title="How many hours could AI save your team?">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-line bg-card p-6 md:flex-row md:items-center md:p-10">
          <p className="max-w-xl text-lg text-muted">
            Answer four quick questions and get an instant estimate of the time AI automation could give back to your business
            every week.
          </p>
          <Link
            href="/services/ai-automation-agents#savings"
            className="shrink-0 rounded-full bg-fg px-6 py-3 font-medium text-bg transition hover:opacity-85"
          >
            Take the 1-minute quiz
          </Link>
        </div>
      </Section>

      <Section eyebrow="Why Physarum" title="No tech jargon. No hidden bills. No surprises.">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
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
