<script lang="ts">
  import { createPurposeSemanticAttributes } from "@marwes-ui/core";
  import Button from "./Button.svelte";
  import type { ButtonProps } from "./types.js";
  type Props = Omit<ButtonProps, "variant" | "action" | "as">;
  let { dataAttributes, ...props }: Props = $props();
</script>
<Button {...props} variant="text" action="navigate" as="a" dataAttributes={{ ...dataAttributes, ...createPurposeSemanticAttributes("navigation") }} />
