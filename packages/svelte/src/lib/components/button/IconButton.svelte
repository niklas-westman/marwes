<script lang="ts">
  import { ButtonVariant as ButtonVariants } from "@marwes-ui/core";
  import Button from "./Button.svelte";
  import type { IconButtonProps } from "./types.js";

  let { icon, ariaLabel, variant = ButtonVariants.neutral, ...props }: IconButtonProps = $props();
</script>

<Button {...props} {variant} ariaLabel={ariaLabel} iconLeft={icon} iconOnly={true} hasVisibleText={false} />
