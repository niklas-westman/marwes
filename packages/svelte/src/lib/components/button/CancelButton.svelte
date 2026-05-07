<script lang="ts">
  import Button from "./Button.svelte";
  import type { ButtonProps } from "./types.js";
  type Props = Omit<ButtonProps, "action">;
  let props: Props = $props();
</script>
<Button {...props} action="cancel" variant={props.variant ?? "secondary"} />
