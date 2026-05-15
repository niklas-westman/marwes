# Tab

Svelte tab components are aligned with the React and Vue tab family.

## Public Components

- `Tab` — atom for custom tablist layouts.
- `TabPanel` — atom-level panel primitive.
- `TabGroup` — coordinated tablist and panel molecule.
- `NavigationTabs` — purpose wrapper for navigation-style tab groups.
- `ContentTabs` — purpose wrapper for content-section tab groups.
- `SettingsTabs` — purpose wrapper for settings/admin tab groups.

## Shared Contract

- Uses `createTabRecipe`, `buildTabGroupA11yIds`, `moveTabSelection`, and `resolveTabValue` from `@marwes-ui/core`.
- Supports controlled and uncontrolled active tab state.
- Supports disabled tabs.
- Supports ArrowLeft, ArrowRight, Home, and End keyboard navigation.
- Wires `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, and `aria-labelledby`.
- Renders string panel content or Svelte snippets.
- Applies purpose metadata to the `.mw-tab-group` root through `dataAttributes`, matching React and Vue.

## Svelte Notes

Svelte keeps the same declarative `tabs` array API as React and Vue. Event naming follows Svelte conventions with `onactivetabchange`.
