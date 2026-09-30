import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/pagination.svelte?raw"
import react from "../../fixtures/snippets/pagination.tsx?raw"
import vue from "../../fixtures/snippets/pagination.vue?raw"

const paginationSnippets: Record<Framework, string> = { react, vue, svelte }

export { paginationSnippets }
