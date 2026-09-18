import type { ParentProps } from "solid-js";
import { HydrationScript } from "@solidjs/web";

// The prerendered homepage is one static file, the same for every query
// string. A hard load that carries one needs a real render, so hand it to
// the live `/browse` route before anything paints.
const PRERENDERED_HOME_REDIRECT =
  'if(location.pathname==="/"&&location.search.length>1)location.replace("/browse"+location.search+location.hash)';

export default function Document(props: ParentProps) {
  return (
    <html class="dark" lang="en">
      <head>
        <meta charset="utf-8" />
        {import.meta.env.PRERENDER_MODE && (
          // oxlint-disable-next-line solid/no-innerhtml -- constant string, no user input
          <script innerHTML={PRERENDERED_HOME_REDIRECT} />
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#121212" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
        <title>Solid Books</title>
        <HydrationScript />
      </head>
      <body class="bg-surface-dark text-white antialiased">
        {props.children}
      </body>
    </html>
  );
}
