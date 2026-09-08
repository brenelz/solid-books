import { SpinnerIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function Spinner(props: { class?: string }) {
  return <SpinnerIcon class={cn("size-4 shrink-0", props.class)} />;
}
