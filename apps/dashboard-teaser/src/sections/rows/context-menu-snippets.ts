import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/context-menu.svelte?raw"
import react from "../../fixtures/snippets/context-menu.tsx?raw"
import vue from "../../fixtures/snippets/context-menu.vue?raw"

const contextMenuSnippets: Record<Framework, string> = { react, vue, svelte }

export { contextMenuSnippets }
