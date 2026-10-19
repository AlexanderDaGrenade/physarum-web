export const site = {
  name: "Physarum",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Physarum builds AI automation and agents, LLM training data and evaluations, SaaS products, web and mobile apps, and SEO and digital marketing that turns traffic into revenue.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  calLink: process.env.NEXT_PUBLIC_CAL_LINK,
  /** Static GitHub Pages preview: no server, no indexing. */
  preview: process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1",
};
