import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/spinner.svelte?raw"
import react from "../../fixtures/snippets/spinner.tsx?raw"
import vue from "../../fixtures/snippets/spinner.vue?raw"

const spinnerSnippets: Record<Framework, string> = { react, vue, svelte }

export { spinnerSnippets }
