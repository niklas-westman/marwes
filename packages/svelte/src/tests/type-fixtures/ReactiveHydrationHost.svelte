<script lang="ts">
  import type { Component } from "svelte"
  let { component, componentProps }: { component: Component<Record<string, unknown>>, componentProps: Record<string, unknown> } = $props()
  export function updateProps(nextProps: Record<string, unknown>): void { componentProps = nextProps }
  const SelectedComponent = $derived(component)
</script>
<SelectedComponent {...componentProps} />
