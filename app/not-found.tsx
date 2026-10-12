import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-40 text-center">
      <p className="font-mono text-xs tracking-widest text-muted uppercase">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Dead end.</h1>
      <p className="mt-4 text-muted">Even the mold hits a few. Let’s find another route.</p>
      <Link href="/" className="mt-8 inline-block rounded-full bg-fg px-6 py-3 font-medium text-bg">
        Back home
      </Link>
    </div>
  );
}
