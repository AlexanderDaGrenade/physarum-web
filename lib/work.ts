import type { FamilySlug } from "./services";

export type CaseStudy = {
  slug: string;
  title: string;
  /** Client name, or a description when the work is under NDA. */
  client: string;
  anonymized: boolean;
  family: FamilySlug;
  services: string[];
  outcome: string;
  /**
   * Draft entries are written from the services we offer, not from a real
   * engagement. They render with a "Draft" badge until replaced with a real
   * brief — never publish a draft as a client result.
   */
  draft: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "multilingual-reasoning-dataset",
    title: "Multilingual reasoning data for a foundation-model team",
    client: "AI research lab (under NDA)",
    anonymized: true,
    family: "ai-llm-solutions",
    services: ["llm-fine-tuning-datasets"],
    outcome: "Expert-written reasoning traces across languages, with agreement-scored QA on every batch.",
    draft: true,
  },
  {
    slug: "private-coding-benchmark",
    title: "A private benchmark for agentic coding",
    client: "AI evaluation company (under NDA)",
    anonymized: true,
    family: "ai-llm-solutions",
    services: ["llm-benchmarking-evaluation"],
    outcome: "Held-out, containerised tasks with deterministic graders, built to resist contamination.",
    draft: true,
  },
  {
    slug: "support-inbox-automation",
    title: "Automating a support inbox end to end",
    client: "E-commerce operator",
    anonymized: true,
    family: "ai-llm-solutions",
    services: ["ai-automation"],
    outcome: "An LLM triage-and-draft workflow with human review, wired into the existing helpdesk.",
    draft: true,
  },
  {
    slug: "saas-analytics-platform",
    title: "An analytics platform rebuilt for speed",
    client: "B2B SaaS startup",
    anonymized: true,
    family: "custom-software-mobile-apps",
    services: ["software-applications", "web-services"],
    outcome: "A Next.js rebuild with a typed API layer and a design system the client's team now owns.",
    draft: true,
  },
  {
    slug: "document-copilot",
    title: "A copilot for long, messy documents",
    client: "Professional-services firm",
    anonymized: true,
    family: "custom-software-mobile-apps",
    services: ["software-applications", "mobile-applications"],
    outcome: "Retrieval over the firm's archive with citations, evals in CI, and a companion mobile app.",
    draft: true,
  },
  {
    slug: "local-search-growth",
    title: "From invisible to first page in local search",
    client: "Multi-location service business",
    anonymized: true,
    family: "digital-marketing-seo",
    services: ["digital-marketing-seo", "social-media-meta-ads"],
    outcome: "Technical SEO fixes, location pages and Meta campaigns measured against booked calls.",
    draft: true,
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
export const caseStudiesFor = (family: FamilySlug) => caseStudies.filter((c) => c.family === family);
