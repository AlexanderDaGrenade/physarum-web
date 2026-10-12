import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell us about your project. We reply within one business day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-16 px-4 pt-20 pb-28 md:grid-cols-[1fr_1.4fr] md:px-8 md:pt-28">
      <div>
        <p className="font-mono text-xs tracking-widest text-muted uppercase">Contact</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-6xl">Start a project</h1>
        <p className="mt-6 text-lg text-muted">
          Five quick questions, then pick a time to talk. We reply within one business day — and we’re happy to sign an
          NDA before you share details.
        </p>
        {site.contactEmail && (
          <p className="mt-8 text-sm text-muted">
            Prefer email?{" "}
            <a href={`mailto:${site.contactEmail}`} className="text-fg underline underline-offset-4">
              {site.contactEmail}
            </a>
          </p>
        )}
      </div>
      {site.preview ? (
        <div className="self-start rounded-2xl border border-line bg-card p-8">
          <p className="text-lg font-semibold">This is a preview build.</p>
          <p className="mt-2 text-muted">The project form is switched off here and goes live with the production site.</p>
        </div>
      ) : (
        <ContactForm />
      )}
    </div>
  );
}
