import { query } from "@solidjs/router";
import {
  getBookById as loadBookById,
  getBooksCount as loadBooksCount,
  getBooksPage as loadBooksPage,
} from "./features/book/book-queries";
import type { BookFilters, BookQuery } from "./features/book/book-utils";

export const getBooksPage = query(async function getBooksPage(
  bookQuery: BookQuery,
) {
  "use server";
  return loadBooksPage(bookQuery);
}, "getBooksPage");

export const getBooksCount = query(async function getBooksCount(
  filters: BookFilters,
) {
  "use server";
  return loadBooksCount(filters);
}, "getBooksCount");

export const getBookById = query(async function getBookById(id: string) {
  "use server";
  return loadBookById(id);
}, "getBookById");
