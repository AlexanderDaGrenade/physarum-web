import type { MetadataRoute } from "next";
import { families } from "@/lib/services";
import { site } from "@/lib/site";
import { caseStudies } from "@/lib/work";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/work",
    "/company",
    "/contact",
    "/privacy",
    "/terms",
    ...families.map((f) => `/services/${f.slug}`),
    ...caseStudies.filter((c) => !c.draft).map((c) => `/work/${c.slug}`),
  ];
  return paths.map((p) => ({ url: `${site.url}${p}` }));
}
