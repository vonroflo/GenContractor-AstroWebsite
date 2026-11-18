// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import { remarkSiteTokens } from "./src/lib/tokens.ts";

export default defineConfig({
  // PUBLIC_SITE_URL (set in Vercel env) means new clients need no code edits.
  site: process.env.PUBLIC_SITE_URL || "https://example.com",
  output: "static",
  adapter: vercel(),
  trailingSlash: "never",
  integrations: [
    icon(),
    sitemap({
      filter: (page) => !page.includes("/thank-you") && !page.includes("/api/"),
    }),
  ],
  markdown: {
    processor: unified({ remarkPlugins: [remarkSiteTokens] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
