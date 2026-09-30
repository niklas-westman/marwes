import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/checkbox.svelte?raw"
import react from "../../fixtures/snippets/checkbox.tsx?raw"
import vue from "../../fixtures/snippets/checkbox.vue?raw"

const checkboxSnippets: Record<Framework, string> = { react, vue, svelte }

export { checkboxSnippets }
