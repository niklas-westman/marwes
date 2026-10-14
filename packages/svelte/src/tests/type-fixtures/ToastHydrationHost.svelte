<script lang="ts">
 import { MarwesProvider, ToastProvider } from "../../lib/index.js"
 import ShowToast from "./ShowToastHydrationFixture.svelte"
 let props: { duration: number | null, onDismiss?: () => void } = $props()
</script>
<MarwesProvider><ToastProvider><ShowToast {...props} /></ToastProvider></MarwesProvider>
