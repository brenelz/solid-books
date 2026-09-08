import "./load-env";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pLimit from "p-limit";
import sharp from "sharp";
import * as ThumbHash from "thumbhash";
import { EMPTY_IMAGE_URL } from "@/features/book/book-constants";
import { closeSql, requireSql } from "./drizzle";
import { processEntities } from "./seed-utils";

const BATCH_SIZE = 900;
const CHECKPOINT_FILE = "thumbhash_update_checkpoint.json";
const TOTAL_BOOKS = 4; // 2360655 in full dataset, 4 in sample data
const CONCURRENCY_LIMIT = 10;

interface BookData {
  image_url: string | null;
}

const limit = pLimit(CONCURRENCY_LIMIT);

async function fetchImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch image: ${url} - Status: ${response.status}`);
      return null;
    }
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error(`Error fetching image: ${url}`, error);
    return null;
  }
}

async function generateThumbHash(imageBuffer: Buffer): Promise<string | null> {
  try {
    const { data, info } = await sharp(imageBuffer)
      .resize(100, 100, { fit: "inside" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const binaryThumbHash = ThumbHash.rgbaToThumbHash(info.width, info.height, data);
    return Buffer.from(binaryThumbHash).toString("base64");
  } catch (error) {
    console.error("Error generating thumbhash:", error);
    return null;
  }
}

async function processBook(book: BookData): Promise<[string, string] | null> {
  if (book.image_url && book.image_url !== EMPTY_IMAGE_URL) {
    const imageBuffer = await fetchImage(book.image_url);
    if (imageBuffer) {
      const thumbHash = await generateThumbHash(imageBuffer);
      if (thumbHash) {
        return [thumbHash, book.image_url];
      }
    }
  }
  return null;
}

const updateThumbhashQuery = `
  UPDATE books
  SET thumbhash = $1
  WHERE image_url = $2
`;

async function batchUpdateThumbHash(batch: BookData[]) {
  const sql = requireSql();
  const processedBooks = await Promise.all(batch.map((book) => limit(() => processBook(book))));

  await sql.begin(async (tx) => {
    for (const result of processedBooks) {
      if (!result) continue;
      const [thumbHash, imageUrl] = result;
      await tx.unsafe(updateThumbhashQuery, [thumbHash, imageUrl]);
    }
  });
}

async function main() {
  try {
    requireSql();
    const bookCount = await processEntities<BookData>(
      path.resolve(fileURLToPath(new URL("./books.json", import.meta.url))),
      CHECKPOINT_FILE,
      BATCH_SIZE,
      batchUpdateThumbHash,
      TOTAL_BOOKS,
    );
    console.log(`Updated thumbhash for ${bookCount.toLocaleString()} / ${TOTAL_BOOKS.toLocaleString()} books`);
  } catch (error) {
    console.error("Error updating thumbhash:", error);
    process.exitCode = 1;
  } finally {
    await closeSql();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
