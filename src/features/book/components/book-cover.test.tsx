import { captureArtifact } from "@solidjs/diagnostics";
import "@solidjs/diagnostics/vitest";
import { cleanup, render, screen } from "@solidjs/testing-library";
import "@testing-library/jest-dom/vitest";
import { createSignal, flush, For, Loading } from "solid-js";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { EMPTY_IMAGE_URL } from "@/features/book/book-constants";
import { loadBookCover } from "@/features/book/book-images";
import { BookCover } from "./book-cover";

let requests: {
  src: string;
  resolve: () => void;
  reject: (error: Error) => void;
}[];

beforeEach(() => {
  requests = [];
  vi.stubGlobal(
    "Image",
    class {
      src = "";

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
            <BookCover title={src} src={src} sizes="33vw" thumbhash={null} />
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
  }, { scenario: "book-covers-reveal-together" });

  expect(artifact).toHaveNoDiagnostics();
});

test("a failed cover releases Loading without hiding the other covers", async () => {
  render(() => (
    <Loading fallback={<p>Loading covers</p>}>
      <BookCover
        title="Broken book"
        src="/broken.jpg"
        sizes="33vw"
        thumbhash={null}
      />
      <BookCover
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
      <BookCover title="No cover" src={null} sizes="33vw" thumbhash={null} />
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
        <BookCover title="Book" src={src()} sizes="33vw" thumbhash={null} />
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
  expect(artifact).toStayWithinRerunBudget(2, { scope: "BookCover.decodedSrc" });
});

test("a preloaded cover renders immediately without a second decode", async () => {
  const ready = loadBookCover("/preloaded.jpg");
  requests[0].resolve();
  await ready;

  render(() => (
    <Loading fallback={<p>Loading cover</p>}>
      <BookCover title="Preloaded" src="/preloaded.jpg" sizes="33vw" thumbhash={null} />
    </Loading>
  ));
  flush();

  expect(requests).toHaveLength(1);
  expect(screen.queryByText("Loading cover")).not.toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Preloaded" })).toHaveAttribute("src", "/preloaded.jpg");
});
