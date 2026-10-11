---
"@marwes-ui/core": minor
"@marwes-ui/react": minor
"@marwes-ui/presets": minor
"@marwes-ui/vue": minor
"@marwes-ui/svelte": minor
---

Add the `Stack` layout family: `Stack` and `StackItem` in React, Vue and Svelte. `Stack` is a flex container with `direction` (`row` | `column`), `gap` / `rowGap` / `columnGap`, `padding` / `paddingX` / `paddingY` / per-side padding, `alignItems` (`start` | `center` | `end`; cross-axis stretch is declared as child `fill`), `justifyContent`, `wrap` and `as`. `StackItem` is a declared child with `horizontalSizing` / `verticalSizing` (`fix` | `hug` | `fill`). Gap and padding accept only `Spacings` tokens and resolve to `var(--mw-spacing-<token>)`; values outside the allowed sets throw a `TypeError`. Every resolved value is emitted as a `data-*` attribute so layout can be verified against design auto layout. The firstEdition preset gains `stack.css`. No existing component changes.
