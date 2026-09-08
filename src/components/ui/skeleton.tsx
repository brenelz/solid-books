import { cn } from "@/lib/utils";

export function Skeleton(props: { class?: string }) {
  return <span aria-hidden="true" class={cn("skeleton-animation block", props.class)} />;
}
