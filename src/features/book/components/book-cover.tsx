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
  return (
    <div
      class={cn(
        "bg-card-dark relative aspect-[2/3] w-full overflow-hidden rounded-md",
        props.class,
      )}
    >
      <img
        alt={props.title}
        class="absolute inset-0 h-full w-full object-cover"
        sizes={props.sizes}
        src={getLargeBookImageUrl(props.src ?? EMPTY_IMAGE_URL)}
      />
    </div>
  );
}

export function BookCoverSkeleton(props: { class?: string }) {
  return <Skeleton class={cn("skeleton-subtle aspect-[2/3] w-full rounded-md", props.class)} />;
}
