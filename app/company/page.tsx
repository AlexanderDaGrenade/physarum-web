import type { Metadata } from "next";
import { LogoMark } from "@/components/brand/Logo";
import { CtaBand } from "@/components/ui/CtaBand";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Company",
  description: "Why we named the company after a slime mold, and how that shapes the way we work.",
  alternates: { canonical: "/company" },
};

export default function CompanyPage() {
  return (
    <>
      <header className="mx-auto max-w-7xl px-4 pt-20 md:px-8 md:pt-28">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">Company</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
          Named after the organism that solves mazes without a map.
        </h1>
        <span data-trail-start className="mt-10 block size-1" />
      </header>

      <Section eyebrow="The name" title="Why Physarum?">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <div className="max-w-2xl space-y-5 text-lg text-muted">
            <p>
              <em>Physarum polycephalum</em> is a single-celled slime mold with no brain and no plan. Put it at the
              entrance of a maze with food at the exit, and it spreads into every corridor, withdraws from the dead
              ends, and leaves behind the shortest path.
            </p>
            <p>
              Researchers have watched it rebuild efficient transport networks from scratch. We think that’s the right
              way to approach hard problems: explore widely, measure honestly, and commit to what works.
            </p>
          </div>
          <LogoMark className="h-40 w-auto text-fg md:h-56" />
        </div>
      </Section>

      <Section eyebrow="The team" title="Builders, annotators, engineers and marketers.">
        <p className="max-w-2xl text-lg text-muted">
          Physarum brings together a team that has spent years delivering AI data, software and growth work for
          clients around the world — now under one name.
        </p>
      </Section>

      <CtaBand title="Work with us" />
    </>
  );
}
