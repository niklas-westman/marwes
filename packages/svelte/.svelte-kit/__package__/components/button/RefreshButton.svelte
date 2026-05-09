<script lang="ts">
  import Button from "./Button.svelte";
  import type { ButtonProps } from "./types.js";
  type Props = Omit<ButtonProps, "variant" | "action">;
  let props: Props = $props();
</script>
<Button {...props} variant="neutral" action="button" iconRight={props.iconRight ?? "refreshCw"} />
