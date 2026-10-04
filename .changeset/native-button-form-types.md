---
"@marwes-ui/core": patch
"@marwes-ui/react": patch
"@marwes-ui/vue": patch
"@marwes-ui/svelte": patch
---

Support native `type="submit"` and `type="reset"` on Button and visual button wrappers. Buttons still default to `type="button"`; existing submit/reset actions retain precedence. Clarify form behavior in Storybook and forward `ariaLabelledBy` through Vue button wrappers.
