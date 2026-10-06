/**
 * Builds a pure mapper from a family's resolved a11y object to HTML attribute names.
 *
 * The names table must cover every key of `A11y`, so adding an a11y field fails to compile until
 * it is mapped; no adapter can then silently drop it. A field mapped to `false` is deliberately
 * not an attribute (e.g. ids the adapter assigns to specific elements). Undefined fields are
 * omitted; falsy values such as `false` and `0` are kept. Adapters that need other casing
 * (React) rename on spread.
 */
export type HtmlAttributesOf<
  A11y extends object,
  Names extends Record<keyof A11y, string | false>,
> = {
  -readonly [Field in keyof A11y as Names[Field] extends string
    ? Names[Field]
    : never]?: A11y[Field]
}

export function defineHtmlAttributeMapper<A11y extends object>() {
  return <const Names extends Record<keyof A11y, string | false>>(names: Names) => {
    const fields = Object.keys(names) as Array<keyof A11y & string>

    return (a11y: A11y): HtmlAttributesOf<A11y, Names> => {
      const attributes: Record<string, unknown> = {}

      for (const field of fields) {
        const attributeName: string | false = names[field]
        const value = a11y[field]
        if (attributeName !== false && value !== undefined) attributes[attributeName] = value
      }

      return attributes as HtmlAttributesOf<A11y, Names>
    }
  }
}
