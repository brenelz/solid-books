import { isServer } from "@solidjs/web";
import { sharedConfig } from "solid-js";
import {
  EMPTY_IMAGE_URL,
  getLargeBookImageUrl,
  PRIORITY_COVER_COUNT,
} from "./book-constants";

type Cover = string | null;
const covers = new Map<string, Cover | Promise<Cover>>();
const MAX_CACHED_COVERS = 128;
export const COVER_REVEAL_TIMEOUT_MS = 500;

export function loadBookCover(
  imageUrl: string | null,
  priority = false,
): Cover | Promise<Cover> {
  const src = getLargeBookImageUrl(imageUrl ?? EMPTY_IMAGE_URL);
  // Asset readiness must not turn server-rendered content into a client-only
  // hole, or re-suspend content that is already visible during hydration.
  if (isServer || sharedConfig.hydrating) return src;

  const cached = covers.get(src);
  if (cached !== undefined) return cached;

  const image = new Image();
  image.decoding = "async";
  image.fetchPriority = priority ? "high" : "auto";
  image.src = src;
  if (image.complete) return image.naturalWidth > 0 ? src : null;

  let timeout: ReturnType<typeof setTimeout>;
  const pending = Promise.race([
    image.decode().then(() => src, () => null),
    new Promise<Cover>((resolve) => {
      // A timeout releases the reveal, not the request. The real <img> can
      // still finish loading (or report an error) after it becomes visible.
      timeout = setTimeout(() => resolve(src), COVER_REVEAL_TIMEOUT_MS);
    }),
  ]).then((result) => {
    clearTimeout(timeout);
    // An evicted request must not replace a newer entry when it finishes.
    if (covers.get(src) === pending) covers.set(src, result);
    return result;
  });
  covers.set(src, pending);
  if (covers.size > MAX_CACHED_COVERS) {
    covers.delete(covers.keys().next().value!);
  }
  return pending;
}

export function preloadBookCovers<T extends { image_url: string | null }>(
  books: T[],
): T[] | Promise<T[]> {
  const pending = books.slice(0, PRIORITY_COVER_COUNT).map(preloadBookCover);
  return pending.some((book) => book instanceof Promise)
    ? Promise.all(pending).then(() => books)
    : books;
}

export function preloadBookCover<T extends { image_url: string | null }>(
  book: T,
): T | Promise<T> {
  const cover = loadBookCover(book.image_url, true);
  return cover instanceof Promise ? cover.then(() => book) : book;
}
