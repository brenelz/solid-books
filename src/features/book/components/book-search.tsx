import { createSignal, createUniqueId, isPending } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { IconButton } from "@/components/ui/icon-button";
import { SearchIcon, XIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function BookSearch() {
  const [, setSearchParams] = useSearchParams();
  const [input, setInput] = createSignal<HTMLInputElement>();
  const inputId = createUniqueId();

  function navigate(value: string) {
    const query = value.trim();
    setSearchParams(
      { page: undefined, search: query },
      { replace: true, scroll: false },
    );
  }

  return (
    <form
      aria-busy={isPending(input) ? "true" : undefined}
      class="relative flex-1"
      data-filtering={isPending(input) ? "" : undefined}
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
        {isPending(input) ? (
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
