import type { Metadata } from "next";
import { Suspense } from "react";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { Section } from "@/components/ui/Section";
import { roles } from "@/lib/careers";
import { getFamily } from "@/lib/services";

export const metadata: Metadata = {
  title: "Careers",
  description: `Join Physarum. Open roles: ${roles.map((r) => r.title).join(", ")}.`,
  alternates: { canonical: "/careers" },
};

const reasons = [
  { title: "Real work, real impact", body: "Client products, AI systems and growth campaigns that ship — not internal busywork." },
  { title: "AI at the frontier", body: "Work on the data and evaluations that train and test frontier models, and the automations that put them to use." },
  { title: "Learn across disciplines", body: "Developers, AI trainers and marketers work side by side, so you pick up more than your own specialism." },
  { title: "Ownership from day one", body: "Small teams, clear responsibility, and room to make decisions." },
  { title: "Remote-friendly", body: "Work from where you do your best work, with clear communication and realistic timelines." },
  { title: "Plain English, no politics", body: "We say what we mean, give direct feedback, and credit good work." },
];

const process = [
  { title: "Apply", body: "Send your CV and a few lines about what you’ve built or worked on." },
  { title: "Short call", body: "A 30-minute conversation about you, the role and how we work." },
  { title: "Practical task", body: "A short, realistic task close to the actual job — no trick questions." },
  { title: "Offer", body: "Clear terms, a start date, and a proper welcome." },
];

export default function CareersPage() {
  return (
    <>
      <header className="mx-auto max-w-7xl px-4 pt-20 pb-6 md:px-8 md:pt-28">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">Careers</p>
        <h1 className="mt-4 max-w-4xl text-5xl leading-[1.05] font-semibold tracking-tight md:text-7xl">Help us find the path.</h1>
        <p className="mt-6 max-w-2xl text-xl text-muted">
          We’re building a team of engineers, AI specialists and marketers who like hard problems and clear thinking. If
          that’s you, we’d like to hear from you.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#roles" className="rounded-full bg-fg px-6 py-3 font-medium text-bg transition hover:opacity-85">
            See open roles
          </a>
          <a href="#apply" className="rounded-full border border-line px-6 py-3 font-medium transition hover:border-fg">
            Apply now
          </a>
        </div>
        <span data-trail-start className="mt-10 block size-1" />
      </header>

      <Section eyebrow="Why Physarum" title="Like the organism: explore widely, keep what works.">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="border-t border-line pt-5">
              <h3 className="text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 text-muted">{r.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="roles" eyebrow="Open roles" title={`${roles.length} open positions`} className="scroll-mt-16">
        <div className="grid gap-4">
          {roles.map((r) => (
            <details key={r.slug} id={r.slug} className="group scroll-mt-24 rounded-2xl border border-line bg-card open:border-fg/30">
              <summary className="flex cursor-pointer list-none flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between md:p-8 [&::-webkit-details-marker]:hidden">
                <div>
                  <p className="font-mono text-[11px] tracking-widest text-muted uppercase">{getFamily(r.family)?.name}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">{r.title}</h3>
                  <p className="mt-2 max-w-2xl text-muted">{r.summary}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm">
                  <span className="rounded-full border border-line px-3 py-1 text-muted">{r.type}</span>
                  <span className="rounded-full border border-line px-3 py-1 text-muted">{r.location}</span>
                  <span className="grid size-9 place-items-center rounded-full border border-line transition group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </div>
              </summary>
              <div className="grid gap-8 border-t border-line p-6 md:grid-cols-3 md:p-8">
                {[
                  { h: "What you’ll do", items: r.youWill },
                  { h: "What you bring", items: r.youHave },
                  { h: "Nice to have", items: r.niceToHave },
                ].map((col) => (
                  <div key={col.h}>
                    <h4 className="font-mono text-xs tracking-widest text-muted uppercase">{col.h}</h4>
                    <ul className="mt-4 space-y-3 text-sm">
                      {col.items.map((i) => (
                        <li key={i} className="flex gap-3">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-mold" aria-hidden="true" />
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="md:col-span-3">
                  <a
                    href={`?role=${r.slug}#apply`}
                    className="inline-block rounded-full bg-fg px-6 py-3 font-medium text-bg transition hover:opacity-85"
                  >
                    Apply for this role
                  </a>
                </div>
              </div>
            </details>
          ))}
        </div>
        <p className="mt-8 text-muted">
          Don’t see your role? Send a general application — we’re always glad to meet good people.
        </p>
      </Section>

      <Section eyebrow="How hiring works" title="Four steps, no surprises.">
        <ol className="grid gap-4 md:grid-cols-4">
          {process.map((p, i) => (
            <li key={p.title} className="rounded-2xl border border-line p-6">
              <span className="font-mono text-xs text-muted">0{i + 1}</span>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="apply" eyebrow="Apply" title="Tell us about yourself." className="scroll-mt-16" narrow>
        <Suspense>
          <ApplicationForm />
        </Suspense>
      </Section>
    </>
  );
}
