# Button — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- Base `Button` component with full `createButtonRecipe` integration
- All props: variant, size, action, disabled, loading, iconLeft, iconRight, href, as
- Anchor path (as="a") with href
- Loading state with `ButtonSpinner`
- Icon rendering via `Icon` component
- Class/style merging with core output
- All a11y attributes from core recipe
- Data attributes spreading

### Missing ❌
- **Purpose variant wrappers** (22 components): `PrimaryButton`, `SecondaryButton`, `TextButton`, `SuccessButton`, `DestructiveButton`, `CreateButton`, `SubmitButton`, `CancelButton`, `LinkButton`, `SaveButton`, `ConfirmButton`, `VerifyButton`, `EditButton`, `CloseButton`, `RefreshButton`, `UploadButton`, `DownloadButton`, `CopyButton`, `SearchButton`, `FilterButton`, `SortButton`, `DropdownButton`
- Dev-mode warnings for forbidden props on purpose variants

### Notes
- Purpose wrappers are thin — each just pre-sets `variant`, `action`, and optionally `iconLeft`/`iconRight` via the core `createPurposeSemanticAttributes`. Can be added as a follow-up batch.
- The base `Button` atom is fully functional and covers all use cases the purpose wrappers serve.
