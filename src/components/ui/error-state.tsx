import { type JSX } from "@solidjs/web";
import { Show } from "solid-js";
import { AlertTriangleIcon } from "@/components/ui/icons";

export function ErrorState(props: {
  body?: string;
  children?: JSX.Element;
  compact?: boolean;
  title?: string;
}) {
  return (
    <Show
      when={props.compact}
      fallback={
        <div class="grid flex-1 place-items-center px-6 py-20 text-center">
          <div class="flex max-w-sm flex-col items-center gap-3">
            <AlertTriangleIcon class="text-danger size-6" />
            <p class="text-sm font-medium text-black dark:text-white">
              {props.title ?? "Something went wrong"}
            </p>
            {props.body ? (
              <p class="text-muted text-sm leading-6">{props.body}</p>
            ) : null}
            {props.children}
          </div>
        </div>
      }
    >
      <div class="flex flex-col items-center gap-2 px-4 py-6 text-center">
        <AlertTriangleIcon class="text-danger size-4" />
        <p class="text-muted text-xs">
          {props.title ?? "Something went wrong"}
        </p>
        {props.body ? (
          <p class="text-muted text-xs leading-5">{props.body}</p>
        ) : null}
        {props.children}
      </div>
    </Show>
  );
}
