<script lang="ts">
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"
  import H1 from "../../lib/components/heading/H1.svelte"
  import H2 from "../../lib/components/heading/H2.svelte"
  import H3 from "../../lib/components/heading/H3.svelte"
  import Paragraph from "../../lib/components/paragraph/Paragraph.svelte"
  import Text from "../../lib/components/text/Text.svelte"

  interface Props {
    component: "h1" | "h2" | "h3" | "p" | "text"
    size?: string
  }

  let { component = "p", size }: Props = $props()
</script>

<MarwesProvider>
  {#if component === "h1"}
    <H1>Test heading</H1>
  {:else if component === "h2"}
    <H2>Test heading</H2>
  {:else if component === "h3"}
    <H3>Test heading</H3>
  {:else if component === "text"}
    <Text variant="overline">Test text</Text>
  {:else}
    <Paragraph {...(size ? { size } : {})}>Test paragraph</Paragraph>
  {/if}
</MarwesProvider>
