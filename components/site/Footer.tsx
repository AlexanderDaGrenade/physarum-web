import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { families, serviceHref, servicesByFamily } from "@/lib/services";

const company = [
  { href: "/company", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 md:grid-cols-3 md:px-8 lg:grid-cols-6">
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
          <Logo className="h-6 w-auto text-fg" />
          <p className="mt-4 max-w-xs text-sm text-muted">
            Named after the slime mold that solves mazes without a map. We find the path through hard problems.
          </p>
        </div>
        {families.map((f) => (
          <div key={f.slug}>
            <Link href={`/services/${f.slug}`} className="font-mono text-xs tracking-widest text-muted uppercase hover:text-fg">
              {f.name}
            </Link>
            <ul className="mt-4 space-y-2 text-sm">
              {servicesByFamily(f.slug).map((s) => (
                <li key={s.slug}>
                  <Link href={serviceHref(s)} className="text-fg/80 hover:text-fg">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-line px-4 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between md:px-8">
        <p>© {new Date().getFullYear()} Physarum. All rights reserved.</p>
        <ul className="flex flex-wrap gap-5">
          {company.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-fg">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
