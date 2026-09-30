import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/button.svelte?raw"
import react from "../../fixtures/snippets/button.tsx?raw"
import vue from "../../fixtures/snippets/button.vue?raw"

const buttonSnippets: Record<Framework, string> = { react, vue, svelte }

export { buttonSnippets }
