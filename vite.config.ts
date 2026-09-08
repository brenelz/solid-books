import { fileURLToPath } from "node:url";
import { fileRoutes } from "filesystem-routing/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import solid from "@solidjs/vite-plugin";

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
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
