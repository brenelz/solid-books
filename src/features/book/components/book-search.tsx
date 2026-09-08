import { createSignal, createUniqueId, onCleanup } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { SeedFromSearchParam } from "@/components/scripts/seed-from-search-param";
import { IconButton } from "@/components/ui/icon-button";
import { SearchIcon, XIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const DEBOUNCE_MS = 220;

export function BookSearch() {
  const [, setSearchParams] = useSearchParams();
  const [input, setInput] = createSignal<HTMLInputElement>();
  const [pending, setPending] = createSignal(false);
  const inputId = createUniqueId();
  let timer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    if (timer) clearTimeout(timer);
  });

  function navigate(value: string) {
    const query = value.trim();
    setSearchParams(
      { page: undefined, search: query },
      { replace: true, scroll: false },
    );
  }

  return (
    <form
      aria-busy={pending() ? "true" : undefined}
      class="relative flex-1"
      data-filtering={pending() ? "" : undefined}
      onSubmit={(event) => {
        event.preventDefault();
        if (timer) clearTimeout(timer);
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
        {pending() ? <Spinner class="size-4" /> : <SearchIcon class="size-4" />}
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
          if (timer) clearTimeout(timer);
          const el = input();
          if (el) el.value = "";
          navigate("");
          el?.focus();
        }}
      >
        <XIcon class="size-4" />
      </IconButton>
      <SeedFromSearchParam param="search" targetId={inputId} />
    </form>
  );
}
