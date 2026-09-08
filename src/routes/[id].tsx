import { Title } from "@solidjs/meta";
import { RouteDefinition, useParams } from "@solidjs/router";
import { Errored, Loading } from "solid-js";
import { getBookById } from "../api";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorState } from "../components/ui/error-state";
import { BackToBooksLink } from "../features/book/components/back-to-books-link";
import { BookDetail, BookDetailSkeleton } from "../features/book/components/book-detail";

export const route = {
  preload: ({ params }) => {
    if (params.id) void getBookById(params.id);
  },
} satisfies RouteDefinition;

export default function BookPage() {
  const params = useParams<{ id: string }>();

  return (
    <div class="flex flex-1 flex-col px-4 py-5 sm:px-6">
      <Title>Book · Solid Books</Title>
      <BackToBooksLink class="mb-6" />
      <Errored
        fallback={(error) => {
          const err = error();
          const message = err instanceof Error ? err.message : "";
          if (message === "Book not found" || message === "Invalid book ID") {
            return (
              <EmptyState body="We couldn't find a book with that id." title="Book not found">
                <Button class="mt-1" href="/" variant="secondary">
                  Back to the shelf
                </Button>
              </EmptyState>
            );
          }

          return (
            <ErrorState
              body="We couldn't load this book's details."
              title="Can't load book"
            />
          );
        }}
      >
        <Loading fallback={<BookDetailSkeleton />}>
          <BookDetail id={params.id ?? ""} />
        </Loading>
      </Errored>
    </div>
  );
}
