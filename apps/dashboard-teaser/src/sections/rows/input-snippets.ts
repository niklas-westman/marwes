import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/input.svelte?raw"
import react from "../../fixtures/snippets/input.tsx?raw"
import vue from "../../fixtures/snippets/input.vue?raw"

const inputSnippets: Record<Framework, string> = { react, vue, svelte }

export { inputSnippets }
