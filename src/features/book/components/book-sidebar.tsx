import { Errored } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { BookMark } from "@/components/book-mark";
import { ErrorState } from "@/components/ui/error-state";
import { FastLink } from "@/components/ui/fast-link";
import { ApiDelay } from "@/features/book/components/api-delay";
import { BookFilters } from "@/features/book/components/book-filters";
import { CatalogSize } from "@/features/book/components/catalog-size";
import { buildHref, parseSearchParams } from "@/lib/url-state";

export function BookSidebar(props: { idPrefix: string }) {
  const [searchParams] = useSearchParams();
  const homeHref = () =>
    buildHref({ delay: parseSearchParams(searchParams).delay });

  return (
    <div class="flex min-h-0 flex-1 flex-col">
      <FastLink
        aria-label="Solid Books home"
        class="hover:bg-card-dark -mx-2 inline-flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors"
        href={homeHref()}
      >
        <span class="bg-action/15 text-action grid size-8 shrink-0 place-items-center rounded-lg">
          <BookMark class="size-4" />
        </span>
        <span class="text-[15px] font-semibold tracking-tight">
          Solid Books
        </span>
      </FastLink>

      <div class="border-divider-dark bg-card-dark mt-5 rounded-xl border px-3.5 py-3.5">
        <CatalogSize />
      </div>

      <div class="mt-3">
        <ApiDelay idPrefix={props.idPrefix} />
      </div>

      <div class="mt-6 flex min-h-0 flex-1 flex-col">
        <p class="text-muted mb-3 text-[11px] font-semibold tracking-wide uppercase">
          Filters
        </p>
        <div class="flex min-h-0 flex-1 flex-col">
          <Errored
            fallback={<ErrorState compact title="Filters unavailable" />}
          >
            <BookFilters idPrefix={props.idPrefix} />
          </Errored>
        </div>
      </div>
    </div>
  );
}
