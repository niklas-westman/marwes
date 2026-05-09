<script lang="ts">
  import Button from "./Button.svelte";
  import type { ButtonProps } from "./types.js";
  type Props = Omit<ButtonProps, "variant" | "action" | "as">;
  let props: Props = $props();
</script>
<Button {...props} variant="secondary" action="button" as="button" iconRight={props.iconRight ?? "checkCircle"} />
