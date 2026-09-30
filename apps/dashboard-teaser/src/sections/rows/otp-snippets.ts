import type { Framework } from "../installation-recipes"

import svelte from "../../fixtures/snippets/otp.svelte?raw"
import react from "../../fixtures/snippets/otp.tsx?raw"
import vue from "../../fixtures/snippets/otp.vue?raw"

const otpSnippets: Record<Framework, string> = { react, vue, svelte }

export { otpSnippets }
