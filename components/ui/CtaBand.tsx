import Link from "next/link";

export function CtaBand({
  title = "Have a maze for us?",
  body = "Tell us where you’re trying to get to. We’ll reply within one business day with how we’d approach it.",
  label = "Start a project",
}: {
  title?: string;
  body?: string;
  label?: string;
}) {
  return (
    <section data-trail-section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <div className="rounded-3xl border border-line bg-card px-6 py-14 text-center md:px-16 md:py-20">
        <span data-trail-node className="mx-auto mb-6 block size-2 rounded-full border border-muted max-md:opacity-0" />
        <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">{body}</p>
        <Link href="/contact" className="mt-8 inline-block rounded-full bg-fg px-6 py-3 font-medium text-bg transition hover:opacity-85">
          {label}
        </Link>
      </div>
    </section>
  );
}
