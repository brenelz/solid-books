import { type JSX } from "@solidjs/web";
import { Show } from "solid-js";
import { cn } from "@/lib/utils";

type Variant = "ghost" | "primary" | "secondary";
type Size = "default" | "icon" | "sm";

type Props = {
  "aria-label"?: string;
  children?: JSX.Element;
  class?: string;
  href?: string;
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  size?: Size;
  type?: "button" | "submit";
  variant?: Variant;
};

const base =
  "focus-visible:ring-action/40 inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

const sizes: Record<Size, string> = {
  default: "h-9 px-4 text-sm",
  icon: "size-9",
  sm: "h-8 px-3 text-xs",
};

const variants: Record<Variant, string> = {
  ghost:
    "text-muted hover:bg-card hover:text-black dark:hover:bg-card-dark dark:hover:text-white",
  primary: "bg-action text-white hover:bg-action-hover",
  secondary:
    "border-divider hover:border-gray/40 hover:bg-card dark:border-divider-dark dark:hover:border-gray/30 dark:hover:bg-card-dark border bg-white text-black dark:bg-transparent dark:text-white",
};

export function buttonClasses(
  props: { class?: string; size?: Size; variant?: Variant } = {},
) {
  return cn(
    base,
    sizes[props.size ?? "default"],
    variants[props.variant ?? "primary"],
    props.class,
  );
}

export function Button(props: Props) {
  const classes = () =>
    buttonClasses({
      class: props.class,
      size: props.size,
      variant: props.variant,
    });

  return (
    <Show
      when={props.href}
      fallback={
        <button
          aria-label={props["aria-label"]}
          class={classes()}
          onClick={props.onClick}
          type={props.type ?? "button"}
        >
          {props.children}
        </button>
      }
    >
      <a aria-label={props["aria-label"]} class={classes()} href={props.href}>
        {props.children}
      </a>
    </Show>
  );
}
