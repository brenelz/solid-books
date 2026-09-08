import { cn } from "@/lib/utils";

export function Skeleton(props: { class?: string }) {
  return <div aria-hidden="true" class={cn("skeleton-animation", props.class)} />;
}
