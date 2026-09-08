import { query } from "@solidjs/router";
import {
  getBookById as loadBookById,
  getBooksCount as loadBooksCount,
  getBooksPage as loadBooksPage,
} from "./features/book/book-queries";
import type { BookFilters, BookQuery } from "./features/book/book-utils";
import { MAX_API_DELAY_MS } from "./lib/url-state";
import { delay } from "./lib/utils";

function waitForApiDelay(requestedMs = 0) {
  const envMs = Number(process.env.API_DELAY_MS ?? 0);
  const uiMs = Number.isFinite(requestedMs)
    ? Math.min(MAX_API_DELAY_MS, Math.max(0, requestedMs))
    : 0;
  const ms = uiMs > 0 ? uiMs : envMs;
  return delay(ms, ms > 0);
}

export const getBooksPage = query(async function getBooksPage(
  bookQuery: BookQuery,
  delayMs = 0,
) {
  "use server";
  await waitForApiDelay(delayMs);
  return loadBooksPage(bookQuery);
}, "getBooksPage");

export const getBooksCount = query(async function getBooksCount(
  filters: BookFilters,
  delayMs = 0,
) {
  "use server";
  await waitForApiDelay(delayMs);
  return loadBooksCount(filters);
}, "getBooksCount");

export const getBookById = query(async function getBookById(
  id: string,
  delayMs = 0,
) {
  "use server";
  await waitForApiDelay(delayMs);
  return loadBookById(id);
}, "getBookById");
