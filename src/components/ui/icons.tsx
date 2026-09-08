import type { JSX } from "@solidjs/web";
import { cn } from "@/lib/utils";

type IconProps = { class?: string };

function Icon(props: IconProps & { children: JSX.Element; fill?: string }) {
  return (
    <svg
      aria-hidden="true"
      class={props.class ?? "size-4"}
      fill={props.fill ?? "none"}
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={2}
      viewBox="0 0 24 24"
    >
      {props.children}
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Icon>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Icon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m15 18-6-6 6-6" />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m9 18 6-6-6-6" />
    </Icon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

export function SlidersHorizontalIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 5H3" />
      <path d="M12 19H3" />
      <path d="M14 3v4" />
      <path d="M16 17v4" />
      <path d="M21 12H3" />
      <path d="M21 5h-7" />
      <path d="M21 19h-5" />
      <path d="M8 10v4" />
    </Icon>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </Icon>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Icon>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      class={cn("size-4", props.class)}
      fill="currentColor"
      stroke="none"
      viewBox="0 0 24 24"
    >
      <path d="M12 2.5 14.9 8.7l6.8.6-5.2 4.6 1.6 6.6L12 17.3 5.9 20.5l1.6-6.6-5.2-4.6 6.8-.6z" />
    </svg>
  );
}

export function SpinnerIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      class={cn("size-4 animate-spin", props.class)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
      <path
        class="opacity-90"
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="3"
      />
    </svg>
  );
}
