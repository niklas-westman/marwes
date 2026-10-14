<script setup lang="ts">
import { MarwesProvider, ToastProvider, createMarwesThemeScript, createMarwesThemeStyle } from "@marwes-ui/vue"
import Controls from "../../components/Controls.vue"
const route = useRoute()
const preference = computed(() => route.params.preference === "dark" ? "dark" : route.params.preference === "system" ? "system" : "light")
const strategy = computed(() => route.params.strategy === "inline" ? "inline" : "style-tag")
useHead(() => ({ htmlAttrs: { lang: "en", "data-allow-mismatch": "class" }, style: [{ key: "marwes-theme", innerHTML: createMarwesThemeStyle({ target: "html" }), nonce: "ssr-fixture" }, { key: "marwes-portal", innerHTML: createMarwesThemeStyle({ target: "html", selector: "#teleports" }), nonce: "ssr-fixture" }], script: [{ key: "marwes-theme", innerHTML: createMarwesThemeScript({ target: "html", storageKey: "marwes-ssr-theme", defaultPreference: preference.value }), nonce: "ssr-fixture" }] }))
</script>
<template><MarwesProvider :default-preference="preference" storage-key="marwes-ssr-theme" :variable-strategy="strategy"><ToastProvider><h1>{{ route.query.view === 'next' ? 'Second page' : 'SSR fixture' }}</h1><div data-testid="theme-sample" style="background-color:var(--mw-color-background);color:var(--mw-color-text);padding:1rem">Theme sample</div><Controls :initial-open="route.query.initialOpen === '1'" /><NuxtLink :to="`/${preference}/${strategy}?view=next`">Next page</NuxtLink></ToastProvider></MarwesProvider></template>
