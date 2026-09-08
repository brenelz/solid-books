import { For, createMemo, createSignal, isPending } from "solid-js";
import type { JSX } from "@solidjs/web";
import { useSearchParams } from "@solidjs/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Range } from "@/components/ui/range";
import { Select } from "@/components/ui/select";
import {
  LANGUAGES,
  LISTS,
  MAX_PAGES,
  MAX_RATING,
  MAX_YEAR,
  MIN_PAGES,
  MIN_RATING,
  MIN_YEAR,
  PAGE_FILTER_VALUES,
  RATING_FILTER_VALUES,
  YEAR_FILTER_VALUES,
} from "@/features/book/book-constants";
import { parseSearchParams, withFilters } from "@/lib/url-state";
import type { SearchParams } from "@/lib/url-state";
import { cn } from "@/lib/utils";

function BookFiltersForm(props: {
  idPrefix: string;
  initialParams: SearchParams;
}) {
  const [, setSearchParams] = useSearchParams();
  const [filters, setFilters] = createSignal(() => props.initialParams);

  const activeCount = createMemo(
    () =>
      Object.entries(filters()).filter(
        ([key, value]) => key !== "page" && Boolean(value),
      ).length,
  );

  function commit(patch: Partial<SearchParams>) {
    const next = withFilters(filters(), patch);
    setFilters(next);
    // setSearchParams merges; omitted keys are left in the URL.
    setSearchParams(
      { ...next, ...patch, page: undefined },
      { replace: true, scroll: false },
    );
  }

  function reset() {
    setFilters({});
    setSearchParams(
      {
        year: undefined,
        rating: undefined,
        pages: undefined,
        language: undefined,
        list: undefined,
        page: undefined,
      },
      { replace: true, scroll: false },
    );
  }

  return (
    <div
      class="flex min-h-0 flex-1 flex-col"
      data-filtering={isPending(filters) ? "" : undefined}
    >
      <div class="sidebar-scroll min-h-0 flex-1 touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain pb-4">
        <div class="flex flex-col gap-3">
          <FilterCard>
            <Range
              hint={
                <>
                  <span>{MIN_YEAR}</span>
                  <span>{MAX_YEAR}</span>
                </>
              }
              id={`${props.idPrefix}-filter-year`}
              label="Published before"
              onValueChange={(value) =>
                commit({ year: value === MAX_YEAR ? undefined : String(value) })
              }
              readout={filters().year ? filters().year : "Any year"}
              value={Number(filters().year ?? MAX_YEAR)}
              values={YEAR_FILTER_VALUES}
            />
          </FilterCard>

          <FilterCard>
            <Range
              hint={
                <>
                  <span>Any</span>
                  <span>{MAX_RATING} stars</span>
                </>
              }
              id={`${props.idPrefix}-filter-rating`}
              label="Minimum rating"
              onValueChange={(value) =>
                commit({
                  rating: value === MIN_RATING ? undefined : String(value),
                })
              }
              readout={
                Number(filters().rating) > 0
                  ? `${filters().rating}+ stars`
                  : "Any rating"
              }
              value={Number(filters().rating ?? MIN_RATING)}
              values={RATING_FILTER_VALUES}
            />
          </FilterCard>

          <FilterCard>
            <Range
              hint={
                <>
                  <span>{MIN_PAGES}</span>
                  <span>{MAX_PAGES.toLocaleString()}</span>
                </>
              }
              id={`${props.idPrefix}-filter-pages`}
              label="Max pages"
              onValueChange={(value) =>
                commit({
                  pages: value === MAX_PAGES ? undefined : String(value),
                })
              }
              readout={
                filters().pages
                  ? `${Number(filters().pages).toLocaleString()} pages`
                  : "Any length"
              }
              value={Number(filters().pages ?? MAX_PAGES)}
              values={PAGE_FILTER_VALUES}
            />
          </FilterCard>

          <FilterCard>
            <div class="flex flex-col gap-2">
              <label
                class="text-muted text-xs font-semibold tracking-wide uppercase"
                for={`${props.idPrefix}-filter-language`}
              >
                Language
              </label>
              <Select
                id={`${props.idPrefix}-filter-language`}
                onChange={(event) =>
                  commit({ language: event.currentTarget.value || undefined })
                }
                value={filters().language ?? "en"}
              >
                <For each={LANGUAGES}>
                  {(language) => (
                    <option value={language.value}>{language.label}</option>
                  )}
                </For>
              </Select>
            </div>
          </FilterCard>

          <FilterCard>
            <fieldset class="flex flex-col gap-1">
              <legend class="text-muted mb-2 text-xs font-semibold tracking-wide uppercase">
                Book lists
              </legend>
              <For each={LISTS}>
                {(list) => {
                  const selected = () => filters().list === list.slug;
                  return (
                    <label
                      class={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                        selected()
                          ? "bg-action/15 text-white"
                          : "text-gray hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Input
                        checked={selected()}
                        onChange={() =>
                          commit({ list: selected() ? undefined : list.slug })
                        }
                        type="checkbox"
                        variant="checkbox"
                      />
                      {list.name}
                    </label>
                  );
                }}
              </For>
            </fieldset>
          </FilterCard>
        </div>
      </div>

      {activeCount() > 0 ? (
        <div class="border-divider-dark border-t pt-3">
          <Button class="w-full" onClick={reset} variant="secondary">
            Clear all filters
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function FilterCard(props: { children: JSX.Element }) {
  return (
    <section class="border-divider-dark bg-card-dark/70 rounded-xl border px-3 py-3">
      {props.children}
    </section>
  );
}

export function BookFiltersFallback(props: { idPrefix: string }) {
  return <BookFiltersForm idPrefix={props.idPrefix} initialParams={{}} />;
}

export function BookFilters(props: { idPrefix: string }) {
  const [searchParams] = useSearchParams();
  return (
    <BookFiltersForm
      idPrefix={props.idPrefix}
      initialParams={parseSearchParams(searchParams)}
    />
  );
}
