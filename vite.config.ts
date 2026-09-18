import { fileURLToPath } from "node:url";
import { fileRoutes } from "filesystem-routing/vite";
import netlify from "@netlify/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import solid from "@solidjs/vite-plugin";
import { prerender } from "prerender-crawler/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    solid({
      start: {
        middleware: "./src/middleware.ts",
        devtools: false,
      },
      ssr: true,
      serverFunctions: { configure: "./src/server-config.ts" },
    }),
    fileRoutes({ httpMethods: true, types: true }),
    netlify({ build: { enabled: true } }),
    // Tells the server bundle it is being run by the build, not deployed.
    // Set from `config` so it lands before the crawl imports that bundle.
    {
      name: "prerendering-env",
      apply: "build",
      config() {
        process.env.PRERENDERING = "1";
      },
    },
    // Hybrid: the Netlify function still serves everything else. Only the
    // homepage is written out, so its first byte comes off the CDN.
    prerender({
      mode: "hybrid",
      crawlLinks: false,
      emitPages: (path) => path === "/",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "client",
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: ["src/**/*.ssr.test.tsx"],
        },
      },
      {
        extends: true,
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/*.ssr.test.tsx"],
        },
      },
    ],
  },
});
