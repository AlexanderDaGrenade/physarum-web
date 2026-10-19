export const site = {
  name: "Physarum",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Physarum builds AI automation and agents, LLM training data and evaluations, SaaS products, web and mobile apps, and SEO and digital marketing that turns traffic into revenue.",
  contactEmail: "business@physarum.org",
  /** Static GitHub Pages preview: no server, no indexing. */
  preview: process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1",
};
