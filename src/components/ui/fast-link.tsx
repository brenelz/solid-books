import type { JSX } from "@solidjs/web";

type Props = {
  "aria-label"?: string;
  children?: JSX.Element;
  class?: string;
  href: string;
  prefetch?: boolean;
};

export function FastLink(props: Props) {
  return (
    <a aria-label={props["aria-label"]} class={props.class} href={props.href}>
      {props.children}
    </a>
  );
}
