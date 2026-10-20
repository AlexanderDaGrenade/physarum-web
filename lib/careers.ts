import type { FamilySlug } from "./services";

export type Role = {
  slug: string;
  title: string;
  /** Which service category the role mainly works in. */
  family: FamilySlug;
  type: string;
  location: string;
  summary: string;
  youWill: string[];
  youHave: string[];
  niceToHave: string[];
};

export const careersEmail = "careers@physarum.org";

/** Accepted CV formats and size — shown on the form and enforced by public/api/apply.php. */
export const cvRules = { extensions: ["pdf", "doc", "docx"], maxMb: 5 } as const;

export const roles: Role[] = [
  {
    slug: "full-stack-developer",
    title: "Full-Stack Developer",
    family: "saas-development",
    type: "Full-time",
    location: "Remote",
    summary:
      "Build SaaS products, web apps and mobile apps for clients — from the database to the interface, with AI features where they earn their place.",
    youWill: [
      "Build features end to end: APIs, databases, front-ends and integrations",
      "Turn designs into fast, accessible, responsive interfaces",
      "Add AI features such as chatbots, retrieval and generation to client products",
      "Write tests, review code and keep projects easy to hand over",
      "Explain technical trade-offs to clients in plain English",
    ],
    youHave: [
      "Solid experience with React or Next.js and TypeScript",
      "Backend experience in Node.js, .NET or Python, with SQL databases",
      "Git, code review and shipping to production",
      "A portfolio, GitHub or live projects you can show us",
    ],
    niceToHave: ["React Native or Flutter", "LLM APIs and retrieval (RAG)", "Cloud deployment (Vercel, AWS, Azure)"],
  },
  {
    slug: "ai-automation-engineer",
    title: "AI Automation Engineer",
    family: "ai-automation-agents",
    type: "Full-time",
    location: "Remote",
    summary:
      "Design and build AI agents, chatbots and automated workflows that take repetitive work off our clients’ teams.",
    youWill: [
      "Map client processes and find what’s worth automating",
      "Build LLM agents and chatbots grounded in client data",
      "Connect apps with n8n, Zapier or custom integrations",
      "Add monitoring and human-in-the-loop checks so automations can be trusted",
    ],
    youHave: [
      "Hands-on experience building with LLM APIs (OpenAI, Anthropic or similar)",
      "Python or TypeScript, and comfort working with APIs and webhooks",
      "Experience with at least one workflow tool such as n8n, Zapier or Make",
      "A habit of testing AI output rather than trusting it",
    ],
    niceToHave: ["LangChain or similar frameworks", "Voice or video agents", "Vector databases and retrieval"],
  },
  {
    slug: "ai-trainer-evaluator",
    title: "AI Trainer & Evaluator",
    family: "ai-training-evaluation",
    type: "Contract · flexible hours",
    location: "Remote",
    summary:
      "Create the data that trains frontier AI models and the tasks that test them — writing, coding and reviewing with an eye for detail.",
    youWill: [
      "Write expert prompts, responses and step-by-step reasoning for fine-tuning datasets",
      "Build realistic coding and agentic tasks with tests and reference solutions",
      "Review and grade model outputs against detailed rubrics",
      "Follow precise guidelines and give feedback that improves them",
    ],
    youHave: [
      "Strong written English and meticulous attention to detail",
      "Deep knowledge in at least one area: software engineering, maths, science, finance, law or another specialism",
      "For coding tasks: solid Python and comfort with Docker and testing",
      "The ability to explain your reasoning clearly",
    ],
    niceToHave: ["Previous AI training, annotation or evaluation work", "A degree or professional experience in your domain", "Languages other than English"],
  },
  {
    slug: "seo-digital-marketing-specialist",
    title: "SEO & Digital Marketing Specialist",
    family: "seo-digital-marketing",
    type: "Full-time",
    location: "Remote",
    summary:
      "Turn traffic into revenue for our clients — SEO, paid ads and social media run as one system and measured on leads and sales.",
    youWill: [
      "Run technical SEO audits and fix what’s holding sites back",
      "Plan and produce content that ranks and converts",
      "Manage Meta and Google ad campaigns, tracking every dollar",
      "Build simple dashboards that show clients leads and sales",
    ],
    youHave: [
      "A track record of growing organic traffic or ad ROI — with numbers",
      "Experience with Google Search Console, GA4 and Meta Ads Manager",
      "Clear, plain-English reporting",
      "Comfort working with developers on technical fixes",
    ],
    niceToHave: ["Google Ads", "Local SEO", "Basic HTML and analytics tagging"],
  },
];

export const getRole = (slug: string) => roles.find((r) => r.slug === slug);
