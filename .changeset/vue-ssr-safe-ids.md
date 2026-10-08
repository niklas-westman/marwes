---
"@marwes-ui/core": minor
"@marwes-ui/react": minor
"@marwes-ui/presets": minor
"@marwes-ui/vue": minor
"@marwes-ui/svelte": minor
---

Vue: generate component ids with `useId()` so server-rendered markup hydrates without id mismatches, and keep the server-rendered selection of `Select` through hydration. The Vue peer dependency minimum is now 3.5 (was 3.4). Adds shared update and hydration contracts for Input, Select and TabGroup across React, Vue and Svelte.
