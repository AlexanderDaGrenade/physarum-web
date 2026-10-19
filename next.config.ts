import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Static builds (plain HTML/CSS/JS, no Node server):
//   STATIC_EXPORT=1  → production export for physarum.org on cPanel, written to .next-export/
//   STATIC_PREVIEW=1 → GitHub Pages preview: export under /<repo>, noindexed, written to .next-preview/
const preview = process.env.STATIC_PREVIEW === "1";
const exported = preview || process.env.STATIC_EXPORT === "1";
const basePath = preview ? (process.env.PAGES_BASE_PATH ?? "") : "";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  ...(exported && {
    output: "export",
    // Separate from .next so a running dev server isn't disturbed.
    distDir: preview ? ".next-preview" : ".next-export",
    basePath,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  env: {
    NEXT_PUBLIC_STATIC_PREVIEW: preview ? "1" : "",
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
