import { RouteDefinition, useSearchParams } from "@solidjs/router";
import { createMemo, Errored, Loading } from "solid-js";
import { getBooksCount, getBooksPage } from "../api";
import { ErrorState } from "../components/ui/error-state";
import { toBookFilters, toBookQuery } from "../features/book/book-utils";
import {
  BookGrid,
  BookGridSkeleton,
} from "../features/book/components/book-grid";
import {
  BookPagination,
  BookPaginationSkeleton,
} from "../features/book/components/book-pagination";
import { getApiDelayMs, parseSearchParams } from "../lib/url-state";
import { Title } from "@solidjs/meta";

export const route = {
  preload: ({ location }) => {
    try {
      const searchParams = parseSearchParams(location.query);
      const query = toBookQuery(searchParams);
      const delayMs = getApiDelayMs(searchParams);
      void getBooksPage(query, delayMs);
      void getBooksCount(toBookFilters(query), delayMs);
    } catch (_e) {
      // ignore errors in preload
    }
  },
} satisfies RouteDefinition;

export default function Home() {
  const [params] = useSearchParams();
  const searchParams = createMemo(() => parseSearchParams(params));
  const books = createMemo(() =>
    getBooksPage(toBookQuery(searchParams()), getApiDelayMs(searchParams())),
  );

  return (
    <Errored
      fallback={
        <ErrorState
          body="The catalog query failed. Check your database connection and try again."
          title="Can't load books"
        />
      }
    >
      <Title>Books · Solid Books</Title>
      <div class="flex min-h-0 flex-1 flex-col">
        <div class="min-h-0 flex-1 overflow-y-auto px-4 py-5 transition-opacity duration-200 ease-out group-has-[[data-filtering]]:opacity-60 sm:px-6">
          <Loading fallback={<BookGridSkeleton />}>
            <BookGrid books={books()} searchParams={searchParams()} />
          </Loading>
        </div>
        <footer class="border-divider-dark shrink-0 border-t px-4 py-3 sm:px-6">
          <Loading fallback={<BookPaginationSkeleton />}>
            <BookPagination searchParams={searchParams()} />
          </Loading>
        </footer>
      </div>
    </Errored>
  );
}
