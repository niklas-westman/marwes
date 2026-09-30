import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/avatar.svelte?raw"
import react from "../../fixtures/snippets/avatar.tsx?raw"
import vue from "../../fixtures/snippets/avatar.vue?raw"

const avatarSnippets: Record<Framework, string> = { react, vue, svelte }

export { avatarSnippets }
