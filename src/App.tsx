import { Title } from "@solidjs/meta";
import { env } from "virtual:env/client";
import { MobileBookSidebar, MobileBookSidebarTrigger } from "@/components/mobile-book-sidebar";
import { BookSearch } from "@/features/book/components/book-search";
import { BookSidebar } from "@/features/book/components/book-sidebar";
import { Router } from "./router";
import "./app.css";

export default function App() {
  return (
    <Router>
      {(props) => (
        <>
          <Title>{env.VITE_APP_NAME}</Title>
          <MobileBookSidebar sidebar={<BookSidebar idPrefix="mobile" />}>
            <div class="group flex h-dvh overflow-hidden">
              <aside class="border-divider-dark bg-surface-dark hidden h-full w-72 shrink-0 flex-col border-r px-4 py-5 md:flex">
                <BookSidebar idPrefix="desktop" />
              </aside>

              <div class="flex min-h-0 min-w-0 flex-1 flex-col">
                <header class="border-divider-dark bg-surface-dark/80 z-20 flex shrink-0 items-center gap-2 border-b px-4 py-3 backdrop-blur-md backdrop-saturate-150 sm:gap-3 sm:px-6">
                  <MobileBookSidebarTrigger />
                  <BookSearch />
                </header>

                <main class="flex min-h-0 min-w-0 flex-1 flex-col">
                  {props.children}
                </main>
              </div>
            </div>
          </MobileBookSidebar>
        </>
      )}
    </Router>
  );
}
