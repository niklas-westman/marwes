import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/banner.svelte?raw"
import react from "../../fixtures/snippets/banner.tsx?raw"
import vue from "../../fixtures/snippets/banner.vue?raw"

const bannerSnippets: Record<Framework, string> = { react, vue, svelte }

export { bannerSnippets }
