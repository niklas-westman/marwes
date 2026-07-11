<script lang="ts">
  import { createSkipLinkRecipe } from "@marwes-ui/core";
  import type { SkipLinkProps } from "./types.js";

  let { href, children, class: className }: SkipLinkProps = $props();

  const kit = $derived(createSkipLinkRecipe({ href, className }));
</script>

<a {href} class={kit.className}>
  {@render children?.()}
</a>
