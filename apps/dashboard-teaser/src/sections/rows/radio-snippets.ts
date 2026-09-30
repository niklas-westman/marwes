import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/radio.svelte?raw"
import react from "../../fixtures/snippets/radio.tsx?raw"
import vue from "../../fixtures/snippets/radio.vue?raw"

const radioSnippets: Record<Framework, string> = { react, vue, svelte }

export { radioSnippets }
