"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { families, type FamilySlug } from "@/lib/services";
import { caseStudies } from "@/lib/work";
import { CaseCard } from "./CaseCard";

export function WorkGrid() {
  const [filter, setFilter] = useState<FamilySlug | "all">("all");
  const shown = filter === "all" ? caseStudies : caseStudies.filter((c) => c.family === filter);
  const tabs = [{ slug: "all" as const, name: "All" }, ...families];

  return (
    <Section eyebrow="Case studies">
      <div role="group" aria-label="Filter by service family" className="mb-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.slug}
            type="button"
            aria-pressed={filter === t.slug}
            onClick={() => setFilter(t.slug)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              filter === t.slug ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <CaseCard key={c.slug} c={c} />
        ))}
      </div>
    </Section>
  );
}
