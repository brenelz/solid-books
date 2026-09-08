import type { JSX } from "@solidjs/web";
import { cn } from "@/lib/utils";

type Variant = "checkbox" | "default" | "search" | "unstyled";

type Props = {
  checked?: boolean;
  class?: string;
  id?: string;
  name?: string;
  onChange?: JSX.ChangeEventHandler<HTMLInputElement, Event>;
  onInput?: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
  placeholder?: string;
  ref?: (el: HTMLInputElement) => void;
  type?: JSX.InputHTMLAttributes<HTMLInputElement>["type"];
  variant?: Variant;
};

const base =
  "border-divider placeholder-gray focus:border-accent focus:ring-accent/25 dark:border-divider-dark disabled:bg-card disabled:text-muted dark:disabled:bg-card-dark w-full rounded-md border bg-white px-3 py-2 text-sm text-black transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#1c1c1c] dark:text-white";

const variants: Record<Variant, string> = {
  checkbox:
    "accent-action size-4 w-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
  default: base,
  search: cn(base, "h-11 rounded-lg pr-10 pl-10 text-base sm:text-sm"),
  unstyled: "",
};

export function Input(props: Props) {
  const variant = () =>
    props.type === "hidden" ? "unstyled" : (props.variant ?? "default");

  return (
    <input
      checked={props.checked}
      class={cn(variants[variant()], props.class)}
      id={props.id}
      name={props.name}
      onChange={(e) => props.onChange?.(e)}
      onInput={(e) => props.onInput?.(e)}
      placeholder={props.placeholder}
      ref={props.ref}
      type={props.type}
    />
  );
}
