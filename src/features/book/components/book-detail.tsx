import type { JSX } from "@solidjs/web";
import { For, createMemo } from "solid-js";
import { getBookById } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/ui/star-rating";
import type { BookDetails } from "@/features/book/book-queries";
import { formatCount, getLanguageLabel } from "@/features/book/book-utils";
import { BookCover, BookCoverSkeleton } from "@/features/book/components/book-cover";

const DETAIL_SIZES = "(min-width: 768px) 18rem, 60vw";

export function BookDetail(props: { id: string }) {
  const book = createMemo(() => getBookById(props.id));
  return <BookDetailView book={book()} />;
}

function BookDetailView(props: { book: BookDetails }) {
  const rating = () => Number(props.book.average_rating);
  const hasRating = () => props.book.average_rating !== null && !Number.isNaN(rating());

  return (
    <article class="flex flex-col gap-8 md:flex-row md:gap-10">
      <div class="mx-auto w-40 shrink-0 sm:w-48 md:mx-0 md:w-72">
        <BookCover
          class="shadow-soft ring-divider/70 dark:ring-divider-dark/70 ring-1"
          sizes={DETAIL_SIZES}
          src={props.book.image_url}
          thumbhash={props.book.thumbhash}
          title={props.book.title}
        />
      </div>

      <div class="min-w-0 flex-1">
        <h1>{props.book.title}</h1>
        {props.book.authors.length > 0 ? (
          <p class="text-muted mt-2 text-base sm:text-lg">{props.book.authors.join(", ")}</p>
        ) : null}

        {hasRating() ? (
          <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <StarRating rating={rating()} />
            <span class="text-sm font-semibold tabular-nums">{rating().toFixed(1)}</span>
            {props.book.ratings_count ? (
              <span class="text-muted text-sm tabular-nums">
                {formatCount(props.book.ratings_count)} ratings
              </span>
            ) : null}
          </div>
        ) : null}

        {props.book.description ? (
          <p class="text-muted mt-6 max-w-prose text-sm leading-7">{props.book.description}</p>
        ) : null}

        <dl class="border-divider-dark mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t pt-6 sm:grid-cols-2">
          <Fact label="Pages">
            {props.book.num_pages ? props.book.num_pages.toLocaleString() : "Unknown"}
          </Fact>
          <Fact label="Language">{getLanguageLabel(props.book.language_code)}</Fact>
          <Fact label="Published">{props.book.publication_year ?? "Unknown"}</Fact>
          <Fact label="Publisher">{props.book.publisher ?? "Unknown"}</Fact>
          <Fact label="ISBN">
            <span class="font-mono text-xs">{props.book.isbn ?? "None"}</span>
          </Fact>
        </dl>
      </div>
    </article>
  );
}

function Fact(props: { children: JSX.Element; label: string }) {
  return (
    <div class="flex items-start gap-3">
      <div class="min-w-0">
        <dt class="text-muted text-xs font-semibold tracking-wide uppercase">{props.label}</dt>
        <dd class="mt-0.5 truncate text-sm">{props.children}</dd>
      </div>
    </div>
  );
}

export function BookDetailSkeleton() {
  return (
    <div aria-hidden="true" class="flex flex-col gap-8 md:flex-row md:gap-10">
      <div class="mx-auto w-40 shrink-0 sm:w-48 md:mx-0 md:w-72">
        <BookCoverSkeleton />
      </div>
      <div class="min-w-0 flex-1">
        <Skeleton class="skeleton-subtle h-8 w-3/4 max-w-md" />
        <Skeleton class="skeleton-subtle mt-3 h-5 w-40" />
        <Skeleton class="skeleton-subtle mt-5 h-4 w-56" />
        <div class="mt-6 flex flex-col gap-2.5">
          <Skeleton class="skeleton-subtle h-3.5 w-full max-w-prose" />
          <Skeleton class="skeleton-subtle h-3.5 w-full max-w-prose" />
          <Skeleton class="skeleton-subtle h-3.5 w-4/5 max-w-prose" />
        </div>
        <div class="border-divider-dark mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t pt-6 sm:grid-cols-2">
          <For each={[0, 1, 2, 3, 4]}>
            {() => (
              <div class="flex items-start gap-3">
                <Skeleton class="skeleton-subtle mt-0.5 size-4 rounded" />
                <div class="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Skeleton class="skeleton-subtle h-3 w-16" />
                  <Skeleton class="skeleton-subtle h-4 w-24" />
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
