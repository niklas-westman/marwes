import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/switch.svelte?raw"
import react from "../../fixtures/snippets/switch.tsx?raw"
import vue from "../../fixtures/snippets/switch.vue?raw"

const switchSnippets: Record<Framework, string> = { react, vue, svelte }

export { switchSnippets }
