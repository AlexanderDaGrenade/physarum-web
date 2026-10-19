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
    title: "Fine-tuning data for frontier model training",
    client: "AI training partner (under NDA)",
    anonymized: true,
    family: "ai-training-evaluation",
    services: ["fine-tuning-datasets", "quality-control"],
    outcome: "Expert-written prompts, responses and reasoning traces, reviewed in multiple stages before delivery.",
    draft: false,
  },
  {
    slug: "private-coding-benchmark",
    title: "A private benchmark for agentic coding",
    client: "AI training partner (under NDA)",
    anonymized: true,
    family: "ai-training-evaluation",
    services: ["benchmarks-agentic-tasks", "model-evaluation", "quality-control"],
    outcome: "Containerised agentic tasks with hardened verifiers, validated reference solutions and multi-run model evaluations.",
    draft: false,
  },
  {
    slug: "support-inbox-automation",
    title: "Automating a support inbox end to end",
    client: "E-commerce operator",
    anonymized: true,
    family: "ai-automation-agents",
    services: ["workflow-automation", "ai-chatbots"],
    outcome: "An LLM triage-and-draft workflow with human review, wired into the existing helpdesk.",
    draft: true,
  },
  {
    slug: "saas-analytics-platform",
    title: "An analytics platform rebuilt for speed",
    client: "B2B SaaS startup",
    anonymized: true,
    family: "saas-development",
    services: ["scalable-platforms", "websites-web-apps"],
    outcome: "A Next.js rebuild with a typed API layer and a design system the client's team now owns.",
    draft: true,
  },
  {
    slug: "document-copilot",
    title: "A copilot for long, messy documents",
    client: "Professional-services firm",
    anonymized: true,
    family: "web-mobile-apps",
    services: ["websites-web-apps", "cross-platform-apps"],
    outcome: "Retrieval over the firm's archive with citations, evals in CI, and a companion mobile app.",
    draft: true,
  },
  {
    slug: "local-search-growth",
    title: "From invisible to first page in local search",
    client: "Multi-location service business",
    anonymized: true,
    family: "seo-digital-marketing",
    services: ["seo", "paid-ads"],
    outcome: "Technical SEO fixes, location pages and Meta campaigns measured against booked calls.",
    draft: true,
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
export const caseStudiesFor = (family: FamilySlug) => caseStudies.filter((c) => c.family === family);
