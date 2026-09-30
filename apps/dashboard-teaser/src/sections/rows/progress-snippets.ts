import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/progress.svelte?raw"
import react from "../../fixtures/snippets/progress.tsx?raw"
import vue from "../../fixtures/snippets/progress.vue?raw"

const progressSnippets: Record<Framework, string> = { react, vue, svelte }

export { progressSnippets }
