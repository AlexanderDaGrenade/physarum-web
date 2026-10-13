export type FamilySlug = "ai-data" | "build" | "grow";

export type Service = {
  slug: string;
  name: string;
  /** Compact label for tight spaces (intro animation on phones). */
  shortName: string;
  family: FamilySlug;
  /** Last word of the hero line "Intelligence that navigates ___". */
  headlineWord: string;
  summary: string;
  deliverables: string[];
};

export type Family = {
  slug: FamilySlug;
  name: string;
  tagline: string;
  intro: string;
};

// Order matters: menus, footer and service pages list families and services in this order,
// and the hero carousel and intro follow the `services` array exactly.
export const families: Family[] = [
  {
    slug: "build",
    name: "Build",
    tagline: "Software, web and mobile products, AI built in where it earns its place.",
    intro:
      "From first prototype to production, we design and engineer software, web services and mobile apps that people actually use.",
  },
  {
    slug: "ai-data",
    name: "AI & Data",
    tagline: "The automation, data and measurement behind capable models.",
    intro:
      "We automate real work with AI, and build the fine-tuning data and evaluations that tell you what a model can really do.",
  },
  {
    slug: "grow",
    name: "Grow",
    tagline: "Get found, get chosen, get measured.",
    intro:
      "Search, social and paid media run as one system — every campaign tied to numbers you can read.",
  },
];

export const services: Service[] = [
  {
    slug: "software-applications",
    name: "Software Applications",
    shortName: "Software",
    family: "build",
    headlineWord: "Software",
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
    shortName: "Automation",
    family: "ai-data",
    headlineWord: "Automation",
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
    shortName: "Web Services",
    family: "build",
    headlineWord: "the Web",
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
    shortName: "Mobile Apps",
    family: "build",
    headlineWord: "Mobile",
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
    shortName: "SEO",
    family: "grow",
    headlineWord: "Search",
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
    shortName: "Meta Ads",
    family: "grow",
    headlineWord: "Social",
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
    shortName: "Fine-Tuning Data",
    family: "ai-data",
    headlineWord: "Training Data",
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
    shortName: "Benchmarks & Evals",
    family: "ai-data",
    headlineWord: "Evaluation",
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
