import { For, Show } from "solid-js";
import { ITEMS_PER_PAGE } from "@/features/book/book-constants";
import type { BookSummary } from "@/features/book/book-queries";
import {
  BookCard,
  BookCardSkeleton,
} from "@/features/book/components/book-card";
import { type SearchParams } from "@/lib/url-state";
import { EmptyState } from "@/components/ui/empty-state";

const gridClass =
  "grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7";

export function BookGrid(props: {
  books: BookSummary[];
  searchParams: SearchParams;
}) {
  return (
    <>
      <Show
        when={props.books.length > 0}
        fallback={
          <EmptyState
            body="Nothing matched these filters. Try widening the year range or clearing the search."
            title="No books found"
          />
        }
      >
        <div class={gridClass}>
          <For each={props.books}>
            {(book) => (
              <BookCard book={book} searchParams={props.searchParams} />
            )}
          </For>
        </div>
      </Show>
    </>
  );
}

export function BookGridSkeleton(props: { count?: number }) {
  const placeholders = () =>
    Array.from({ length: props.count ?? ITEMS_PER_PAGE }, (_, index) => index);

  return (
    <div aria-hidden="true" class={gridClass}>
      <For each={placeholders()}>{() => <BookCardSkeleton />}</For>
    </div>
  );
}
