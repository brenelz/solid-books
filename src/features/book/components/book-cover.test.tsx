import { captureArtifact } from "@solidjs/diagnostics";
import "@solidjs/diagnostics/vitest";
import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import "@testing-library/jest-dom/vitest";
import { createSignal, flush, For, Loading, sharedConfig } from "solid-js";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { EMPTY_IMAGE_URL, ITEMS_PER_PAGE, PRIORITY_COVER_COUNT } from "@/features/book/book-constants";
import { COVER_REVEAL_TIMEOUT_MS, loadBookCover, preloadBookCovers } from "@/features/book/book-images";
import { BookCover } from "./book-cover";

let requests: {
  src: string;
  resolve: () => void;
  reject: (error: Error) => void;
}[];
let imageComplete: boolean;
let imageWidth: number;

beforeEach(() => {
  requests = [];
  imageComplete = false;
  imageWidth = 0;
  vi.stubGlobal(
    "Image",
    class {
      src = "";
      complete = imageComplete;
      naturalWidth = imageWidth;

      decode() {
        const { promise, resolve, reject } = Promise.withResolvers<void>();
        requests.push({ src: this.src, resolve, reject });
        return promise;
      }
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

async function settleImages() {
  await new Promise((resolve) => setTimeout(resolve, 0));
  flush();
}

test("starts covers in parallel and holds Loading until every cover is decoded", async () => {
  const { artifact } = await captureArtifact(async () => {
    render(() => (
      <Loading fallback={<p>Loading covers</p>}>
        <For
          each={["https://images.gr-assets.com/books/123m/456.jpg", "/second.jpg"]}
        >
          {(src) => (
            <BookCover priority title={src} src={src} sizes="33vw" thumbhash={null} />
          )}
        </For>
      </Loading>
    ));
    flush();

    expect(requests.map((request) => request.src)).toEqual([
      "https://images.gr-assets.com/books/123l/456.jpg",
      "/second.jpg",
    ]);
    expect(screen.getByText("Loading covers")).toBeInTheDocument();
    expect(screen.queryAllByRole("img")).toHaveLength(0);

    requests[1].resolve();
    await settleImages();
    expect(screen.getByText("Loading covers")).toBeInTheDocument();
    expect(screen.queryAllByRole("img")).toHaveLength(0);

    requests[0].resolve();
    await settleImages();
    expect(screen.queryByText("Loading covers")).not.toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getAllByRole("img")[0]).toHaveAttribute("src", requests[0].src);
    expect(screen.getAllByRole("img")[0]).toHaveAttribute("sizes", "33vw");
    expect(screen.getAllByRole("img")[0]).toHaveAttribute("loading", "eager");
    expect(screen.getAllByRole("img")[0]).toHaveAttribute("fetchpriority", "high");
    expect(screen.getAllByRole("img")[0]).toHaveAttribute("decoding", "async");
  }, { scenario: "book-covers-reveal-together" });

  expect(artifact).toHaveNoDiagnostics();
});

test("a failed cover releases Loading without hiding the other covers", async () => {
  render(() => (
    <Loading fallback={<p>Loading covers</p>}>
      <BookCover
        priority
        title="Broken book"
        src="/broken.jpg"
        sizes="33vw"
        thumbhash={null}
      />
      <BookCover
        priority
        title="Good book"
        src="/good.jpg"
        sizes="33vw"
        thumbhash={null}
      />
    </Loading>
  ));
  flush();

  requests[0].reject(new Error("Image could not be decoded"));
  requests[1].resolve();
  await settleImages();

  expect(screen.queryByText("Loading covers")).not.toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: "Cover unavailable for Broken book" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Good book" })).toHaveAttribute(
    "src", "/good.jpg",
  );
});

test("also waits for the no-photo image when a book has no cover URL", async () => {
  render(() => (
    <Loading fallback={<p>Loading cover</p>}>
      <BookCover priority title="No cover" src={null} sizes="33vw" thumbhash={null} />
    </Loading>
  ));
  flush();

  expect(requests[0].src).toBe(EMPTY_IMAGE_URL);
  expect(screen.getByText("Loading cover")).toBeInTheDocument();
  requests[0].resolve();
  await settleImages();
  expect(screen.getByRole("img", { name: "No cover" })).toHaveAttribute(
    "src", EMPTY_IMAGE_URL,
  );
});

test("keeps the previous decoded cover while replacing it and ignores stale decodes", async () => {
  const { artifact } = await captureArtifact(async () => {
    const [src, setSrc] = createSignal("/replace-first.jpg", { name: "test.coverSrc" });
    render(() => (
      <Loading fallback={<p>Loading cover</p>}>
        <BookCover priority title="Book" src={src()} sizes="33vw" thumbhash={null} />
      </Loading>
    ));
    flush();
    requests[0].resolve();
    await settleImages();

    setSrc("/replace-second.jpg");
    flush();
    setSrc("/replace-third.jpg");
    flush();
    expect(requests.map((request) => request.src)).toEqual([
      "/replace-first.jpg", "/replace-second.jpg", "/replace-third.jpg",
    ]);
    expect(screen.getByRole("img", { name: "Book" })).toHaveAttribute(
      "src", "/replace-first.jpg",
    );

    requests[1].resolve();
    await settleImages();
    expect(screen.getByRole("img", { name: "Book" })).toHaveAttribute(
      "src", "/replace-first.jpg",
    );

    requests[2].resolve();
    await settleImages();
    expect(screen.getByRole("img", { name: "Book" })).toHaveAttribute(
      "src", "/replace-third.jpg",
    );
    expect(screen.queryByText("Loading cover")).not.toBeInTheDocument();
  }, { scenario: "book-cover-source-change" });

  expect(artifact).toHaveNoDiagnostics();
  expect(artifact).toStayWithinRerunBudget(2, { scope: "BookCover.readySrc" });
});

test("a preloaded cover renders immediately without a second decode", async () => {
  const ready = loadBookCover("/preloaded.jpg");
  requests[0].resolve();
  await ready;

  render(() => (
    <Loading fallback={<p>Loading cover</p>}>
      <BookCover priority title="Preloaded" src="/preloaded.jpg" sizes="33vw" thumbhash={null} />
    </Loading>
  ));
  flush();

  expect(requests).toHaveLength(1);
  expect(screen.queryByText("Loading cover")).not.toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Preloaded" })).toHaveAttribute("src", "/preloaded.jpg");
});

test("a stalled cover releases the whole boundary after 500 ms and can still report an error", async () => {
  vi.useFakeTimers();
  render(() => (
    <Loading fallback={<p>Loading covers</p>}>
      <BookCover priority title="Slow" src="/slow.jpg" sizes="33vw" thumbhash={null} />
      <BookCover priority title="Fast" src="/fast.jpg" sizes="33vw" thumbhash={null} />
    </Loading>
  ));
  flush();
  requests[1].resolve();
  await vi.advanceTimersByTimeAsync(COVER_REVEAL_TIMEOUT_MS - 1);
  flush();
  expect(screen.getByText("Loading covers")).toBeInTheDocument();

  await vi.advanceTimersByTimeAsync(1);
  flush();
  expect(screen.queryByText("Loading covers")).not.toBeInTheDocument();
  expect(screen.getAllByRole("img")).toHaveLength(2);
  expect(screen.getByRole("img", { name: "Slow" })).toHaveAttribute("src", "/slow.jpg");
  expect(vi.getTimerCount()).toBe(0);

  // A late decode must not re-suspend the boundary or restart its timeout.
  requests[0].reject(new Error("Late decode failure"));
  await vi.advanceTimersByTimeAsync(0);
  expect(loadBookCover("/slow.jpg")).toBe("/slow.jpg");
  fireEvent.error(screen.getByRole("img", { name: "Slow" }));
  flush();
  expect(screen.getByRole("img", { name: "Cover unavailable for Slow" })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Fast" })).toHaveAttribute("src", "/fast.jpg");
});

test("lazy covers render immediately, without preloading or holding Loading", () => {
  render(() => (
    <Loading fallback={<p>Loading cover</p>}>
      <BookCover title="Lazy" src="/lazy.jpg" sizes="33vw" thumbhash={null} />
    </Loading>
  ));
  flush();

  expect(requests).toHaveLength(0);
  expect(screen.queryByText("Loading cover")).not.toBeInTheDocument();
  const image = screen.getByRole("img", { name: "Lazy" });
  expect(image).toHaveAttribute("src", "/lazy.jpg");
  expect(image).toHaveAttribute("loading", "lazy");
  expect(image).not.toHaveAttribute("fetchpriority");

  fireEvent.error(image);
  flush();
  expect(screen.getByRole("img", { name: "Cover unavailable for Lazy" })).toBeInTheDocument();
});

test("already complete covers do not decode or suspend", () => {
  imageComplete = true;
  imageWidth = 100;
  render(() => (
    <Loading fallback={<p>Loading cover</p>}>
      <BookCover priority title="Cached" src="/browser-cached.jpg" sizes="33vw" thumbhash={null} />
    </Loading>
  ));
  flush();

  expect(requests).toHaveLength(0);
  expect(screen.queryByText("Loading cover")).not.toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Cached" })).toHaveAttribute("src", "/browser-cached.jpg");
});

test("hydration skips decoding without marking the image ready for later navigation", () => {
  const hydrating = sharedConfig.hydrating;
  try {
    sharedConfig.hydrating = true;
    expect(loadBookCover("/hydrated.jpg")).toBe("/hydrated.jpg");
    expect(requests).toHaveLength(0);
  } finally {
    sharedConfig.hydrating = hydrating;
  }

  const pending = loadBookCover("/hydrated.jpg");
  expect(pending).toBeInstanceOf(Promise);
  expect(requests).toHaveLength(1);
  requests[0].resolve();
  return pending;
});

test("grid preloading starts only priority covers in parallel and preserves the whole page", async () => {
  const books = Array.from({ length: ITEMS_PER_PAGE }, (_, index) => ({
    image_url: `/page-${index}.jpg`,
  }));
  const pending = preloadBookCovers(books);

  expect(requests.map((request) => request.src)).toEqual(
    books.slice(0, PRIORITY_COVER_COUNT).map((book) => book.image_url),
  );
  requests.forEach((request) => request.resolve());
  expect(await pending).toBe(books);
  expect(preloadBookCovers(books)).toBe(books);
  expect(requests).toHaveLength(PRIORITY_COVER_COUNT);
});
