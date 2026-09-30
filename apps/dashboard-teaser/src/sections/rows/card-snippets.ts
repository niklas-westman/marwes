import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/card.svelte?raw"
import react from "../../fixtures/snippets/card.tsx?raw"
import vue from "../../fixtures/snippets/card.vue?raw"

const cardSnippets: Record<Framework, string> = { react, vue, svelte }

export { cardSnippets }
