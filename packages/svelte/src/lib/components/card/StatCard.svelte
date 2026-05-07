<script lang="ts">
  import Card from "./Card.svelte";
  import type { CardProps } from "./types.js";
  let { dataAttributes, ...props }: CardProps = $props();
</script>
<Card {...props} dataAttributes={{ ...dataAttributes, "data-purpose": "stat-card" }} />
