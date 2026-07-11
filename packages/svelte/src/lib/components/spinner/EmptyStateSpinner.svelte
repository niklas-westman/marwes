<script lang="ts">
  import { mergeStyle } from "../../internal/css-vars.js";
  import Spinner from "./Spinner.svelte";
  import type { EmptyStateSpinnerProps } from "./types.js";

  let { dataAttributes, ...props }: EmptyStateSpinnerProps = $props();
</script>

<Spinner
  {...props}
  variant={props.variant ?? "dots-round"}
  size={props.size ?? "lg"}
  decorative={props.decorative ?? true}
  dataAttributes={{
    ...dataAttributes,
    "data-purpose": "empty-state",
    "data-context": "empty-state",
  }}
/>
