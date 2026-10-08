<script lang="ts">
  import type { Snippet } from "svelte"

  let { children }: { children?: Snippet } = $props()
</script>

<div class="snippet-children">{@render children?.()}</div>
