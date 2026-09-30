import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/typography.svelte?raw"
import react from "../../fixtures/snippets/typography.tsx?raw"
import vue from "../../fixtures/snippets/typography.vue?raw"

const typographySnippets: Record<Framework, string> = { react, vue, svelte }

export { typographySnippets }
