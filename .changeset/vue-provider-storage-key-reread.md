---
"@marwes-ui/core": patch
"@marwes-ui/react": patch
"@marwes-ui/presets": patch
"@marwes-ui/vue": patch
"@marwes-ui/svelte": patch
---

Vue `MarwesProvider` now re-reads the stored theme preference when `storageKey` changes after mount, matching the React and Svelte providers. Adds a shared provider behavior contract that all three adapters run.
