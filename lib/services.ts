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

export const families: Family[] = [
  {
    slug: "ai-data",
    name: "AI & Data",
    tagline: "The data, measurement and automation behind capable models.",
    intro:
      "We build the training data, benchmarks and evaluations that tell you what a model can really do — and the automations that put it to work.",
  },
  {
    slug: "build",
    name: "Build",
    tagline: "Products on the web and in your pocket, AI built in where it earns its place.",
    intro:
      "From first prototype to production, we design and engineer web apps, AI-powered products and mobile apps that people actually use.",
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
    slug: "llm-training-data",
    name: "LLM Training Data",
    shortName: "Training Data",
    family: "ai-data",
    headlineWord: "Training Data",
    summary:
      "Expert-written SFT, preference and reasoning data across domains and languages, with QA you can audit.",
    deliverables: [
      "Supervised fine-tuning datasets",
      "RLHF / preference pairs",
      "Multi-step reasoning & tool-use traces",
      "Multilingual and domain-expert annotation",
      "Inter-annotator agreement and QA reports",
    ],
  },
  {
    slug: "llm-benchmarking",
    name: "LLM Benchmarking",
    shortName: "Benchmarking",
    family: "ai-data",
    headlineWord: "Benchmarks",
    summary:
      "Private, contamination-resistant benchmarks that measure the capabilities you care about.",
    deliverables: [
      "Custom benchmark design",
      "Held-out, private test sets",
      "Agentic and long-horizon tasks",
      "Leaderboards and model comparisons",
    ],
  },
  {
    slug: "evals",
    name: "Evals",
    shortName: "Evals",
    family: "ai-data",
    headlineWord: "Evaluation",
    summary:
      "Rubrics, graders and harnesses that turn “seems better” into a number you can ship on.",
    deliverables: [
      "Rubric and grader design",
      "Automated eval harnesses",
      "Human and LLM-as-judge pipelines",
      "Regression suites for releases",
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
    slug: "web-apps",
    name: "Web Apps",
    shortName: "Web Apps",
    family: "build",
    headlineWord: "the Web",
    summary: "Fast, accessible, maintainable web applications — from SaaS dashboards to marketplaces.",
    deliverables: [
      "Product and UX design",
      "React / Next.js front-ends",
      "APIs, databases and auth",
      "Hosting, CI/CD and handover",
    ],
  },
  {
    slug: "ai-web-apps",
    name: "AI Web Apps",
    shortName: "AI Web Apps",
    family: "build",
    headlineWord: "AI Products",
    summary:
      "Products with LLMs at the core: copilots, retrieval, chat and generation — evaluated before they ship.",
    deliverables: [
      "RAG and search over your data",
      "Copilots and chat interfaces",
      "Model selection and cost control",
      "Built-in evals and guardrails",
    ],
  },
  {
    slug: "mobile-apps",
    name: "Mobile Apps",
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
