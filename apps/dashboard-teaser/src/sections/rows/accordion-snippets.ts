import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/accordion.svelte?raw"
import react from "../../fixtures/snippets/accordion.tsx?raw"
import vue from "../../fixtures/snippets/accordion.vue?raw"

const accordionSnippets: Record<Framework, string> = { react, vue, svelte }

export { accordionSnippets }
