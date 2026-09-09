import { createRouter } from "@solidjs/router";
import { renderToStream, renderToString } from "@solidjs/web";
import { expect, test, vi } from "vitest";
import { getBookById, getBooksPage } from "@/api";
import type { BookDetails } from "@/features/book/book-queries";
import { EMPTY_IMAGE_URL, ITEMS_PER_PAGE, PRIORITY_COVER_COUNT } from "@/features/book/book-constants";
import { BookCoverPreloads } from "./book-cover-preloads";
import { BookGrid } from "./book-grid";
import Home from "@/routes/index";
import BookPage from "@/routes/[id]";

vi.mock("@/api", () => ({
  getBooksPage: vi.fn(),
  getBooksCount: async () => 1,
  getBookById: vi.fn(),
}));

const book: BookDetails = {
  id: 1,
  title: "Dune",
  image_url: "https://images.gr-assets.com/books/1426192671m/53732.jpg",
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

function imagePreloads(html: string) {
  // Neither serialized JavaScript nor inert templates start image fetches.
  const markup = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/g, "");
  return [...markup.matchAll(/<link\b[^>]*>/g)]
    .map(([tag]) => tag)
    .filter((tag) => tag.includes('rel="preload"') && tag.includes('as="image"'))
    .map((tag) => tag.match(/\bhref="([^"]+)"/)?.[1]);
}

test.each(["/?search=Dune", "/1"])(
  "%s streams its skeleton first, then real covers and discoverable hints without hydration",
  async (url) => {
    const data = Promise.withResolvers<BookDetails>();
    vi.mocked(getBooksPage).mockReturnValue(data.promise.then((book) => [book]));
    vi.mocked(getBookById).mockReturnValue(data.promise);
    const Router = createRouter({
      routes: [
        { path: "/", component: Home },
        { path: "/:id", component: BookPage },
      ],
    });
    const errors: unknown[] = [];
    const stream = renderToStream(() => <Router url={url} />, {
      onError: (error) => errors.push(error),
    });
    const reader = stream.readable.getReader();
    const decoder = new TextDecoder();
    const first = await reader.read();
    const shell = decoder.decode(first.value, { stream: true });

    // Only release data after the shell has actually been sent.
    data.resolve(book);
    let html = shell;
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      html += decoder.decode(chunk.value, { stream: true });
    }

    expect(shell).toContain("skeleton-subtle");
    expect(imagePreloads(shell)).toEqual([]);
    expect(imagePreloads(html)).toEqual([
      "https://images.gr-assets.com/books/1426192671l/53732.jpg",
    ]);
    expect(html).not.toContain("client-only content");
    expect(html).toMatch(/<img\b[^>]*src="https:\/\/images.gr-assets.com\/books\/1426192671l\/53732.jpg"/);
    expect(html).toContain('loading="eager"');
    expect(html).toContain('fetchpriority="high"');
    expect(errors).toEqual([]);
    if (url.startsWith("/?")) {
      expect(getBooksPage).toHaveBeenCalledWith(
        expect.objectContaining({ search: "Dune" }), 0,
      );
    } else {
      expect(getBookById).toHaveBeenCalledWith("1", 0);
    }
  },
);

test("cover hints deduplicate normalized URLs and include the no-photo fallback", () => {
  const largeUrl = "https://images.gr-assets.com/books/1426192671l/53732.jpg";
  let head = "";
  renderToString(() => (
    <BookCoverPreloads books={[
      { image_url: book.image_url },
      { image_url: largeUrl },
      { image_url: null },
      { image_url: null },
    ]} />
  ), { onHead: (html) => { head = html; } });

  expect(imagePreloads(head)).toEqual([largeUrl, EMPTY_IMAGE_URL]);
});

test("the shell renders every cover immediately and preloads only the eager window", () => {
  const books = Array.from({ length: ITEMS_PER_PAGE }, (_, index) => ({
    ...book,
    id: index + 1,
    image_url: `/shell-${index}.jpg`,
  }));
  let head = "";
  const html = renderToString(() => (
    <>
      <BookCoverPreloads books={books} />
      <BookGrid books={books} searchParams={{}} />
    </>
  ), { onHead: (html) => { head = html; } });

  expect(imagePreloads(head)).toEqual(
    books.slice(0, PRIORITY_COVER_COUNT).map((book) => book.image_url),
  );
  expect(html.match(/<img\b/g)).toHaveLength(ITEMS_PER_PAGE);
  expect(html.match(/loading="eager"/g)).toHaveLength(PRIORITY_COVER_COUNT);
  expect(html.match(/loading="lazy"/g)).toHaveLength(ITEMS_PER_PAGE - PRIORITY_COVER_COUNT);
  expect(html.match(/fetchpriority="high"/g)).toHaveLength(PRIORITY_COVER_COUNT);
  expect(head.match(/fetchpriority="high"/g)).toHaveLength(PRIORITY_COVER_COUNT);
});

test("empty results produce no image preload hints", () => {
  let head = "";
  renderToString(() => <BookCoverPreloads books={[]} />, {
    onHead: (html) => { head = html; },
  });
  expect(imagePreloads(head)).toEqual([]);
});

test("a missing book keeps its error state and emits no cover hint", async () => {
  vi.mocked(getBookById).mockRejectedValueOnce(new Error("Book not found"));
  const Router = createRouter({
    routes: [{ path: "/:id", component: BookPage }],
  });
  const errors: unknown[] = [];
  const html = await renderToStream(() => <Router url="/999" />, {
    onError: (error) => errors.push(error),
  });

  expect(errors).toEqual([]);
  expect(html).toContain("Book not found");
  expect(imagePreloads(html)).toEqual([]);
});
