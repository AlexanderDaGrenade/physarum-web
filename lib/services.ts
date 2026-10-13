export type FamilySlug =
  | "ai-llm-solutions"
  | "custom-software-mobile-apps"
  | "web-development-services"
  | "digital-marketing-seo"
  | "social-media-paid-advertising";

export type Service = {
  slug: string;
  name: string;
  family: FamilySlug;
  summary: string;
  deliverables: string[];
};

/** A service category: the top-level grouping used across the site. */
export type Family = {
  slug: FamilySlug;
  name: string;
  /** Compact label for tight spaces (intro animation on phones). */
  shortName: string;
  /** Last word of the hero line "Intelligence that navigates ___". */
  headlineWord: string;
  tagline: string;
  intro: string;
};

// Order matters: the intro, hero carousel, menus, footer and pages all follow this order.
export const families: Family[] = [
  {
    slug: "ai-llm-solutions",
    name: "AI & LLM Solutions",
    shortName: "AI & LLM",
    headlineWord: "AI & LLMs",
    tagline: "Automation, fine-tuning data and evaluation for capable models.",
    intro:
      "We automate real work with AI, and build the fine-tuning datasets and benchmarks that tell you what a model can really do.",
  },
  {
    slug: "custom-software-mobile-apps",
    name: "Custom Software & Mobile Apps",
    shortName: "Software & Mobile",
    headlineWord: "Software",
    tagline: "Custom software and mobile apps, AI built in where it earns its place.",
    intro:
      "From first prototype to production, we design and engineer software and mobile apps that people actually use.",
  },
  {
    slug: "web-development-services",
    name: "Web Development Services",
    shortName: "Web Development",
    headlineWord: "the Web",
    tagline: "Fast, accessible websites and web apps.",
    intro: "Marketing sites, web apps, dashboards and e-commerce — built fast, accessible and easy to maintain.",
  },
  {
    slug: "digital-marketing-seo",
    name: "Digital Marketing & SEO",
    shortName: "Marketing & SEO",
    headlineWord: "Search",
    tagline: "Get found, get chosen, get measured.",
    intro: "Technical SEO, content and conversion work that compounds month over month — tied to numbers you can read.",
  },
  {
    slug: "social-media-paid-advertising",
    name: "Social Media & Paid Advertising",
    shortName: "Social & Ads",
    headlineWord: "Social",
    tagline: "Organic social and paid campaigns, managed against results.",
    intro: "Social content and paid campaigns on Meta and beyond, run against cost per result rather than likes.",
  },
];

export const services: Service[] = [
  {
    slug: "software-applications",
    name: "Software Applications",
    family: "custom-software-mobile-apps",
    summary:
      "Custom software and SaaS products, from internal tools to AI-powered platforms — built to be maintained.",
    deliverables: [
      "Product discovery and UX design",
      "SaaS platforms and internal tools",
      "AI-powered features: copilots, retrieval, generation",
      "APIs, integrations and data pipelines",
      "Testing, CI/CD and handover",
    ],
  },
  {
    slug: "ai-automation",
    name: "AI Automation",
    family: "ai-llm-solutions",
    summary:
      "Agents and workflows that take repetitive work off your team — integrated with the tools you already run.",
    deliverables: [
      "Process audit and automation roadmap",
      "LLM agents and tool integrations",
      "Document and inbox automation",
      "Monitoring and human-in-the-loop review",
    ],
  },
  {
    slug: "web-services",
    name: "Web Services",
    family: "web-development-services",
    summary: "Fast, accessible websites and web apps — from marketing sites to dashboards and e-commerce.",
    deliverables: [
      "Websites and landing pages",
      "Web apps and dashboards (React / Next.js)",
      "E-commerce builds",
      "Hosting, performance and maintenance",
    ],
  },
  {
    slug: "mobile-applications",
    name: "Mobile Applications",
    family: "custom-software-mobile-apps",
    summary: "iOS and Android apps, cross-platform or native, from first build to store launch.",
    deliverables: [
      "iOS and Android (React Native / native)",
      "App Store and Play Store release",
      "Push, payments and analytics",
      "Ongoing maintenance",
    ],
  },
  {
    slug: "digital-marketing-seo",
    name: "Digital Marketing & SEO",
    family: "digital-marketing-seo",
    summary: "Technical SEO, content and conversion work that compounds month over month.",
    deliverables: [
      "Technical SEO audits and fixes",
      "Content strategy and production",
      "Local and international SEO",
      "Analytics and conversion tracking",
    ],
  },
  {
    slug: "social-media-meta-ads",
    name: "Social Media & Meta Ads",
    family: "social-media-paid-advertising",
    summary: "Organic social and paid campaigns on Meta and beyond, managed against cost per result.",
    deliverables: [
      "Social strategy and content calendars",
      "Meta (Facebook & Instagram) ads",
      "Creative testing",
      "Reporting on spend and return",
    ],
  },
  {
    slug: "llm-fine-tuning-datasets",
    name: "LLM Fine-Tuning Datasets",
    family: "ai-llm-solutions",
    summary:
      "Expert-written SFT, preference and reasoning datasets across domains and languages, with QA you can audit.",
    deliverables: [
      "Supervised fine-tuning datasets",
      "RLHF / preference pairs",
      "Multi-step reasoning & tool-use traces",
      "Multilingual and domain-expert annotation",
      "Inter-annotator agreement and QA reports",
    ],
  },
  {
    slug: "llm-benchmarking-evaluation",
    name: "LLM Benchmarking & Evaluation",
    family: "ai-llm-solutions",
    summary:
      "Private benchmarks, rubrics and eval harnesses that turn “seems better” into a number you can ship on.",
    deliverables: [
      "Custom, contamination-resistant benchmarks",
      "Agentic and long-horizon tasks",
      "Rubric and grader design, human and LLM-as-judge",
      "Automated eval harnesses and release regression suites",
      "Leaderboards and model comparisons",
    ],
  },
];

export const servicesByFamily = (slug: FamilySlug) => services.filter((s) => s.family === slug);

export const getFamily = (slug: string) => families.find((f) => f.slug === slug);

export const serviceHref = (s: Service) => `/services/${s.family}#${s.slug}`;

export const budgetRanges = [
  "Under $5k",
  "$5k – $15k",
  "$15k – $50k",
  "$50k+",
  "Not sure yet",
] as const;
