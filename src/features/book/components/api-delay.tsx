import { createSignal } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { Range } from "@/components/ui/range";
import {
  API_DELAY_VALUES,
  formatApiDelay,
  getApiDelayMs,
  parseSearchParams,
} from "@/lib/url-state";

export function ApiDelay(props: { idPrefix: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [draft, setDraft] = createSignal<number>();
  const committed = () => getApiDelayMs(parseSearchParams(searchParams));
  const value = () => draft() ?? committed();

  return (
    <section class="border-divider-dark bg-card-dark/70 rounded-xl border px-3 py-3">
      <Range
        hint={
          <>
            <span>Off</span>
            <span>3s</span>
          </>
        }
        id={`${props.idPrefix}-api-delay`}
        label="API delay"
        onCommit={(next) => {
          setDraft(undefined);
          setSearchParams(
            { delay: next === 0 ? undefined : String(next) },
            { replace: true, scroll: false },
          );
        }}
        onValueChange={setDraft}
        readout={formatApiDelay(value())}
        value={value()}
        values={API_DELAY_VALUES}
      />
    </section>
  );
}
