import type { FamilySemanticDefinition } from "./semantic-types"

export const familySemanticsRegistry = {
  button: {
    family: "button",
    defaultLayer: "atom",
    baseAttributes: {
      "data-component": "button",
    },
    canonicalAttributes: ["data-component", "data-action", "data-variant", "data-size"],
    allowedPurposes: [
      "destructive",
      "create",
      "submit",
      "cancel",
      "navigation",
      "save",
      "confirm",
      "verify",
      "edit",
      "close",
      "refresh",
      "upload",
      "download",
      "copy",
      "search",
      "filter",
      "sort",
      "dropdown",
      "success",
    ],
    notes: "Button already has the strongest base semantic surface in core.",
  },
  badge: {
    family: "badge",
    defaultLayer: "atom",
    baseAttributes: {
      "data-component": "badge",
    },
    canonicalAttributes: ["data-component", "data-variant"],
    allowedPurposes: ["status", "priority", "notification"],
    notes: "Badge needs base family identity normalized before full parity governance.",
  },
  banner: {
    family: "banner",
    defaultLayer: "atom",
    baseAttributes: {
      "data-component": "banner",
    },
    canonicalAttributes: ["data-component", "data-variant"],
    allowedPurposes: ["info-banner", "success-banner", "warning-banner", "error-banner"],
    notes:
      "Banner is a single-atom family with thin purpose variants that preset the variant prop and emit canonical data-purpose metadata.",
  },
  avatar: {
    family: "avatar",
    defaultLayer: "atom",
    baseAttributes: {
      "data-component": "avatar",
    },
    canonicalAttributes: ["data-component", "data-size"],
    allowedPurposes: ["profile", "presence", "team"],
    notes: "Avatar has simple purpose semantics but multiple rendered identities across molecules.",
  },
  toast: {
    family: "toast",
    defaultLayer: "atom",
    baseAttributes: {
      "data-component": "toast",
    },
    canonicalAttributes: ["data-component", "data-variant", "data-intent"],
    allowedPurposes: ["success-toast", "error-toast", "warning-toast", "info-toast"],
    notes:
      "Toast keeps canonical family identity in core while delivery timing and queue orchestration stay adapter-owned.",
  },
  dialog: {
    family: "dialog",
    defaultLayer: "atom",
    baseAttributes: {
      "data-component": "dialog",
    },
    canonicalAttributes: ["data-component", "data-size", "data-intent"],
    allowedPurposes: ["confirm-dialog", "destructive-dialog", "info-dialog"],
    notes: "Dialog already has a strong purpose mapping and workflow semantics in adapters.",
  },
  drawer: {
    family: "drawer",
    defaultLayer: "atom",
    baseAttributes: {
      "data-component": "drawer",
    },
    canonicalAttributes: ["data-component", "data-size"],
    allowedPurposes: [],
    notes:
      "Drawer shares dialog semantics while adding panel placement and scrim composition at the family level.",
  },
  "context-menu": {
    family: "context-menu",
    defaultLayer: "atom",
    baseAttributes: {
      "data-component": "context-menu",
    },
    canonicalAttributes: ["data-component", "data-destructive"],
    allowedPurposes: [],
    notes:
      "ContextMenu exposes a menu surface and button-backed menu items while popover/open-state orchestration stays adapter-owned.",
  },
  breadcrumb: {
    family: "breadcrumb",
    defaultLayer: "atom",
    baseAttributes: {
      "data-component": "breadcrumb",
    },
    canonicalAttributes: ["data-component"],
    allowedPurposes: [],
    notes:
      "Breadcrumb exposes navigation hierarchy while routing, link resolution, and page ownership stay consumer-owned.",
  },
} satisfies Record<string, FamilySemanticDefinition>
