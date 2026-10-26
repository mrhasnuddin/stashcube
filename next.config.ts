import type { NextConfig } from "next";

// Categories that were combined on 2026-10-11 keep working: the old address lands on the new category with the old split as a filter.
const merged: [string, string, string][] = [
  ["ui-libraries", "ui", "libraries"],
  ["components", "ui", "components"],
  ["illustration", "icons", "illustrations"],
  ["mockups", "galleries", "templates-mockups"],
  ["templates", "galleries", "templates-mockups"],
  ["colors-gradients", "colors-effects", "colors-gradients"],
  ["shaders-effects", "colors-effects", "shaders-effects"],
  ["prompts", "skills", "prompts"],
];

const nextConfig: NextConfig = {
  async redirects() {
    // 2026-10: the gallery and UI-details groups of Inspiration became the Galleries category
    const split = ["galleries", "ui-details"].map((sub) => ({
      source: "/c/inspiration",
      has: [{ type: "query" as const, key: "sub", value: sub }],
      destination: sub === "galleries" ? "/c/galleries" : "/c/galleries?sub=ui-details",
      permanent: true,
    }));
    return [...split, ...merged.map(([from, to, sub]) => ({ source: `/c/${from}`, destination: `/c/${to}?sub=${sub}`, permanent: true }))];
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
