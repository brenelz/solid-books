## Solid Books

A Solid copy of next-books.dev

### Cover preloading

The app follows the [image reveal gating proposal's Phase 0](https://github.com/solidjs/solid/blob/next/documentation/proposals/image-reveal-gating.md):

- The first 10 grid covers (and the detail cover) get image preload links and
  `fetchpriority="high"`. Remaining covers use native lazy loading and never
  hold a reveal.
- Client navigation warms priority covers in parallel and holds the existing
  `Loading` boundary until decoding settles, with a maximum 500 ms image wait.
  Failed requests release the boundary; timed-out requests continue loading.
- SSR renders real images as soon as book data is ready. Hydration does not
  wait for decoding or replace that content with a loading fallback.

The installed Solid release has no server export for `waitAsset`, so this uses
async memos, the same mechanism used by its client implementation. The grid
already shares one `Loading` boundary, so no additional `Reveal` coordination
is needed. Preload hints warm the streamed first load but do not gate its swap;
that requires the upstream compiler/runtime work in Phase 1.
