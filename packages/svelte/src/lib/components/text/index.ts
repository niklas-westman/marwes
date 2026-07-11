export { default as Text } from "./Text.svelte"
export { default as TypographyText } from "./Text.svelte"
export type TextComponent = typeof import("./Text.svelte").default
export type { TextProps } from "./types.js"
