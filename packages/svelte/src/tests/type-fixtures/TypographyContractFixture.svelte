<script lang="ts">
  import H1 from "../../lib/components/heading/H1.svelte"
  import H2 from "../../lib/components/heading/H2.svelte"
  import H3 from "../../lib/components/heading/H3.svelte"
  import Paragraph from "../../lib/components/paragraph/Paragraph.svelte"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  interface Props {
    component: "h1" | "h2" | "h3" | "p"
    text: string
    size?: "h1" | "h2" | "h3" | "sm" | "md" | "lg"
    id?: string
    ariaLabel?: string
  }

  let { component, text, size, id, ariaLabel }: Props = $props()
</script>

<MarwesProvider>
  {#if component === "h1"}
    <H1 {...(size ? { size } : {})} {id} ariaLabel={ariaLabel}>{text}</H1>
  {:else if component === "h2"}
    <H2 {...(size ? { size } : {})} {id} ariaLabel={ariaLabel}>{text}</H2>
  {:else if component === "h3"}
    <H3 {...(size ? { size } : {})} {id} ariaLabel={ariaLabel}>{text}</H3>
  {:else}
    <Paragraph {...(size ? { size } : {})} {id}>{text}</Paragraph>
  {/if}
</MarwesProvider>
