import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/site/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a project",
  description: `Tell us about your project. We reply within one business day. Or email ${site.contactEmail}.`,
  alternates: { canonical: "/contact" },
};

const steps = [
  { title: "We reply within one business day", body: "A real person reads every brief — no automated sales sequence." },
  { title: "A free call or audit", body: "We dig into the problem, ask the awkward questions, and tell you plainly what we’d do." },
  { title: "A fixed proposal", body: "Scope, timeline and a fixed budget agreed upfront. You own everything we build." },
];

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-16 px-4 pt-20 pb-28 md:grid-cols-[1fr_1.3fr] md:px-8 md:pt-28">
      <div>
        <p className="font-mono text-xs tracking-widest text-muted uppercase">Start a project</p>
        <h1 className="mt-4 text-5xl leading-[1.05] font-semibold tracking-tight md:text-6xl">Tell us where you’re trying to get to.</h1>
        <p className="mt-6 text-lg text-muted">
          A few quick questions and we’ll find the path. Happy to sign an NDA before you share details.
        </p>

        <ol className="mt-12 space-y-6">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line font-mono text-xs text-muted">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-2xl border border-line p-6">
          <p className="text-sm text-muted">Prefer email?</p>
          <a href={`mailto:${site.contactEmail}`} className="mt-1 inline-block text-xl font-medium hover:text-mold">
            {site.contactEmail}
          </a>
        </div>
      </div>

      <Suspense>
        <ContactForm />
      </Suspense>
    </div>
  );
}
