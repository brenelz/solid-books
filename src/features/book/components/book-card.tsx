import type { BookSummary } from "@/features/book/book-queries";
import {
  BookCover,
  BookCoverSkeleton,
} from "@/features/book/components/book-cover";
import { buildHref } from "@/lib/url-state";
import type { SearchParams } from "@/lib/url-state";

const GRID_SIZES =
  "(min-width: 1280px) 14vw, (min-width: 1024px) 16vw, (min-width: 768px) 20vw, (min-width: 640px) 25vw, 33vw";

type Props = {
  book: BookSummary;
  searchParams: SearchParams;
  priority: boolean;
};

export function BookCard(props: Props) {
  const back = () => buildHref(props.searchParams);
  const href = () =>
    back() === "/"
      ? `/${props.book.id}`
      : `/${props.book.id}?${back().slice(2)}`;

  return (
    <a
      class="focus-visible:ring-action focus-visible:ring-offset-surface-dark group relative block rounded-md transition-transform duration-200 ease-out hover:z-10 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      href={href()}
    >
      <BookCover
        class="group-hover:shadow-soft transition-shadow"
        priority={props.priority}
        sizes={GRID_SIZES}
        src={props.book.image_url}
        thumbhash={props.book.thumbhash}
        title={props.book.title}
      />
      <span class="sr-only">{props.book.title}</span>
    </a>
  );
}

export function BookCardSkeleton() {
  return <BookCoverSkeleton />;
}
