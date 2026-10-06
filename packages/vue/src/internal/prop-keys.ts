type MissingKeys<Props, Listed extends readonly PropertyKey[]> = Exclude<
  keyof Props,
  Listed[number]
>

/**
 * Declares a Vue runtime `props` list that must name every key of `Props`.
 * Vue only receives props listed at runtime, so an unlisted option would silently fall through
 * to attrs; this turns that omission into a compile error naming the missing keys.
 */
export function definePropKeys<Props>() {
  return <const Listed extends readonly (keyof Props & string)[]>(
    keys: [MissingKeys<Props, Listed>] extends [never]
      ? Listed
      : Listed & { readonly missingPropKeys: MissingKeys<Props, Listed> },
  ): Listed => keys
}
