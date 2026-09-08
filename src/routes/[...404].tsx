import { Title } from "@solidjs/meta";
import type { RouteDefinition } from "@solidjs/router";
import { httpStatus } from "@solidjs/web";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const route = {
  preload: () => httpStatus(404),
} satisfies RouteDefinition;

export default function NotFound() {
  return (
    <>
      <Title>Page not found · Solid Books</Title>
      <EmptyState body="That page isn't in the catalog." title="Page not found">
        <Button class="mt-1" href="/" variant="secondary">
          Back to the shelf
        </Button>
      </EmptyState>
    </>
  );
}
