<script lang="ts">
 import InputField from "../../lib/components/input/InputField.svelte"
 import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"
 let { label, value, error }: { label: string, value: string, error?: string } = $props()
</script>
<MarwesProvider><InputField {label} {value} {error} /><MarwesProvider><InputField label="Alternate" {value} /></MarwesProvider></MarwesProvider>
