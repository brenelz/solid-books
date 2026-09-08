import { type Element } from "solid-js";
import { cn } from "@/lib/utils";

type Props = {
  hint: Element;
  id: string;
  label: string;
  onValueChange: (value: number) => void;
  readout?: Element;
  value: number;
  values: readonly number[];
};

export function Range(props: Props) {
  const index = () => {
    const exact = props.values.indexOf(props.value);
    if (exact >= 0) return exact;
    let closest = 0;
    let distance = Number.POSITIVE_INFINITY;
    props.values.forEach((candidate, i) => {
      const next = Math.abs(candidate - props.value);
      if (next < distance) {
        closest = i;
        distance = next;
      }
    });
    return closest;
  };

  return (
    <div class="flex flex-col gap-2">
      <div class="flex items-baseline justify-between gap-2">
        <label
          class="text-muted text-xs font-semibold tracking-wide uppercase"
          for={props.id}
        >
          {props.label}
        </label>
        <span class="text-sm font-medium text-black tabular-nums dark:text-white">
          {props.readout ?? props.value}
        </span>
      </div>
      <input
        class={cn(
          "focus-visible:ring-accent/30 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:outline-none",
        )}
        id={props.id}
        max={props.values.length - 1}
        min={0}
        onInput={(event) =>
          props.onValueChange(
            props.values[Number(event.currentTarget.value)] ?? props.value,
          )
        }
        step={1}
        type="range"
        value={index()}
      />
      <div class="text-muted flex justify-between text-[11px] tabular-nums">
        {props.hint}
      </div>
    </div>
  );
}
