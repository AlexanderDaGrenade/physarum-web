import type { Metadata } from "next";
import { CtaBand } from "@/components/ui/CtaBand";
import { WorkGrid } from "@/components/work/WorkGrid";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies across AI data and evals, web and mobile products, and search and social growth.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <header className="mx-auto max-w-7xl px-4 pt-20 pb-4 md:px-8 md:pt-28">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">Work</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">Paths we’ve found.</h1>
        <p className="mt-6 max-w-2xl text-xl text-muted">
          Much of our work is under NDA, so clients appear by description rather than name. Projects marked “Before Physarum”
          were delivered by our team before the company was founded.
        </p>
        <span data-trail-start className="mt-10 block size-1" />
      </header>
      <WorkGrid />
      <CtaBand />
    </>
  );
}
