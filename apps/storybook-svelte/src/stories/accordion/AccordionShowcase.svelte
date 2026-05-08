<script lang="ts">
  import { Accordion } from "@marwes-ui/svelte"

  interface Props {
    showcase: "interactive" | "list"
  }

  const { showcase }: Props = $props()

  let singleOpen = $state(false)

  const items = [
    { title: "Getting started", body: "Install via pnpm add @marwes-ui/svelte and wrap your app with MarwesProvider." },
    { title: "Theming", body: "Pass a ThemeInput to MarwesProvider to customise colours, radius, and density." },
    { title: "Components", body: "Import individual components from @marwes-ui/svelte — Button, Input, Checkbox, and more." },
  ]
  let openIndex = $state<number | null>(0)
</script>

{#if showcase === "interactive"}
  <Accordion
    id="interactive-1"
    open={singleOpen}
    onToggle={() => (singleOpen = !singleOpen)}
    title="Click to expand"
  >
    This panel appears when you click the trigger above.
  </Accordion>
{:else if showcase === "list"}
  <div style="display: flex; flex-direction: column; gap: 8px;">
    {#each items as item, i}
      <Accordion
        id="faq-{i}"
        open={openIndex === i}
        onToggle={() => (openIndex = openIndex === i ? null : i)}
        title={item.title}
      >
        {item.body}
      </Accordion>
    {/each}
  </div>
{/if}
