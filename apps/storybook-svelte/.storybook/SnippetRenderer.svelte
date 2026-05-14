<script>
  let { component: Component, children: childrenText, ...props } = $props();
</script>

{#if childrenText != null}
  <Component {...props}>{childrenText}</Component>
{:else}
  <Component {...props} />
{/if}
