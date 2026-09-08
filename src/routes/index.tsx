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
import { parseSearchParams } from "../lib/url-state";

export const route = {
  preload: ({ location }) => {
    const query = toBookQuery(parseSearchParams(location.query));
    void getBooksPage(query);
    void getBooksCount(toBookFilters(query));
  },
} satisfies RouteDefinition;

export default function Home() {
  const [params] = useSearchParams();
  const searchParams = createMemo(() => parseSearchParams(params));
  const books = createMemo(() => getBooksPage(toBookQuery(searchParams())));

  return (
    <Errored
      fallback={
        <ErrorState
          body="The catalog query failed. Check your database connection and try again."
          title="Can't load books"
        />
      }
    >
      <div class="flex min-h-0 flex-1 flex-col">
        <div class="flex-1 px-4 py-5 transition-opacity duration-200 ease-out group-has-[[data-filtering]]:opacity-60 sm:px-6">
          <Loading fallback={<BookGridSkeleton />}>
            <BookGrid books={books()} searchParams={searchParams()} />
          </Loading>
        </div>
        <footer class="border-divider-dark mt-auto border-t px-4 py-3 sm:px-6">
          <Loading fallback={<BookPaginationSkeleton />}>
            <BookPagination searchParams={searchParams()} />
          </Loading>
        </footer>
      </div>
    </Errored>
  );
}
