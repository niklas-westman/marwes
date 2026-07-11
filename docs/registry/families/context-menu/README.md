# ContextMenu Registry

> Family: `context-menu`
>
> Local design refs only — this page uses the synced files under `.figma/` and makes no Figma API calls.

## Registry files

- [`registry.meta.json`](./registry.meta.json)
- [`registry.generated.json`](./registry.generated.json)
- [`../../../../artifacts/component-registry.json`](../../../../artifacts/component-registry.json)

## Registry snapshot

| Field | Value |
| --- | --- |
| Family status | Shipped |
| Audit status | Initial implementation |
| Semantic coverage | Canonical `data-component="context-menu"` plus destructive item metadata |
| Generated structural truth | `registry.generated.json` + `artifacts/component-registry.json` |
| Primary Figma nodes | context menu component `1574:23952`, menu item part `1574:23946`, light frame `1574:24029`, dark frame `1574:24160` |
| Main AXE watch item | managed trigger/open-state/focus-return behavior belongs in product code or a future molecule |

## Summary

The ContextMenu family is Marwes' compact command-list surface. It consists of:

- one raw `ContextMenu` atom
- action items rendered as buttons with `role="menuitem"`
- visual dividers rendered as separators
- icon, disabled, and destructive item states
- React, Vue, and Svelte adapter coverage

## Figma references

Primary synced refs:

- `.figma/INDEX.md`
- `.figma/marwes/components/context-menu.json`
- `.figma/marwes/components/partscontext-menucontext-menu-item.json`
- `.figma/marwes/pages/-context-menu/-context-menu_1574-24029.json`
- `.figma/marwes/pages/-context-menu/-context-menu-dark_1574-24160.json`

## Ownership boundary

`ContextMenu` owns the rendered menu surface and item semantics. It does not own trigger state, portal rendering, collision-aware placement, or focus return after dismissal.
