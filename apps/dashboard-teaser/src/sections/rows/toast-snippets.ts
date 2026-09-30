import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/toast.svelte?raw"
import react from "../../fixtures/snippets/toast.tsx?raw"
import vue from "../../fixtures/snippets/toast.vue?raw"

const toastSnippets: Record<Framework, string> = { react, vue, svelte }

export { toastSnippets }
