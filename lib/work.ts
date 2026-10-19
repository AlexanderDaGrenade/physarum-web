import type { FamilySlug } from "./services";

export type CaseStudy = {
  slug: string;
  title: string;
  /** Client name, or a description when the work is under NDA or anonymised. */
  client: string;
  anonymized: boolean;
  family: FamilySlug;
  services: string[];
  outcome: string;
  /**
   * Delivered by members of our team before Physarum was founded. Shown with a
   * "Before Physarum" label so it is never presented as Physarum client work.
   */
  beforePhysarum?: boolean;
  /**
   * Draft entries are placeholders, not real engagements. They render with a
   * "Draft" badge, are noindexed and left out of the sitemap.
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
    slug: "autonomous-agent-platform",
    title: "A platform for autonomous AI agents",
    client: "AI agent startup",
    anonymized: true,
    family: "ai-automation-agents",
    services: ["workflow-automation", "ai-chatbots"],
    outcome: "Backend and agent logic for a browser-based platform where users name an agent, give it a goal, and watch it plan and execute the work.",
    beforePhysarum: true,
    draft: false,
  },
  {
    slug: "ai-legal-assistant",
    title: "An AI assistant that makes legal advice accessible",
    client: "Legal-tech startup",
    anonymized: true,
    family: "ai-automation-agents",
    services: ["ai-chatbots", "websites-web-apps", "ui-ux-design"],
    outcome: "An interactive AI assistant that turns complex legal questions into clear, actionable guidance.",
    beforePhysarum: true,
    draft: false,
  },
  {
    slug: "underwriting-knowledge-platform",
    title: "An AI knowledge base for insurance underwriting",
    client: "Insurance-tech startup",
    anonymized: true,
    family: "saas-development",
    services: ["mvp-product-builds", "ai-chatbots", "ui-ux-design"],
    outcome: "A full-stack platform and trained AI assistant that give insurance agencies up-to-date underwriting answers — fewer calls to underwriters, fewer cancellations.",
    beforePhysarum: true,
    draft: false,
  },
  {
    slug: "health-optimisation-platform",
    title: "A health platform for understanding your bloodwork",
    client: "Health-tech company",
    anonymized: true,
    family: "saas-development",
    services: ["scalable-platforms", "data-insights", "ui-ux-design"],
    outcome: "A platform with a free course and AI-assisted analysis that helps people understand and improve more than 60 blood biomarkers — no doctor visit needed.",
    beforePhysarum: true,
    draft: false,
  },
  {
    slug: "ai-quiz-engagement",
    title: "AI-generated quizzes that keep visitors on site",
    client: "Ad-tech startup",
    anonymized: true,
    family: "saas-development",
    services: ["mvp-product-builds", "data-insights", "ui-ux-design"],
    outcome: "A SaaS that reads a website’s content and generates contextual, multilingual quizzes in real time to lift engagement and ad revenue.",
    beforePhysarum: true,
    draft: false,
  },
  {
    slug: "ai-personal-assistant-app",
    title: "A personal AI assistant that understands your mood",
    client: "Consumer AI startup",
    anonymized: true,
    family: "web-mobile-apps",
    services: ["cross-platform-apps", "ai-chatbots", "ui-ux-design"],
    outcome: "A React Native app that remembers mood, preferences and habits to give personal, proactive and private support.",
    beforePhysarum: true,
    draft: false,
  },
  {
    slug: "online-therapy-booking",
    title: "Private online therapy, booked in minutes",
    client: "Mental-health platform",
    anonymized: true,
    family: "web-mobile-apps",
    services: ["websites-web-apps", "ui-ux-design", "ai-chatbots"],
    outcome: "A booking platform where patients choose a licensed psychologist and time slot, pay securely, and meet privately online.",
    beforePhysarum: true,
    draft: false,
  },
  {
    slug: "veterinary-3d-learning",
    title: "Interactive 3D anatomy for veterinary learning",
    client: "Ed-tech company",
    anonymized: true,
    family: "web-mobile-apps",
    services: ["websites-web-apps", "ui-ux-design", "ai-chatbots"],
    outcome: "An educational platform with interactive 3D animal anatomy models, a health dictionary and an AI assistant.",
    beforePhysarum: true,
    draft: false,
  },
  {
    slug: "travel-booking-app",
    title: "Flights and cruises in one booking app",
    client: "Travel company",
    anonymized: true,
    family: "web-mobile-apps",
    services: ["cross-platform-apps", "ui-ux-design", "ai-chatbots"],
    outcome: "A mobile app to compare prices, check schedules, save wishlists and book both flights and cruises.",
    beforePhysarum: true,
    draft: false,
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
export const caseStudiesFor = (family: FamilySlug) => caseStudies.filter((c) => c.family === family);
