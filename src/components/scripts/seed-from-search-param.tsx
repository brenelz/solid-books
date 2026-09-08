import { createEffect } from "solid-js";
import { useSearchParams } from "@solidjs/router";

export function SeedFromSearchParam(props: { param: string; targetId: string }) {
  const [params] = useSearchParams();

  createEffect(
    () => params[props.param],
    (value) => {
      const next = Array.isArray(value) ? value[0] : value;
      const el = document.getElementById(props.targetId);
      if (el instanceof HTMLInputElement && document.activeElement !== el) {
        el.value = next ?? "";
      }
    },
  );

  return null;
}
