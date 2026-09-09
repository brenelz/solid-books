import { createMemo, Show } from "solid-js";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EMPTY_IMAGE_URL,
  getLargeBookImageUrl,
} from "@/features/book/book-constants";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  src: string | null;
  thumbhash: string | null;
  sizes: string;
  class?: string;
};

export function BookCover(props: Props) {
  const decodedSrc = createMemo(
    () => {
      const src = getLargeBookImageUrl(props.src ?? EMPTY_IMAGE_URL);
      const image = new Image();
      image.src = src;

      return image.decode().then(
        () => src,
        () => null,
      );
    },
    // Browser-only decoding keeps the parent Loading fallback through hydration.
    { name: "BookCover.decodedSrc", ssrSource: "client" },
  );

  return (
    <div
      class={cn(
        "bg-card-dark relative aspect-[2/3] w-full overflow-hidden rounded-md",
        props.class,
      )}
    >
      <Show
        when={decodedSrc()}
        fallback={
          <div
            role="img"
            aria-label={`Cover unavailable for ${props.title}`}
            class="text-muted absolute inset-0 flex items-center justify-center p-3 text-center text-sm"
          >
            Cover unavailable
          </div>
        }
      >
        {(src) => (
          <img
            alt={props.title}
            class="absolute inset-0 h-full w-full object-cover"
            sizes={props.sizes}
            src={src()}
          />
        )}
      </Show>
    </div>
  );
}

export function BookCoverSkeleton(props: { class?: string }) {
  return <Skeleton class={cn("skeleton-subtle aspect-[2/3] w-full rounded-md", props.class)} />;
}
