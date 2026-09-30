import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/breadcrumb.svelte?raw"
import react from "../../fixtures/snippets/breadcrumb.tsx?raw"
import vue from "../../fixtures/snippets/breadcrumb.vue?raw"

const breadcrumbSnippets: Record<Framework, string> = { react, vue, svelte }

export { breadcrumbSnippets }
