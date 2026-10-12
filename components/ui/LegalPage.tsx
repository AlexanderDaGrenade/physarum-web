export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 pt-20 pb-28 md:px-8 md:pt-28 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4 [&_p]:text-muted [&_ul]:mb-4 [&_ul]:space-y-1 [&_ul]:text-muted">
      <p className="mb-8 rounded-xl border border-mold/40 bg-mold-soft px-4 py-3 text-sm">
        Draft — to be reviewed and completed with Physarum’s registered legal entity before launch.
      </p>
      <h1 className="mb-8 text-4xl font-semibold tracking-tight">{title}</h1>
      {children}
    </article>
  );
}
