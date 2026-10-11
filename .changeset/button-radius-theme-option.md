---
"@marwes-ui/core": minor
"@marwes-ui/react": minor
"@marwes-ui/presets": minor
"@marwes-ui/vue": minor
"@marwes-ui/svelte": minor
---

Add the `ui.radiusButton` theme option. It sets the corner radius of buttons in px and falls back to `ui.radius`, so an application can have pill-shaped buttons (for example `radiusButton: 90`) while inputs and other components keep `ui.radius`. The resolved value is emitted as `--mw-ui-radius-button` and exposed as `mwThemeVars.ui.radiusButton`; the firstEdition button stylesheet uses it with `--mw-ui-radius` as fallback. Without the option, rendering is unchanged.
