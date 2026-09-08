import type { JSX } from "@solidjs/web";
import { BookMark } from "@/components/book-mark";

export function EmptyState(props: { body?: string; children?: JSX.Element; title: string }) {
  return (
    <div class="grid flex-1 place-items-center px-6 py-20 text-center">
      <div class="flex max-w-sm flex-col items-center gap-3">
        <BookMark animated class="mb-1 size-10" />
        <p class="text-sm font-medium">{props.title}</p>
        {props.body ? <p class="text-muted text-sm leading-6">{props.body}</p> : null}
        {props.children}
      </div>
    </div>
  );
}
