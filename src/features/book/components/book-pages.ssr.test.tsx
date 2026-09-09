import { createRouter, memoryHistory } from "@solidjs/router";
import { renderToStream } from "@solidjs/web";
import { expect, test, vi } from "vitest";
import Home from "@/routes/index";
import BookPage from "@/routes/[id]";

vi.mock("@/api", () => {
  const loadBook = async () => {
    // Let the shell flush before book data reveals its cover dependency.
    await new Promise((resolve) => setTimeout(resolve, 10));
    return {
      id: 1,
      title: "Dune",
      image_url: "/dune.jpg",
      thumbhash: null,
      isbn: null,
      publisher: null,
      description: null,
      num_pages: null,
      language_code: null,
      ratings_count: null,
      publication_year: null,
      average_rating: null,
      authors: [],
    };
  };
  return {
    getBooksPage: async () => [await loadBook()],
    getBooksCount: async () => 1,
    getBookById: loadBook,
  };
});

test.each(["/?search=Dune", "/1"])(
  "%s streams its skeleton without a late client-only handoff error",
  async (url) => {
    const Router = createRouter({
      history: memoryHistory(url),
      routes: [
        { path: "/", component: Home },
        { path: "/:id", component: BookPage },
      ],
    });
    const errors: unknown[] = [];
    const html = await renderToStream(() => <Router />, {
      onError: (error) => errors.push(error),
    });

    expect(html).toContain("skeleton-subtle");
    expect(html).not.toContain("client-only content");
    expect(errors).toEqual([]);
  },
);
