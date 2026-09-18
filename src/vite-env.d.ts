/// <reference types="vite/client" />
/// <reference types="@solidjs/vite-plugin/boundary-modules" />
/// <reference types="../file-routes.d.ts" />

interface ImportMetaEnv {
  /** Defined by prerender-crawler in builds; absent in dev. */
  readonly PRERENDER_MODE?: "static" | "hybrid";
}
