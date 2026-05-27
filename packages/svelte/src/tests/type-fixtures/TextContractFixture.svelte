<script lang="ts">
  import type { TextAs, TextVariant } from "@marwes-ui/core"
  import Text from "../../lib/components/text/Text.svelte"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  interface Props {
    text: string
    variant?: TextVariant
    as?: TextAs
    id?: string
  }

  let { text, variant, as, id }: Props = $props()
</script>

<MarwesProvider>
  <Text {...(variant ? { variant } : {})} {...(as ? { as } : {})} {...(id ? { id } : {})}>{text}</Text>
</MarwesProvider>
