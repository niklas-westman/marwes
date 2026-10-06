// React names these DOM attributes in camelCase; core emits HTML (lowercase) names.
const REACT_ATTRIBUTE_NAMES = {
  tabindex: "tabIndex",
  readonly: "readOnly",
  autocomplete: "autoComplete",
  inputmode: "inputMode",
} as const

type ReactAttributeNames = typeof REACT_ATTRIBUTE_NAMES

export type ReactAttributesOf<Attributes extends object> = {
  [Name in keyof Attributes as Name extends keyof ReactAttributeNames
    ? ReactAttributeNames[Name]
    : Name]: Attributes[Name]
}

export function toReactAttributes<Attributes extends object>(
  htmlAttributes: Attributes,
): ReactAttributesOf<Attributes> {
  const reactAttributes: Record<string, unknown> = {}

  for (const [name, value] of Object.entries(htmlAttributes)) {
    const reactName =
      name in REACT_ATTRIBUTE_NAMES
        ? REACT_ATTRIBUTE_NAMES[name as keyof ReactAttributeNames]
        : name
    reactAttributes[reactName] = value
  }

  return reactAttributes as ReactAttributesOf<Attributes>
}
