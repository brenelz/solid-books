import { createMemo } from "solid-js";
import { FastLink } from "@/components/ui/fast-link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { LinkStatus } from "@/components/ui/link-status";
import { Skeleton } from "@/components/ui/skeleton";
import { getBooksCount } from "@/api";
import { toBookFilters, toBookQuery } from "@/features/book/book-utils";
import {
  buildHref,
  getApiDelayMs,
  getCurrentPage,
  getTotalPages,
  withPage,
} from "@/lib/url-state";
import type { SearchParams } from "@/lib/url-state";
import { cn } from "@/lib/utils";

const stepClass =
  "text-muted hover:bg-card-dark focus-visible:ring-action/40 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:text-white focus-visible:ring-2 focus-visible:outline-none";

export function BookPagination(props: { searchParams: SearchParams }) {
  const totalResults = createMemo(() =>
    getBooksCount(
      toBookFilters(toBookQuery(props.searchParams)),
      getApiDelayMs(props.searchParams),
    ),
  );
  const totalPages = () => getTotalPages(totalResults());
  const currentPage = () => getCurrentPage(props.searchParams, totalPages());
  const hasPrevious = () => currentPage() > 1;
  const hasNext = () => currentPage() < totalPages();

  return (
    <nav
      aria-label="Pagination"
      class="flex items-center justify-between gap-4"
    >
      {hasPrevious() ? (
        <FastLink
          aria-label="Previous page"
          class={stepClass}
          href={buildHref(withPage(props.searchParams, currentPage() - 1))}
        >
          <LinkStatus>
            <ChevronLeftIcon class="size-4" />
            Previous
          </LinkStatus>
        </FastLink>
      ) : (
        <span
          aria-disabled="true"
          class={cn(stepClass, "pointer-events-none opacity-40")}
        >
          <ChevronLeftIcon class="size-4" />
          Previous
        </span>
      )}

      <p class="text-muted flex items-center gap-2 text-xs tabular-nums sm:text-sm">
        <span class="hidden sm:inline">
          <span class="font-medium text-white">
            {totalResults().toLocaleString()}
          </span>{" "}
          books
        </span>
        <span
          aria-hidden="true"
          class="bg-divider-dark hidden h-3 w-px sm:block"
        />
        <span>
          Page {currentPage().toLocaleString()} of{" "}
          {totalPages().toLocaleString()}
        </span>
      </p>

      {hasNext() ? (
        <FastLink
          aria-label="Next page"
          class={stepClass}
          href={buildHref(withPage(props.searchParams, currentPage() + 1))}
        >
          <LinkStatus hint="start">
            Next
            <ChevronRightIcon class="size-4" />
          </LinkStatus>
        </FastLink>
      ) : (
        <span
          aria-disabled="true"
          class={cn(stepClass, "pointer-events-none opacity-40")}
        >
          Next
          <ChevronRightIcon class="size-4" />
        </span>
      )}
    </nav>
  );
}

export function BookPaginationSkeleton() {
  return (
    <div aria-hidden="true" class="flex items-center justify-between gap-4">
      <span class={cn(stepClass, "pointer-events-none opacity-40")}>
        <ChevronLeftIcon class="size-4" />
        Previous
      </span>
      <div class="flex items-center gap-2">
        <Skeleton class="skeleton-subtle hidden h-4 w-20 sm:block" />
        <span class="bg-divider-dark hidden h-3 w-px sm:block" />
        <Skeleton class="skeleton-subtle h-4 w-20" />
      </div>
      <span class={cn(stepClass, "pointer-events-none opacity-40")}>
        Next
        <ChevronRightIcon class="size-4" />
      </span>
    </div>
  );
}
