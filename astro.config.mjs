// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

import mdx from "@astrojs/mdx";

import cloudflareRedirects from "astro-cloudflare-redirects";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx(), cloudflareRedirects()],

  vite: {
    plugins: [tailwindcss(), svgr()],
  },
});
