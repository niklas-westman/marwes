<script lang="ts">
import { MarwesProvider, ToastProvider, createMarwesThemeScript, createMarwesThemeStyle } from "@marwes-ui/svelte"
import "@marwes-ui/presets/firstEdition/styles.css"
import Controls from "../../../lib/Controls.svelte"
let { data } = $props()
</script>
<svelte:head>{@html `<style nonce="ssr-fixture">${createMarwesThemeStyle({ target: "html" })}</style><script nonce="ssr-fixture">${createMarwesThemeScript({ target: "html", storageKey: "marwes-ssr-theme", defaultPreference: data.preference })}<\/script>`}</svelte:head>
<MarwesProvider defaultPreference={data.preference} storageKey="marwes-ssr-theme" variableStrategy={data.strategy}><ToastProvider><h1>{data.secondPage ? "Second page" : "SSR fixture"}</h1><div data-testid="theme-sample" style="background-color:var(--mw-color-background);color:var(--mw-color-text);padding:1rem">Theme sample</div><Controls initialOpen={data.initialOpen} /><a href={`/${data.preference}/${data.strategy}?view=next`}>Next page</a></ToastProvider></MarwesProvider>
