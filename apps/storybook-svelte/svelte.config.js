import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** Known-benign warning codes that are intentional in the Marwes component library. */
const SUPPRESSED_WARNINGS = new Set([
  "state_referenced_locally",
  "a11y_no_noninteractive_tabindex",
  "a11y_role_supports_aria_props",
  "a11y_role_supports_aria_props_implicit",
  "a11y_interactive_supports_focus",
  "a11y_no_static_element_interactions",
  "css_unused_selector",
])

const config = {
  preprocess: vitePreprocess(),
  onwarn(warning, handler) {
    if (SUPPRESSED_WARNINGS.has(warning.code)) return
    handler(warning)
  },
}

export default config
