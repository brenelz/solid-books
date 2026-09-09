import { EMPTY_IMAGE_URL, getLargeBookImageUrl } from "./book-constants";

type Cover = string | null;
const covers = new Map<string, Cover | Promise<Cover>>();
const MAX_CACHED_COVERS = 128;

export function loadBookCover(imageUrl: string | null): Cover | Promise<Cover> {
  const src = getLargeBookImageUrl(imageUrl ?? EMPTY_IMAGE_URL);
  const cached = covers.get(src);
  if (cached !== undefined) return cached;

  const image = new Image();
  image.src = src;
  const pending = image.decode().then(
    () => src,
    () => null,
  ).then((result) => {
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
  const pending = books.map(preloadBookCover);
  return pending.some((book) => book instanceof Promise)
    ? Promise.all(pending)
    : books;
}

export function preloadBookCover<T extends { image_url: string | null }>(
  book: T,
): T | Promise<T> {
  const cover = loadBookCover(book.image_url);
  return cover instanceof Promise ? cover.then(() => book) : book;
}
