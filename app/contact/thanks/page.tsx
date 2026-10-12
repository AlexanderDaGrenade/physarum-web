import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Thanks", robots: { index: false } };

export default function ThanksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-20 pb-28 md:px-8 md:pt-28">
      <p className="font-mono text-xs tracking-widest text-muted uppercase">Brief received</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight">Thanks — we’re on it.</h1>
      {site.calLink ? (
        <>
          <p className="mt-6 text-lg text-muted">Want to skip the back-and-forth? Pick a time for a 30-minute call.</p>
          <iframe
            src={`https://cal.com/${site.calLink}?embed=true&theme=auto`}
            title="Book a call with Physarum"
            className="mt-10 h-[720px] w-full rounded-2xl border border-line bg-card"
            loading="lazy"
          />
        </>
      ) : (
        <p className="mt-6 text-lg text-muted">We’ll reply within one business day to set up a call.</p>
      )}
    </div>
  );
}
