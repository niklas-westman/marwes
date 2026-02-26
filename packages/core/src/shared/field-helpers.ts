export function mergeIdRefs(...refs: Array<string | undefined | null | false>): string | undefined {
  const filtered = refs.filter(Boolean) as string[]
  return filtered.length > 0 ? filtered.join(" ") : undefined
}

export type InputFieldA11yIds = {
  helperTextId?: string
  errorId?: string
  describedBy?: string
}

export function buildInputFieldA11yIds(args: {
  id: string
  hasHelperText: boolean
  hasError: boolean
  externalDescribedBy?: string | undefined
}): InputFieldA11yIds {
  const helperTextId = args.hasHelperText ? `${args.id}-helper` : undefined
  const errorId = args.hasError ? `${args.id}-error` : undefined
  const describedBy = mergeIdRefs(args.externalDescribedBy, helperTextId, errorId)
  const result: InputFieldA11yIds = {}
  if (helperTextId) result.helperTextId = helperTextId
  if (errorId) result.errorId = errorId
  if (describedBy) result.describedBy = describedBy
  return result
}

export type CheckboxFieldA11yIds = {
  descriptionId?: string
  errorId?: string
  describedBy?: string
}

export function buildCheckboxFieldA11yIds(args: {
  id: string
  hasDescription: boolean
  hasError: boolean
  externalDescribedBy?: string | undefined
}): CheckboxFieldA11yIds {
  const descriptionId = args.hasDescription ? `${args.id}-desc` : undefined
  const errorId = args.hasError ? `${args.id}-error` : undefined
  const describedBy = mergeIdRefs(args.externalDescribedBy, descriptionId, errorId)
  const result: CheckboxFieldA11yIds = {}
  if (descriptionId) result.descriptionId = descriptionId
  if (errorId) result.errorId = errorId
  if (describedBy) result.describedBy = describedBy
  return result
}

export function buildCurrencyHelperText(
  helperText: string | undefined,
  currency: string | undefined,
): string | undefined {
  if (!currency) {
    return helperText
  }

  return helperText ? `${helperText} (${currency})` : `Amount in ${currency}`
}
