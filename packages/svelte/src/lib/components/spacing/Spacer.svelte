<script lang="ts">
  import Spacing from "./Spacing.svelte";
  import type { SpacerProps } from "./types.js";

  let props: SpacerProps = $props();
</script>

<Spacing {...props} />
