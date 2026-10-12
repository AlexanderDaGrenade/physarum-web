export const site = {
  name: "Physarum",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Physarum is a full-service AI and software company: LLM training data, benchmarks and evals, AI automation, web and mobile apps, SEO and social growth.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  calLink: process.env.NEXT_PUBLIC_CAL_LINK,
  /** Static GitHub Pages preview: no server, no indexing. */
  preview: process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1",
};
