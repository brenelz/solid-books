import { For } from "solid-js";
import { StarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function StarRating(props: { class?: string; rating: number }) {
  const rounded = () => Math.round(props.rating * 2) / 2;

  return (
    <span
      aria-label={`Rated ${props.rating.toFixed(1)} out of 5`}
      class={cn("inline-flex items-center gap-0.5", props.class)}
      role="img"
    >
      <For each={[0, 1, 2, 3, 4]}>
        {(index) => {
          const active = () => index + 1 <= rounded() || index + 0.5 === rounded();
          return (
            <StarIcon
              class={
                active()
                  ? "text-warning fill-current"
                  : "text-divider dark:text-divider-dark fill-current"
              }
            />
          );
        }}
      </For>
    </span>
  );
}
