import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/dialog-drawer.svelte?raw"
import react from "../../fixtures/snippets/dialog-drawer.tsx?raw"
import vue from "../../fixtures/snippets/dialog-drawer.vue?raw"

const dialogDrawerSnippets: Record<Framework, string> = { react, vue, svelte }

export { dialogDrawerSnippets }
