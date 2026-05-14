<script lang="ts">
  import Button from "./Button.svelte";
  import type { ButtonProps } from "./types.js";
  type Props = Omit<ButtonProps, "variant" | "as">;
  let props: Props = $props();
</script>
<Button {...props} variant="primary" as="button" />
