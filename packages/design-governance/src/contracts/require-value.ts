/** Fail closed when a value required by the current proof is absent. */
export function requireValue<T>(
  value: T,
  message = "Required proof value is missing",
): NonNullable<T> {
  if (value === undefined || value === null) throw new Error(message)
  return value
}
