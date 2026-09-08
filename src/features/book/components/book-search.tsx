import { createSignal, createUniqueId, isPending } from "solid-js";
import { useLocation, useNavigate, useSearchParams } from "@solidjs/router";
import { IconButton } from "@/components/ui/icon-button";
import { SearchIcon, XIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { buildHref, parseSearchParams } from "@/lib/url-state";

export function BookSearch() {
  const location = useLocation();
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();
  const [input, setInput] = createSignal<HTMLInputElement>();
  const inputId = createUniqueId();

  function navigate(value: string) {
    const query = value.trim();
    const current = parseSearchParams(searchParams);
    const next = { ...current, search: query || undefined };
    delete next.page;
    if (!next.search) delete next.search;
    navigateTo(buildHref(next), {
      replace: location.pathname === "/",
      scroll: false,
    });
  }

  return (
    <form
      aria-busy={isPending(() => searchParams.search) ? "true" : undefined}
      class="relative flex-1"
      data-filtering={isPending(() => searchParams.search) ? "" : undefined}
      onSubmit={(event) => {
        event.preventDefault();
        navigate(input()?.value ?? "");
      }}
      role="search"
    >
      <label class="sr-only" for={inputId}>
        Search books
      </label>
      <span
        aria-hidden="true"
        class="text-muted pointer-events-none absolute top-1/2 left-3.5 flex size-4 -translate-y-1/2 items-center justify-center"
      >
        {isPending(() => searchParams.search) ? (
          <Spinner class="size-4" />
        ) : (
          <SearchIcon class="size-4" />
        )}
      </span>
      <Input
        class="peer"
        id={inputId}
        name="search"
        onInput={(event) => {
          const { value } = event.currentTarget as HTMLInputElement;
          navigate(value);
        }}
        placeholder="Search books…"
        ref={setInput}
        type="search"
        variant="search"
      />
      <IconButton
        class="absolute top-1/2 right-1.5 -translate-y-1/2 peer-placeholder-shown:hidden"
        label="Clear search"
        onClick={() => {
          const el = input();
          if (el) el.value = "";
          navigate("");
          el?.focus();
        }}
      >
        <XIcon class="size-4" />
      </IconButton>
    </form>
  );
}
