import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/segmented.svelte?raw"
import react from "../../fixtures/snippets/segmented.tsx?raw"
import vue from "../../fixtures/snippets/segmented.vue?raw"

const segmentedSnippets: Record<Framework, string> = { react, vue, svelte }

export { segmentedSnippets }
