import type { PurposeSemanticDefinition } from "./semantic-types"

const frameworks = ["react", "vue"] as const

export const buttonPurposeSemantics = {
  destructive: {
    purpose: "destructive",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "destructive",
      "data-action": "delete",
      "data-destructive": "true",
      "data-confirmation-required": "true",
    },
    supportedFrameworks: frameworks,
  },
  create: {
    purpose: "create",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "create",
      "data-action": "create",
    },
    supportedFrameworks: frameworks,
  },
  submit: {
    purpose: "submit",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "submit",
      "data-action": "submit",
      "data-context": "form-submit",
    },
    supportedFrameworks: frameworks,
  },
  cancel: {
    purpose: "cancel",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "cancel",
      "data-action": "cancel",
    },
    supportedFrameworks: frameworks,
  },
  navigation: {
    purpose: "navigation",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "navigation",
      "data-action": "navigate",
    },
    supportedFrameworks: frameworks,
  },
  save: {
    purpose: "save",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "save",
      "data-action": "submit",
    },
    supportedFrameworks: frameworks,
  },
  confirm: {
    purpose: "confirm",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "confirm",
      "data-action": "button",
      "data-outcome": "positive",
    },
    supportedFrameworks: frameworks,
  },
  verify: {
    purpose: "verify",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "verify",
      "data-action": "button",
      "data-outcome": "positive",
    },
    supportedFrameworks: frameworks,
  },
  edit: {
    purpose: "edit",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "edit",
      "data-action": "edit",
    },
    supportedFrameworks: frameworks,
  },
  close: {
    purpose: "close",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "close",
      "data-action": "cancel",
    },
    supportedFrameworks: frameworks,
  },
  refresh: {
    purpose: "refresh",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "refresh",
      "data-action": "button",
    },
    supportedFrameworks: frameworks,
  },
  upload: {
    purpose: "upload",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "upload",
      "data-action": "button",
    },
    supportedFrameworks: frameworks,
  },
  download: {
    purpose: "download",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "download",
      "data-action": "button",
    },
    supportedFrameworks: frameworks,
  },
  copy: {
    purpose: "copy",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "copy",
      "data-action": "button",
    },
    supportedFrameworks: frameworks,
  },
  search: {
    purpose: "search",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "search",
      "data-action": "button",
    },
    supportedFrameworks: frameworks,
  },
  filter: {
    purpose: "filter",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "filter",
      "data-action": "button",
    },
    supportedFrameworks: frameworks,
  },
  sort: {
    purpose: "sort",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "sort",
      "data-action": "button",
    },
    supportedFrameworks: frameworks,
  },
  dropdown: {
    purpose: "dropdown",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "dropdown",
      "data-action": "button",
    },
    supportedFrameworks: frameworks,
  },
  success: {
    purpose: "success",
    family: "button",
    layer: "purpose",
    attributes: {
      "data-purpose": "success",
      "data-action": "button",
      "data-outcome": "positive",
    },
    supportedFrameworks: frameworks,
  },
} satisfies Record<string, PurposeSemanticDefinition>

export const badgePurposeSemantics = {
  status: {
    purpose: "status",
    family: "badge",
    layer: "purpose",
    attributes: {
      "data-purpose": "status",
    },
    supportedFrameworks: frameworks,
  },
  priority: {
    purpose: "priority",
    family: "badge",
    layer: "purpose",
    attributes: {
      "data-purpose": "priority",
    },
    supportedFrameworks: frameworks,
  },
  notification: {
    purpose: "notification",
    family: "badge",
    layer: "purpose",
    attributes: {
      "data-purpose": "notification",
    },
    supportedFrameworks: frameworks,
  },
} satisfies Record<string, PurposeSemanticDefinition>

export const avatarPurposeSemantics = {
  profile: {
    purpose: "profile",
    family: "avatar",
    layer: "purpose",
    attributes: {
      "data-purpose": "profile",
    },
    supportedFrameworks: frameworks,
  },
  presence: {
    purpose: "presence",
    family: "avatar",
    layer: "purpose",
    attributes: {
      "data-purpose": "presence",
    },
    supportedFrameworks: frameworks,
  },
  team: {
    purpose: "team",
    family: "avatar",
    layer: "purpose",
    attributes: {
      "data-purpose": "team",
    },
    supportedFrameworks: frameworks,
  },
} satisfies Record<string, PurposeSemanticDefinition>

export const toastPurposeSemantics = {
  successToast: {
    purpose: "success-toast",
    family: "toast",
    layer: "purpose",
    attributes: {
      "data-purpose": "success-toast",
      "data-intent": "success",
    },
    supportedFrameworks: frameworks,
  },
  errorToast: {
    purpose: "error-toast",
    family: "toast",
    layer: "purpose",
    attributes: {
      "data-purpose": "error-toast",
      "data-intent": "error",
    },
    supportedFrameworks: frameworks,
  },
  warningToast: {
    purpose: "warning-toast",
    family: "toast",
    layer: "purpose",
    attributes: {
      "data-purpose": "warning-toast",
      "data-intent": "warning",
    },
    supportedFrameworks: frameworks,
  },
  infoToast: {
    purpose: "info-toast",
    family: "toast",
    layer: "purpose",
    attributes: {
      "data-purpose": "info-toast",
      "data-intent": "info",
    },
    supportedFrameworks: frameworks,
  },
} satisfies Record<string, PurposeSemanticDefinition>

export const dialogPurposeSemantics = {
  confirmDialog: {
    purpose: "confirm-dialog",
    family: "dialog",
    layer: "purpose",
    attributes: {
      "data-purpose": "confirm-dialog",
      "data-intent": "confirm",
    },
    supportedFrameworks: frameworks,
  },
  destructiveDialog: {
    purpose: "destructive-dialog",
    family: "dialog",
    layer: "purpose",
    attributes: {
      "data-purpose": "destructive-dialog",
      "data-intent": "destructive",
      "data-destructive": "true",
      "data-confirmation-required": "true",
    },
    supportedFrameworks: frameworks,
  },
  infoDialog: {
    purpose: "info-dialog",
    family: "dialog",
    layer: "purpose",
    attributes: {
      "data-purpose": "info-dialog",
      "data-intent": "info",
    },
    supportedFrameworks: frameworks,
  },
} satisfies Record<string, PurposeSemanticDefinition>

export const purposeSemanticsRegistry = {
  ...buttonPurposeSemantics,
  ...badgePurposeSemantics,
  ...avatarPurposeSemantics,
  ...toastPurposeSemantics,
  ...dialogPurposeSemantics,
} satisfies Record<string, PurposeSemanticDefinition>
