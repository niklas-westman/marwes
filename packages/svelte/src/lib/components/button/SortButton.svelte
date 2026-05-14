<script lang="ts">
  import { createPurposeSemanticAttributes } from "@marwes-ui/core";
  import Button from "./Button.svelte";
  import type { ButtonProps } from "./types.js";
  type Props = Omit<ButtonProps, "variant" | "action">;
  let { dataAttributes, ...props }: Props = $props();
</script>
<Button {...props} variant="neutral" action="button" dataAttributes={{ ...dataAttributes, ...createPurposeSemanticAttributes("sort"), "data-sort": "true" }} />
