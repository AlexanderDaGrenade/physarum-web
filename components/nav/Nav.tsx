"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { families, serviceHref, servicesByFamily } from "@/lib/services";

const links = [
  { href: "/work", label: "Work" },
  { href: "/company", label: "Company" },
  { href: "/careers", label: "Careers" },
];

export function Nav() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const close = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8" aria-label="Main">
        <Link href="/" className="text-fg" aria-label="Physarum home">
          <Logo className="h-5 w-auto md:h-6" />
        </Link>

        <div className="hidden items-center gap-8 text-sm md:flex">
          <div onMouseEnter={open} onMouseLeave={close}>
            <button
              type="button"
              className="flex items-center gap-1 text-muted transition hover:text-fg"
              aria-expanded={megaOpen}
              aria-controls="mega-menu"
              onClick={() => setMegaOpen((v) => !v)}
            >
              Services
              <svg viewBox="0 0 12 12" className={`size-3 transition ${megaOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m3 4.5 3 3 3-3" />
              </svg>
            </button>
            <div
              id="mega-menu"
              hidden={!megaOpen}
              onClick={(e) => (e.target as HTMLElement).closest("a") && setMegaOpen(false)}
              className="absolute inset-x-0 top-16 border-b border-line bg-bg"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-5 gap-8 px-8 py-10">
                {families.map((f) => (
                  <div key={f.slug}>
                    <Link href={`/services/${f.slug}`} className="group mb-4 block">
                      <span className="font-mono text-xs tracking-widest text-muted uppercase group-hover:text-mold">
                        {f.name}
                      </span>
                      <span className="mt-1 block text-sm text-muted">{f.tagline}</span>
                    </Link>
                    <ul className="space-y-2">
                      {servicesByFamily(f.slug).map((s) => (
                        <li key={s.slug}>
                          <Link href={serviceHref(s)} className="text-base text-fg transition hover:text-mold">
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition hover:text-fg ${pathname.startsWith(l.href) ? "text-fg" : "text-muted"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition hover:opacity-85 sm:inline-block"
          >
            Start a project
          </Link>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-line md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              {mobileOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!mobileOpen}
        onClick={(e) => (e.target as HTMLElement).closest("a") && setMobileOpen(false)}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-bg md:hidden">
        <div className="space-y-8 px-4 py-8">
          {families.map((f) => (
            <div key={f.slug}>
              <Link href={`/services/${f.slug}`} className="font-mono text-xs tracking-widest text-muted uppercase">
                {f.name}
              </Link>
              <ul className="mt-3 space-y-3">
                {servicesByFamily(f.slug).map((s) => (
                  <li key={s.slug}>
                    <Link href={serviceHref(s)} className="text-lg">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex flex-col gap-3 border-t border-line pt-6 text-lg">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/contact" className="block rounded-full bg-fg px-4 py-3 text-center font-medium text-bg">
            Start a project
          </Link>
        </div>
      </div>
    </header>
  );
}
