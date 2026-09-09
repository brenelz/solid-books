import { Link } from "@solidjs/meta";
import { createMemo, For } from "solid-js";
import {
  EMPTY_IMAGE_URL,
  getLargeBookImageUrl,
  PRIORITY_COVER_COUNT,
} from "@/features/book/book-constants";

export function BookCoverPreloads(props: {
  books: readonly { image_url: string | null }[];
}) {
  const sources = createMemo(
    () => [
      ...new Set(
        props.books.slice(0, PRIORITY_COVER_COUNT).map((book) =>
          getLargeBookImageUrl(book.image_url ?? EMPTY_IMAGE_URL),
        ),
      ),
    ],
    { name: "BookCoverPreloads.sources" },
  );

  return (
    <For each={sources()}>
      {(src) => <Link rel="preload" as="image" href={src} fetchpriority="high" />}
    </For>
  );
}
