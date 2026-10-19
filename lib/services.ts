export type FamilySlug =
  | "ai-automation-agents"
  | "ai-training-evaluation"
  | "saas-development"
  | "web-mobile-apps"
  | "seo-digital-marketing";

/** A specific offering inside a category. */
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
  /** Category page hero headline. */
  headline: string;
  intro: string;
  /** Client pain points and how we answer them. */
  problems: { title: string; answer: string }[];
  /** Optional "old way vs our way" comparison. */
  comparison?: { area: string; old: string; ours: string }[];
  /** What makes us different for this category. */
  difference: { title: string; body: string }[];
  cta: { title: string; body: string; label: string };
};

// Order matters: the intro, hero carousel, menus, footer and pages all follow this order.
export const families: Family[] = [
  {
    slug: "ai-automation-agents",
    name: "AI Automation & Agents",
    shortName: "AI Automation",
    headlineWord: "Automation",
    tagline: "AI that takes the repetitive work off your team, around the clock.",
    headline: "Give your team its time back.",
    intro:
      "We connect your apps, build AI chatbots and agents, and turn messy data into clear reports — so people spend their time on work only people can do.",
    problems: [
      {
        title: "Human error",
        answer:
          "People get tired and make mistakes on repetitive work. Automated workflows run around the clock and apply the same checks every time.",
      },
      {
        title: "Keeping data safe",
        answer:
          "Your data and your customers’ data stay protected: least-privilege access, encryption, and NDAs as standard.",
      },
      {
        title: "Time lost to busywork",
        answer:
          "We show you exactly which everyday tasks AI can take over, so your team can focus on creative and customer-facing work.",
      },
    ],
    difference: [
      {
        title: "See your savings first",
        body: "Answer four quick questions and get an estimate of how many hours AI could save your business every week.",
      },
      {
        title: "Built to be trusted",
        body: "Every automation ships with monitoring and a human-in-the-loop step wherever a mistake would be costly.",
      },
    ],
    cta: {
      title: "Find out what you could automate",
      body: "Tell us about your workflows. We’ll reply within one business day with where AI fits — and where it doesn’t.",
      label: "Book a free automation audit",
    },
  },
  {
    slug: "ai-training-evaluation",
    name: "AI Training & Evaluation",
    shortName: "AI Training",
    headlineWord: "Evaluation",
    tagline: "The data that trains models and the tests that measure them.",
    headline: "Data and evaluations you can trust your model to.",
    intro:
      "We create fine-tuning datasets, build benchmarks and agentic tasks, and run multi-model evaluations for teams training and shipping LLMs — with quality control at every step.",
    problems: [
      {
        title: "Benchmarks that leak",
        answer:
          "Public test sets end up in training data. We build private, held-out tasks your model has never seen.",
      },
      {
        title: "Data you can’t trust",
        answer:
          "Inconsistent labels and shallow reasoning teach the wrong lessons. Our data is written by vetted domain experts and reviewed before it ships.",
      },
      {
        title: "Graders that can be gamed",
        answer:
          "Weak checks reward shortcuts. Our verifiers are deterministic, validated against a reference solution, and hardened so a model can’t pass without solving the task.",
      },
      {
        title: "“Is the new model actually better?”",
        answer:
          "Impressions aren’t evidence. We run multiple attempts per model and report pass rates and failure patterns, not anecdotes.",
      },
    ],
    difference: [
      {
        title: "Validated before delivery",
        body: "Every task ships with a reference solution that scores full marks, so you know a failure is the model’s, not the task’s.",
      },
      {
        title: "Measured on real models",
        body: "We calibrate difficulty with multi-run evaluations on current models and remove tasks that are broken rather than hard.",
      },
      {
        title: "Quality control at every step",
        body: "Multi-stage review with a clear keep, fix or reject decision on every item, and an audit trail you can inspect.",
      },
    ],
    cta: {
      title: "Training or evaluating a model?",
      body: "Tell us what you’re measuring. We can share a sample task under NDA.",
      label: "Request a sample task",
    },
  },
  {
    slug: "saas-development",
    name: "SaaS Development",
    shortName: "SaaS",
    headlineWord: "SaaS",
    tagline: "Software that grows with you. No tech jargon, no hidden bills.",
    headline: "Your vision. Your code. We just build it right.",
    intro:
      "We design and build SaaS products that solve real problems for real users — with clear pricing, clean code, and plain-English updates from start to finish.",
    problems: [
      { title: "Fear of endless bills", answer: "Clear pricing agreed upfront, with no hidden fees." },
      { title: "Will anyone use it?", answer: "We focus on the problems your users actually have, and test early with real people." },
      { title: "Crashing under pressure", answer: "Systems designed to scale as your user base grows." },
      { title: "Who owns the code?", answer: "You do, from day one." },
      { title: "The technical gap", answer: "We translate tech jargon into simple business English." },
      { title: "Poor developer quality", answer: "Clean, reviewed, tested code that any good developer can pick up." },
    ],
    difference: [
      {
        title: "Problem-to-success case studies",
        body: "We show the whole journey — the client’s problem, the path we took, and the result.",
      },
      {
        title: "A free tech audit",
        body: "Already have a product or a plan? We’ll review it and tell you plainly what we’d keep, fix or build.",
      },
    ],
    cta: {
      title: "Have a product in mind?",
      body: "Send us your idea or your existing product. We’ll come back with a plain-English assessment.",
      label: "Get a free tech audit",
    },
  },
  {
    slug: "web-mobile-apps",
    name: "Web & Mobile Apps",
    shortName: "Web & Mobile",
    headlineWord: "Web & Mobile",
    tagline: "High-end web and mobile experiences, designed for the people who use them.",
    headline: "We partner with ambitious companies to turn ideas into impact.",
    intro:
      "Websites, web apps and iOS/Android apps where usability comes first — designed for the user, not just for looks, and supported after launch.",
    problems: [
      { title: "Missed deadlines", answer: "Realistic timelines and a progress update every week." },
      { title: "Going over budget", answer: "A fixed budget agreed upfront." },
      { title: "Who fixes the bugs?", answer: "Post-launch support to fix issues and keep your app running." },
      {
        title: "Can you actually build that design?",
        answer: "Our designers and developers work as one team, so every design is checked for feasibility before it’s approved.",
      },
    ],
    difference: [
      {
        title: "UI/UX first",
        body: "We map every screen and button before we build, so the product is easy to use from the first release.",
      },
      {
        title: "Built once, runs everywhere",
        body: "Cross-platform development gives you iOS and Android from a single codebase.",
      },
    ],
    cta: {
      title: "Ready to build?",
      body: "Tell us about your idea and timeline. We’ll reply with a realistic plan and a fixed budget.",
      label: "Start your project",
    },
  },
  {
    slug: "seo-digital-marketing",
    name: "SEO & Digital Marketing",
    shortName: "SEO & Marketing",
    headlineWord: "Search",
    tagline: "We don’t just buy traffic. We turn traffic into revenue.",
    headline: "We don’t just buy traffic. We turn traffic into revenue.",
    intro:
      "SEO, social media and paid ads run as one system — every dollar tracked, and every report about leads and sales rather than vanity metrics.",
    problems: [
      { title: "Slow results", answer: "Long-term SEO combined with quick wins you see early." },
      { title: "Wasting money on ads", answer: "We track every dollar and stop what isn’t working." },
      { title: "The communication gap", answer: "Plain English and regular updates — you always know what’s happening." },
      {
        title: "Fear of Google updates",
        answer: "SEO built on genuinely useful content, so your rankings hold up when algorithms change.",
      },
    ],
    comparison: [
      {
        area: "Reporting",
        old: "Confusing, automated PDF reports.",
        ours: "A simple dashboard highlighting new sales and leads.",
      },
      { area: "Traffic quality", old: "Visitors who bounce straight away.", ours: "The right visitors — the ones who click “Buy”." },
    ],
    difference: [
      {
        title: "ROI you can see",
        body: "Case studies and reports that show what our work earned, not just what it cost.",
      },
      {
        title: "A free SEO review",
        body: "Send us your site and we’ll highlight the issues holding it back.",
      },
    ],
    cta: {
      title: "Turn your traffic into revenue",
      body: "Send us your website. We’ll reply with the quick wins and the long-term plan.",
      label: "Get a free SEO review",
    },
  },
];

export const services: Service[] = [
  // AI Automation & Agents
  {
    slug: "workflow-automation",
    name: "Workflow Automation",
    family: "ai-automation-agents",
    summary: "We connect your apps so they work together automatically — no more copying data between tools.",
    deliverables: ["Process audit and automation roadmap", "App integrations (n8n, Zapier, custom APIs)", "Document and inbox automation", "Monitoring and alerts"],
  },
  {
    slug: "ai-chatbots",
    name: "Smart AI Chatbots",
    family: "ai-automation-agents",
    summary: "Chatbots that understand what your customer wants and solve their problem in context.",
    deliverables: ["Website and WhatsApp chatbots", "Answers grounded in your own documents", "Hand-off to a human when needed", "Conversation analytics"],
  },
  {
    slug: "video-call-agents",
    name: "Video Call Agents",
    family: "ai-automation-agents",
    summary: "AI agents that can handle live video support calls, built on the newest real-time models.",
    deliverables: ["Live voice and video agents", "Scripted and open-ended support flows", "Escalation to your team", "Call summaries and logs"],
  },
  {
    slug: "data-insights",
    name: "Smart Data Insights",
    family: "ai-automation-agents",
    summary: "We take messy data and turn it into clear reports you can act on.",
    deliverables: ["Data cleaning and pipelines", "Automated reports and dashboards", "Ask-your-data in plain English", "Scheduled summaries"],
  },
  // AI Training & Evaluation
  {
    slug: "fine-tuning-datasets",
    name: "LLM Fine-Tuning Datasets",
    family: "ai-training-evaluation",
    summary: "Expert-written training data for supervised fine-tuning and preference learning, reviewed before delivery.",
    deliverables: ["SFT prompt–response datasets", "Preference / RLHF pairs", "Multi-step reasoning and tool-use traces", "Multilingual and domain-expert data"],
  },
  {
    slug: "benchmarks-agentic-tasks",
    name: "Benchmarks & Agentic Tasks",
    family: "ai-training-evaluation",
    summary: "Realistic, held-out tasks in containerised environments — each with clear instructions, automated tests and a validated reference solution.",
    deliverables: ["Private, contamination-resistant benchmarks", "Agentic, multi-step coding and tool-use tasks", "Deterministic verifiers and rubrics", "Reference solutions validated to full marks"],
  },
  {
    slug: "model-evaluation",
    name: "Model Evaluation",
    family: "ai-training-evaluation",
    summary: "Multi-run evaluations across models that report pass rates and failure patterns, not impressions.",
    deliverables: ["Multi-run evaluations across models", "Pass-rate and difficulty calibration", "Rubric and LLM-as-judge grading", "Failure analysis reports"],
  },
  {
    slug: "quality-control",
    name: "Quality Control & Hardening",
    family: "ai-training-evaluation",
    summary: "Independent review of datasets and tasks, and hardening so models can’t pass by gaming the grader.",
    deliverables: ["Multi-stage review: keep, fix or reject", "Verifier hardening and isolation", "Instruction and rubric audits", "Inter-annotator agreement reporting"],
  },
  // SaaS Development
  {
    slug: "mvp-product-builds",
    name: "MVP & Product Builds",
    family: "saas-development",
    summary: "From idea to a first version real users can try — scoped tightly, priced clearly.",
    deliverables: ["Product discovery and scoping", "UX design and prototypes", "MVP build and launch", "User feedback loops"],
  },
  {
    slug: "scalable-platforms",
    name: "Scalable SaaS Platforms",
    family: "saas-development",
    summary: "Multi-tenant platforms with billing, roles and integrations, built to grow with your business.",
    deliverables: ["Architecture that scales", "Subscriptions and billing", "Roles, permissions and admin tools", "APIs and third-party integrations"],
  },
  {
    slug: "tech-audit",
    name: "Tech Audits & Rescue",
    family: "saas-development",
    summary: "A plain-English review of an existing product — and the fixes to get it back on track.",
    deliverables: ["Code and architecture review", "Performance and security checks", "Prioritised fix plan", "Takeover of stalled projects"],
  },
  // Web & Mobile Apps
  {
    slug: "cross-platform-apps",
    name: "Cross-Platform Mobile Apps",
    family: "web-mobile-apps",
    summary: "We build your app once so it works on both iOS and Android, from first build to store launch.",
    deliverables: ["iOS and Android from one codebase", "App Store and Play Store release", "Push notifications, payments, analytics", "Native modules where needed"],
  },
  {
    slug: "websites-web-apps",
    name: "Websites & Web Apps",
    family: "web-mobile-apps",
    summary: "Fast, accessible websites and web apps — from marketing sites to dashboards and e-commerce.",
    deliverables: ["Marketing sites and landing pages", "Web apps and dashboards", "E-commerce", "Performance and accessibility"],
  },
  {
    slug: "ui-ux-design",
    name: "User-Centric Design",
    family: "web-mobile-apps",
    summary: "We map out every screen and button so your product is easy to use, not just good-looking.",
    deliverables: ["User research and flows", "Wireframes and prototypes", "UI design systems", "Usability testing"],
  },
  {
    slug: "post-launch-support",
    name: "Post-Launch Support",
    family: "web-mobile-apps",
    summary: "We stay on after launch to fix bugs, ship updates and keep everything running.",
    deliverables: ["Bug fixes and monitoring", "OS and dependency updates", "Feature iterations", "Hosting and maintenance"],
  },
  // SEO & Digital Marketing
  {
    slug: "seo",
    name: "Search Engine Optimisation",
    family: "seo-digital-marketing",
    summary: "Technical SEO and genuinely useful content that compound month over month.",
    deliverables: ["Technical SEO audits and fixes", "Content strategy and production", "Local and international SEO", "Link earning"],
  },
  {
    slug: "paid-ads",
    name: "Paid Advertising",
    family: "seo-digital-marketing",
    summary: "Meta and Google campaigns where every dollar is tracked — and what isn’t working gets stopped.",
    deliverables: ["Meta (Facebook & Instagram) ads", "Google Ads", "Creative testing", "Conversion tracking"],
  },
  {
    slug: "social-media",
    name: "Social Media",
    family: "seo-digital-marketing",
    summary: "Organic social that builds an audience and sends the right people to your site.",
    deliverables: ["Social strategy and content calendars", "Content production", "Community management", "Monthly performance review"],
  },
  {
    slug: "revenue-reporting",
    name: "Revenue Dashboards",
    family: "seo-digital-marketing",
    summary: "A simple dashboard showing new leads and sales — not a confusing PDF.",
    deliverables: ["Analytics and conversion setup", "Lead and sales dashboards", "Attribution across channels", "Plain-English monthly review"],
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
