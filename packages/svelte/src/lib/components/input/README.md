# Input — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `Input` atom with `createInputRecipe` and `bind:value`
- `InputField` molecule with label, helperText, error, leadingSymbol, ariaDescribedBy
- Stable generated IDs via `$props.id()`
- Full a11y: aria-invalid, aria-describedby, aria-live="polite" on error
- `buildInputFieldA11yIds` integration from core

### Missing ❌
- **`Select`** — implemented as separate component (not under input folder like React/Vue)
- **`Textarea`** — implemented as separate component
- **`SelectField`** molecule
- **`TextareaField`** molecule
- **`RichText`** atom + `RichTextField` molecule
- **`InputOtp`** atom
- **Field variant wrappers** (9): `DropdownField`, `SearchField`, `PasswordField`, `EmailField`, `DateOfBirthField`, `ZipCodeField`, `PhoneField`, `URLField`, `CurrencyField`

### Notes
- React/Vue group Select, Textarea, RichText under `components/input/`. Svelte separates them into their own folders for clarity.
- The missing field variants are thin wrappers that pre-configure InputField with specific type/inputMode/leadingSymbol. Can be added as a batch.
- `RichText` and `InputOtp` are high-complexity components flagged for later implementation.
