<script lang="ts">
  import { mergeStyle } from "../../internal/css-vars.js";
  import Spinner from "./Spinner.svelte";
  import type { SpinnerProps } from "./types.js";

  type Props = SpinnerProps;
  let props: Props = $props();
</script>

<Spinner
  {...props}
  variant={props.variant ?? "dots-round"}
  size={props.size ?? "lg"}
  decorative={props.decorative ?? true}
/>
