import type { NextConfig } from "next";
import path from "node:path";
import createMDX from "@next/mdx";

// STATIC_PREVIEW=1 builds a static export for GitHub Pages (served under /<repo>).
const preview = process.env.STATIC_PREVIEW === "1";
const basePath = preview ? (process.env.PAGES_BASE_PATH ?? "") : "";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  ...(preview && {
    output: "export",
    distDir: ".next-preview",
    basePath,
    trailingSlash: true,
    images: { unoptimized: true },
    // Server actions can't be exported; point the contact action at a stub.
    webpack: (config: { resolve: { alias: Record<string, string> } }) => {
      config.resolve.alias[path.resolve("app/contact/actions")] = path.resolve("lib/contact-preview-stub.ts");
      config.resolve.alias["@/app/contact/actions"] = path.resolve("lib/contact-preview-stub.ts");
      return config;
    },
  }),
  env: {
    NEXT_PUBLIC_STATIC_PREVIEW: preview ? "1" : "",
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
