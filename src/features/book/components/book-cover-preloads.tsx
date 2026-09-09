import { Link } from "@solidjs/meta";
import { createMemo, For } from "solid-js";
import {
  EMPTY_IMAGE_URL,
  getLargeBookImageUrl,
} from "@/features/book/book-constants";

export function BookCoverPreloads(props: {
  books: readonly { image_url: string | null }[];
}) {
  const sources = createMemo(
    () => [
      ...new Set(
        props.books.map((book) =>
          getLargeBookImageUrl(book.image_url ?? EMPTY_IMAGE_URL),
        ),
      ),
    ],
    { name: "BookCoverPreloads.sources" },
  );

  return (
    <For each={sources()}>
      {(src) => <Link rel="preload" as="image" href={src} />}
    </For>
  );
}
