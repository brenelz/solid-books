import { Show, createContext, createSignal, useContext } from "solid-js";
import type { JSX } from "@solidjs/web";
import { Button } from "@/components/ui/button";
import { SlidersHorizontalIcon, XIcon } from "@/components/ui/icons";

const MobileBookSidebarContext = createContext<{
  close: () => void;
  open: () => void;
}>();

export function MobileBookSidebar(props: { children: JSX.Element; sidebar: JSX.Element }) {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <MobileBookSidebarContext
      value={{
        close: () => setIsOpen(false),
        open: () => setIsOpen(true),
      }}
    >
      {props.children}
      <Show when={isOpen()}>
        <div
          aria-hidden="true"
          class="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] md:hidden"
          onClick={() => setIsOpen(false)}
        />
        <aside
          class="border-divider-dark bg-surface-dark fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-3rem))] max-w-full flex-col overflow-hidden border-r pt-[max(1.25rem,env(safe-area-inset-top))] pr-4 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] shadow-2xl md:hidden"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a[href]")) setIsOpen(false);
          }}
        >
          <button
            aria-label="Close filters"
            class="text-muted hover:bg-card-dark absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 grid size-9 place-items-center rounded-md hover:text-white"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            <XIcon class="size-5" />
          </button>
          {props.sidebar}
        </aside>
      </Show>
    </MobileBookSidebarContext>
  );
}

export function MobileBookSidebarTrigger() {
  const sidebar = useContext(MobileBookSidebarContext);

  return (
    <Button
      aria-label="Open filters"
      class="md:hidden"
      onClick={() => sidebar.open()}
      size="icon"
      variant="ghost"
    >
      <SlidersHorizontalIcon class="size-4" />
    </Button>
  );
}
