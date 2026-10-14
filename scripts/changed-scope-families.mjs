export function normalizeFamilyName(family) {
  const aliases = {
    "currency-field": "input",
    "date-of-birth-field": "input",
    "dropdown-field": "input",
    "input-field": "input",
    "input-otp": "input",
    "rich-text": "input",
    select: "input",
    "select-field": "input",
    textarea: "input",
    "textarea-field": "input",
    "text-value-updates": "input",
    "zip-code-field": "input",
  }

  return aliases[family] ?? family
}
