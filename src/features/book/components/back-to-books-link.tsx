import { useNavigate } from "@solidjs/router";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const linkClass =
  "text-muted hover:bg-card-dark -ml-1.5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:text-white";

export function BackToBooksLink(props: { class?: string }) {
  const navigate = useNavigate();

  return (
    <button
      class={cn(linkClass, props.class)}
      onClick={() => {
        navigate(-1);
      }}
      type="button"
    >
      <ArrowLeftIcon class="size-4" />
      Back to books
    </button>
  );
}
