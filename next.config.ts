import type { NextConfig } from "next";

// Categories that were combined on 2026-10-11 keep working: the old address lands on the new category with the old split as a filter.
const merged: [string, string, string][] = [
  ["ui-libraries", "ui", "libraries"],
  ["components", "ui", "components"],
  ["illustration", "icons", "illustrations"],
  ["mockups", "templates", "mockups"],
  ["colors-gradients", "colors-effects", "colors-gradients"],
  ["shaders-effects", "colors-effects", "shaders-effects"],
  ["prompts", "skills", "prompts"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return merged.map(([from, to, sub]) => ({ source: `/c/${from}`, destination: `/c/${to}?sub=${sub}`, permanent: true }));
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
