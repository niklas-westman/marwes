import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/badge.svelte?raw"
import react from "../../fixtures/snippets/badge.tsx?raw"
import vue from "../../fixtures/snippets/badge.vue?raw"

const badgeSnippets: Record<Framework, string> = { react, vue, svelte }

export { badgeSnippets }
