/**
 * Lists every key of an options type. The argument is typed `Record<keyof Options, true>`, so a
 * missing or unknown key fails to compile, keeping runtime key lists in sync with the type.
 */
export function defineOptionKeys<Options>(
  keySet: Record<keyof Options, true>,
): ReadonlyArray<keyof Options> {
  return Object.keys(keySet) as unknown as ReadonlyArray<keyof Options>
}
