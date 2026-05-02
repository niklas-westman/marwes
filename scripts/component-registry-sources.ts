export interface RegistryFamilySemanticsSource {
  coverageLevel: "canonical" | "family-local" | "none"
  dataComponent: string | null
  canonicalAttributes: string[]
  allowedPurposes: string[]
  purposeAttributes: Record<string, Record<string, string>>
  sourceOfTruthPaths: string[]
  notes?: string[]
}

export interface RegistryFamilyFigmaSource {
  componentJsons: string[]
  curatedReferences: string[]
  pageReferences: string[]
  nodeReferences: Record<string, string>
  figmaTokens: string[]
  figmaStates: {
    baseVariants: string[]
    interactionStates: string[]
  }
}

export interface RegistryFamilySource {
  coreDir: string
  presetPaths: string[]
  reactDir: string
  vueDir: string
  storybookReactDir: string
  storybookVueDir: string
  contractPaths: string[]
  auditIndexPath: string
  familyAuditDocPath: string | null
  referenceDocs: string[]
  guides: string[]
  figma: RegistryFamilyFigmaSource
  semantics?: RegistryFamilySemanticsSource
}

interface RegistryFamilyPathOverrides {
  coreDir?: string
  presetPaths?: string[]
  reactDir?: string
  vueDir?: string
  storybookReactDir?: string
  storybookVueDir?: string
}

interface CreateRegistryFamilySourceOptions {
  family: string
  contractPaths: string[]
  figma: RegistryFamilyFigmaSource
  semantics?: RegistryFamilySemanticsSource
  familyAuditDocPath?: string | null
  referenceDocs?: string[]
  guides?: string[]
  pathOverrides?: RegistryFamilyPathOverrides
}

export const defaultRegistryReferenceDocs = [
  "docs/reference/architecture.md",
  "docs/reference/spec.md",
  "docs/reference/ai-metadata.md",
  "docs/reference/testing.md",
  "docs/reference/governance.md",
]

export const defaultRegistryGuides = [
  "docs/guides/adding-components.md",
  "docs/guides/figma-to-marwes.md",
]

function buildDefaultFamilyPaths(
  family: string,
): Omit<
  RegistryFamilySource,
  | "contractPaths"
  | "auditIndexPath"
  | "familyAuditDocPath"
  | "referenceDocs"
  | "guides"
  | "figma"
  | "semantics"
> {
  return {
    coreDir: `packages/core/src/components/atoms/${family}`,
    presetPaths: [`packages/presets/src/firstEdition/${family}.css`],
    reactDir: `packages/react/src/components/${family}`,
    vueDir: `packages/vue/src/components/${family}`,
    storybookReactDir: `apps/storybook-react/src/stories/${family}`,
    storybookVueDir: `apps/storybook-vue/src/stories/${family}`,
  }
}

function createRegistryFamilySource({
  family,
  contractPaths,
  figma,
  semantics,
  familyAuditDocPath,
  referenceDocs,
  guides,
  pathOverrides,
}: CreateRegistryFamilySourceOptions): RegistryFamilySource {
  return {
    ...buildDefaultFamilyPaths(family),
    ...pathOverrides,
    contractPaths,
    auditIndexPath: "docs/audits/README.md",
    familyAuditDocPath: familyAuditDocPath ?? `docs/audits/${family}-family-accessibility.md`,
    referenceDocs: referenceDocs ?? defaultRegistryReferenceDocs,
    guides: guides ?? defaultRegistryGuides,
    figma,
    semantics,
  }
}

export const registryFamilySources: Record<string, RegistryFamilySource> = {
  avatar: createRegistryFamilySource({
    family: "avatar",
    contractPaths: [
      "tests/contracts/avatar.contract.ts",
      "tests/contracts/avatar-badge.contract.ts",
      "tests/contracts/avatar-group.contract.ts",
    ],
    figma: {
      componentJsons: [
        ".figma/marwes/components/avatar.json",
        ".figma/marwes/components/avatar-badge.json",
        ".figma/marwes/components/avatar-group.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-avatar/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-avatar/component-container_1574-27051.json",
        ".figma/marwes/pages/-avatar/component-container_1574-27408.json",
        ".figma/marwes/pages/-avatar/-avatar_1574-27460.json",
        ".figma/marwes/pages/-avatar/-avatar-dark_1574-27570.json",
        ".figma/marwes/pages/cover/avatar-group_1825-30447.json",
      ],
      nodeReferences: {
        avatarComponentSet: "1574:27371",
        avatarBadgeComponentSet: "1574:27394",
        avatarGroupComponent: "1574:27395",
        avatarLightFrame: "1574:27460",
        avatarDarkFrame: "1574:27570",
        avatarComponentContainer: "1574:27408",
        avatarCoverGroupFrame: "1825:30447",
      },
      figmaTokens: [],
      figmaStates: {
        baseVariants: ["avatar", "avatar-badge", "avatar-group", "profile", "presence", "team"],
        interactionStates: [
          "small",
          "medium",
          "large",
          "initials",
          "icon",
          "image",
          "online",
          "stacked",
          "overflow",
          "light",
          "dark",
        ],
      },
    },
  }),
  badge: createRegistryFamilySource({
    family: "badge",
    contractPaths: ["tests/contracts/badge.contract.ts"],
    figma: {
      componentJsons: [".figma/marwes/components/checkboxbadge.json"],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-badge/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-badge/-badge_1364-11603.json",
        ".figma/marwes/pages/-badge/-badge-dark_2276-56582.json",
        ".figma/marwes/pages/-badge/component-container_1369-6125.json",
        ".figma/marwes/pages/cover/badges_1825-30440.json",
      ],
      nodeReferences: {
        badgeLightFrame: "1364:11603",
        badgeDarkFrame: "2276:56582",
        badgeComponentContainer: "1369:6125",
        checkboxBadgeComponent: "1364:7721",
        badgeCoverFrame: "1825:30440",
      },
      figmaTokens: ["badge/surface", "badge/border", "badge/label"],
      figmaStates: {
        baseVariants: [
          "neutral",
          "brand",
          "info",
          "success",
          "warning",
          "error",
          "status",
          "priority",
          "notification",
        ],
        interactionStates: ["light", "dark", "standalone", "grouped", "numeric", "labeled"],
      },
    },
  }),
  button: createRegistryFamilySource({
    family: "button",
    contractPaths: ["tests/contracts/button.contract.ts"],
    familyAuditDocPath: "docs/audits/button-family-accessibility.md",
    figma: {
      componentJsons: [".figma/marwes/components/button.json"],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/cover/buttons_1825-30427.json",
        ".figma/marwes/pages/cover/buttons_1825-30431.json",
        ".figma/marwes/pages/cover/buttons_1825-30435.json",
        ".figma/marwes/pages/-button/component-container_1364-11870.json",
        ".figma/marwes/pages/-button/-purpose-buttons_1371-8933.json",
      ],
      nodeReferences: {
        baseLightFrame: "1371:11172",
        baseDarkFrame: "1371:11537",
        purposeLightFrame: "1371:8933",
        purposeDarkFrame: "1371:9188",
      },
      figmaTokens: [
        "Primary/Surface",
        "Primary/Label",
        "Secondary/Label",
        "Secondary/Outline",
        "Text/Label",
        "action/primary/default",
        "action/primary/label",
        "action/secondary/default",
        "action/secondary/label",
        "action/destructive/default",
        "action/destructive/label",
        "action/success/default",
        "action/success/label",
      ],
      figmaStates: {
        baseVariants: ["primary", "secondary", "neutral", "text"],
        interactionStates: ["default", "hover", "pressed", "disabled", "focus", "loading"],
      },
    },
  }),
  card: createRegistryFamilySource({
    family: "card",
    contractPaths: [],
    semantics: {
      coverageLevel: "family-local",
      dataComponent: "card",
      canonicalAttributes: [],
      allowedPurposes: ["product-card", "profile-card", "stat-card"],
      purposeAttributes: {
        "product-card": {
          "data-purpose": "product-card",
        },
        "profile-card": {
          "data-purpose": "profile-card",
        },
        "stat-card": {
          "data-purpose": "stat-card",
        },
      },
      sourceOfTruthPaths: [
        "packages/core/src/components/atoms/card/card-recipe.ts",
        "packages/react/src/components/card/variants.tsx",
        "packages/vue/src/components/card/variants.ts",
      ],
      notes: [
        "Card is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "The atom emits data-component=card from core, while purpose-card metadata currently lives in the React and Vue wrappers.",
      ],
    },
    figma: {
      componentJsons: [".figma/marwes/components/card.json"],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-card/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-card/-card_1364-11556.json",
        ".figma/marwes/pages/-card/component-container_1371-13326.json",
        ".figma/marwes/pages/-card/-card-dark_1368-5891.json",
        ".figma/marwes/pages/cover/card_1825-30426.json",
      ],
      nodeReferences: {
        cardComponent: "1364:7718",
        cardLightFrame: "1364:11556",
        cardDarkFrame: "1368:5891",
        cardComponentContainer: "1371:13326",
        cardCoverFrame: "1825:30426",
      },
      figmaTokens: ["card/surface", "card/border", "card/title", "card/body"],
      figmaStates: {
        baseVariants: ["card", "product-card", "profile-card", "stat-card"],
        interactionStates: [
          "default",
          "hover",
          "pressed",
          "disabled",
          "focus",
          "light",
          "dark",
          "body-only",
        ],
      },
    },
  }),
  checkbox: createRegistryFamilySource({
    family: "checkbox",
    contractPaths: [
      "tests/contracts/checkbox.contract.ts",
      "tests/contracts/checkbox-group-field.contract.ts",
    ],
    pathOverrides: {
      presetPaths: [
        "packages/presets/src/firstEdition/checkbox.css",
        "packages/presets/src/firstEdition/molecules/checkbox-field.css",
        "packages/presets/src/firstEdition/molecules/checkbox-group-field.css",
      ],
    },
    semantics: {
      coverageLevel: "none",
      dataComponent: null,
      canonicalAttributes: [],
      allowedPurposes: [],
      purposeAttributes: {},
      sourceOfTruthPaths: [
        "packages/core/src/components/atoms/checkbox/checkbox-a11y.ts",
        "packages/core/src/components/atoms/checkbox/checkbox-recipe.ts",
        "packages/core/src/shared/field-helpers.ts",
        "packages/react/src/components/checkbox/checkbox-field.tsx",
        "packages/react/src/components/checkbox/checkbox-group-field.tsx",
        "packages/vue/src/components/checkbox/checkbox-field.ts",
        "packages/vue/src/components/checkbox/checkbox-group-field.ts",
        "tests/contracts/checkbox.contract.ts",
        "tests/contracts/checkbox-group-field.contract.ts",
      ],
      notes: [
        "Checkbox relies on native input[type=checkbox] and fieldset semantics rather than the wave-1 central semantic registry.",
        "The family does not emit data-component or purpose metadata today; semantic meaning comes from the native checkbox control plus field-helper wiring in CheckboxField and CheckboxGroupField.",
      ],
    },
    figma: {
      componentJsons: [
        ".figma/marwes/components/checkbox.json",
        ".figma/marwes/components/checkbox-field.json",
        ".figma/marwes/components/checkbox-group.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-checkbox/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-checkbox/component-container_1369-4657.json",
        ".figma/marwes/pages/-checkbox/component-container_1369-6165.json",
        ".figma/marwes/pages/-checkbox/-checkbox_1369-4700.json",
        ".figma/marwes/pages/-checkbox/-checkbox-dark_1369-4905.json",
        ".figma/marwes/pages/-checkbox/checkbox_1893-32830.json",
        ".figma/marwes/pages/-checkbox/checkbox_1893-32839.json",
        ".figma/marwes/pages/cover/checkbox-group_1825-30425.json",
      ],
      nodeReferences: {
        checkboxComponentSet: "1369:4628",
        checkboxFieldComponentSet: "1364:5566",
        checkboxGroupComponent: "1369:4673",
        checkboxLightFrame: "1369:4700",
        checkboxDarkFrame: "1369:4905",
        checkboxComponentContainer: "1369:4657",
        checkboxGroupComponentContainer: "1369:6165",
        checkboxGroupCoverFrame: "1825:30425",
      },
      figmaTokens: [
        "Checkbox/Surface",
        "Checkbox/Border",
        "Checkbox/Surface-checked",
        "Checkbox/Icon",
        "Checkbox/Text",
      ],
      figmaStates: {
        baseVariants: ["checkbox", "checkbox-field", "checkbox-group"],
        interactionStates: [
          "unchecked",
          "checked",
          "indeterminate",
          "default",
          "hover",
          "pressed",
          "disabled",
          "focus",
          "error",
          "light",
          "dark",
        ],
      },
    },
  }),
  radio: createRegistryFamilySource({
    family: "radio",
    contractPaths: ["tests/contracts/radio.contract.ts"],
    pathOverrides: {
      presetPaths: [
        "packages/presets/src/firstEdition/radio.css",
        "packages/presets/src/firstEdition/molecules/radio-group-field.css",
      ],
    },
    semantics: {
      coverageLevel: "family-local",
      dataComponent: null,
      canonicalAttributes: [],
      allowedPurposes: ["binary-choice", "rating", "selection"],
      purposeAttributes: {
        "binary-choice": {
          "data-purpose": "binary-choice",
        },
        rating: {
          "data-purpose": "rating",
        },
        selection: {
          "data-purpose": "selection",
        },
      },
      sourceOfTruthPaths: [
        "packages/core/src/shared/field-helpers.ts",
        "packages/react/src/components/radio/radio-group-field.tsx",
        "packages/react/src/components/radio/variants.tsx",
        "packages/vue/src/components/radio/radio-group-field.ts",
        "packages/vue/src/components/radio/variants.ts",
      ],
      notes: [
        "Radio is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "Family-local purpose metadata currently lives in the React and Vue purpose-radio wrappers, while the raw atom and group field rely on native input[type=radio], role=radiogroup, and shared field-helper wiring.",
      ],
    },
    figma: {
      componentJsons: [
        ".figma/marwes/components/radio-button.json",
        ".figma/marwes/components/radio-group.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-radio-button/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-radio-button/radio-button_1368-6733.json",
        ".figma/marwes/pages/-radio-button/-radio-button_1368-6734.json",
        ".figma/marwes/pages/-radio-button/-radio-button-dark_2276-51787.json",
        ".figma/marwes/pages/-radio-button/component-container_1371-13445.json",
        ".figma/marwes/pages/-radio-button/component-container_1571-19716.json",
        ".figma/marwes/pages/-radio-button/component-container_1571-19757.json",
        ".figma/marwes/pages/cover/radio-group-example_1825-30421.json",
      ],
      nodeReferences: {
        radioButtonComponentSet: "1368:6733",
        radioGroupComponent: "1368:6450",
        radioLightFrame: "1368:6734",
        radioDarkFrame: "2276:51787",
        radioCombinedComponentContainer: "1371:13445",
        radioStateComponentContainer: "1571:19716",
        radioGroupComponentContainer: "1571:19757",
        radioGroupCoverFrame: "1825:30421",
      },
      figmaTokens: ["radio/surface", "radio/border", "radio/dot", "radio/label"],
      figmaStates: {
        baseVariants: ["radio-button", "radio-group"],
        interactionStates: [
          "selected",
          "unselected",
          "default",
          "hover",
          "pressed",
          "disabled",
          "focus",
          "error",
          "label-right",
          "label-left",
          "light",
          "dark",
        ],
      },
    },
  }),
  input: createRegistryFamilySource({
    family: "input",
    contractPaths: [
      "tests/contracts/input.contract.ts",
      "tests/contracts/input-field.contract.ts",
      "tests/contracts/select.contract.ts",
      "tests/contracts/select-field.contract.ts",
      "tests/contracts/select-combobox.contract.ts",
      "tests/contracts/dropdown-field.contract.ts",
      "tests/contracts/textarea.contract.ts",
      "tests/contracts/textarea-field.contract.ts",
      "tests/contracts/input-otp.contract.ts",
      "tests/contracts/rich-text.contract.ts",
      "tests/contracts/rich-text-field.contract.ts",
      "tests/contracts/date-of-birth-field.contract.ts",
      "tests/contracts/zip-code-field.contract.ts",
    ],
    familyAuditDocPath: "docs/audits/input-family-accessibility.md",
    pathOverrides: {
      presetPaths: [
        "packages/presets/src/firstEdition/input.css",
        "packages/presets/src/firstEdition/textarea.css",
        "packages/presets/src/firstEdition/select.css",
        "packages/presets/src/firstEdition/rich-text.css",
        "packages/presets/src/firstEdition/input-otp.css",
        "packages/presets/src/firstEdition/molecules/input-field.css",
      ],
    },
    semantics: {
      coverageLevel: "family-local",
      dataComponent: null,
      canonicalAttributes: [],
      allowedPurposes: [
        "dropdown",
        "search",
        "password",
        "email",
        "date-of-birth",
        "zip-code",
        "phone",
        "url",
        "currency",
      ],
      purposeAttributes: {
        dropdown: {
          "data-purpose": "dropdown",
        },
        search: {
          "data-purpose": "search",
        },
        password: {
          "data-purpose": "password",
        },
        email: {
          "data-purpose": "email",
        },
        "date-of-birth": {
          "data-purpose": "date-of-birth",
        },
        "zip-code": {
          "data-purpose": "zip-code",
        },
        phone: {
          "data-purpose": "phone",
        },
        url: {
          "data-purpose": "url",
        },
        currency: {
          "data-purpose": "currency",
          "data-currency": "<runtime>",
        },
      },
      sourceOfTruthPaths: [
        "packages/react/src/components/input/field-variants.tsx",
        "packages/vue/src/components/input/field-variants.ts",
        "packages/react/src/components/input/input-otp.tsx",
        "packages/vue/src/components/input/input-otp.ts",
        "packages/core/src/components/atoms/input/rich-text-styles.ts",
      ],
      notes: [
        "Input is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "Family-level purpose metadata currently lives in adapter field-variant wrappers rather than the central semantic registry.",
      ],
    },
    figma: {
      componentJsons: [
        ".figma/marwes/components/text-field.json",
        ".figma/marwes/components/text-area.json",
        ".figma/marwes/components/select.json",
        ".figma/marwes/components/dropdown.json",
        ".figma/marwes/components/input-otp.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-input-fields/README.md",
        ".figma/marwes/pages/-input-otp/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-input-fields/-input-fields_1364-11372.json",
        ".figma/marwes/pages/-input-fields/-input-fields-dark_1368-5944.json",
        ".figma/marwes/pages/-input-fields/-input-types-overview_1364-11817.json",
        ".figma/marwes/pages/-input-fields/-input-types-overview-dark_1368-6014.json",
        ".figma/marwes/pages/-input-fields/dropdown_1384-13225.json",
        ".figma/marwes/pages/-input-otp/-input-otp_1803-15024.json",
        ".figma/marwes/pages/-input-otp/-input-otp-dark_1803-15155.json",
      ],
      nodeReferences: {
        inputFieldsLightFrame: "1364:11372",
        inputFieldsDarkFrame: "1368:5944",
        inputTypesLightFrame: "1364:11817",
        inputTypesDarkFrame: "1368:6014",
        textField: "1364:7662",
        textarea: "1364:7696",
        searchField: "1364:7667",
        passwordField: "1364:7673",
        dateOfBirthField: "1364:7679",
        phoneField: "1364:7685",
        zipCodeField: "1364:7691",
        dropdownField: "1364:7701",
        selectAtom: "1364:7707",
        inputOtpLightFrame: "1803:15024",
        inputOtpDarkFrame: "1803:15155",
      },
      figmaTokens: [
        "input/surface",
        "input/border",
        "input/label",
        "input/value",
        "input/placeholder",
        "input/hint",
        "dropdown/item-surface",
        "dropdown/list-surface",
        "dropdown/list-border",
        "dropdown/item-label",
        "dropdown/item-check",
      ],
      figmaStates: {
        baseVariants: [
          "input",
          "textarea",
          "search",
          "password",
          "date-of-birth",
          "phone",
          "zip-code",
          "dropdown",
          "select",
          "input-otp",
          "rich-text-baseline",
        ],
        interactionStates: ["default", "hover", "active", "disabled", "focus", "error"],
      },
    },
  }),
  dialog: createRegistryFamilySource({
    family: "dialog",
    contractPaths: [
      "tests/contracts/dialog.contract.ts",
      "tests/contracts/dialog-modal.contract.ts",
    ],
    familyAuditDocPath: "docs/audits/dialog-family-accessibility.md",
    pathOverrides: {
      presetPaths: [
        "packages/presets/src/firstEdition/dialog.css",
        "packages/presets/src/firstEdition/molecules/dialog-modal.css",
      ],
    },
    figma: {
      componentJsons: [
        ".figma/marwes/components/dialog.json",
        ".figma/marwes/components/scrim.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-dialog/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-dialog/dialog_1609-15459.json",
        ".figma/marwes/pages/-dialog/-dialog_1609-15527.json",
        ".figma/marwes/pages/-dialog/-dialog-dark_1615-17130.json",
        ".figma/marwes/pages/-dialog/dialog_1935-14085.json",
        ".figma/marwes/pages/-dialog/frame-1_1935-14109.json",
        ".figma/marwes/pages/-dialog/icons-interface-x_1595-13879.json",
      ],
      nodeReferences: {
        dialogComponent: "1609:15459",
        dialogLightFrame: "1609:15527",
        dialogDarkFrame: "1615:17130",
        closeIcon: "1595:13879",
      },
      figmaTokens: [
        "card/surface",
        "card/border",
        "card/title",
        "card/body",
        "text/primary",
        "text/secondary",
        "border/default",
        "surface/secondary",
        "focus/ring",
      ],
      figmaStates: {
        baseVariants: [
          "dialog-shell",
          "dialog-modal",
          "confirm-dialog",
          "destructive-dialog",
          "info-dialog",
        ],
        interactionStates: [
          "open",
          "dismissible",
          "locked-dismissal",
          "focus-trap",
          "no-focusable-fallback",
        ],
      },
    },
  }),
  divider: createRegistryFamilySource({
    family: "divider",
    contractPaths: ["tests/contracts/divider.contract.ts"],
    semantics: {
      coverageLevel: "family-local",
      dataComponent: "divider",
      canonicalAttributes: [],
      allowedPurposes: [],
      purposeAttributes: {},
      sourceOfTruthPaths: ["packages/core/src/components/atoms/divider/divider-recipe.ts"],
      notes: [
        "Divider is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "The atom emits data-component=divider plus local size and orientation metadata directly from core.",
      ],
    },
    figma: {
      componentJsons: [".figma/marwes/components/divider.json"],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-divider/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-divider/component-container_1574-24629.json",
        ".figma/marwes/pages/-divider/-divider_1574-24658.json",
        ".figma/marwes/pages/-divider/-divider-dark_1574-24738.json",
      ],
      nodeReferences: {
        dividerComponent: "1574:21053",
        dividerComponentContainer: "1574:24629",
        dividerLightFrame: "1574:24658",
        dividerDarkFrame: "1574:24738",
      },
      figmaTokens: ["divider/default"],
      figmaStates: {
        baseVariants: ["horizontal-divider"],
        interactionStates: [
          "sp-80",
          "sp-64",
          "sp-48",
          "sp-32",
          "sp-16",
          "sp-8",
          "sp-1",
          "light",
          "dark",
          "vertical",
        ],
      },
    },
  }),
  heading: createRegistryFamilySource({
    family: "heading",
    contractPaths: ["tests/contracts/heading.contract.ts"],
    pathOverrides: {
      presetPaths: ["packages/presets/src/firstEdition/typography.css"],
    },
    semantics: {
      coverageLevel: "none",
      dataComponent: null,
      canonicalAttributes: [],
      allowedPurposes: [],
      purposeAttributes: {},
      sourceOfTruthPaths: [
        "packages/core/src/components/atoms/heading/heading-recipe.ts",
        "packages/react/src/components/heading/h1.tsx",
        "packages/react/src/components/heading/h2.tsx",
        "packages/react/src/components/heading/h3.tsx",
        "packages/vue/src/components/heading/create-heading.ts",
        "tests/contracts/heading.contract.ts",
      ],
      notes: [
        "Heading relies on native h1/h2/h3 semantics rather than the wave-1 central semantic registry.",
        "The family does not emit data-component or purpose metadata today; semantic meaning comes from the rendered heading tag and the surrounding document outline.",
      ],
    },
    figma: {
      componentJsons: [],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/README.md",
        ".figma/marwes/tokens/typography.json",
        ".figma/marwes/pages/-typography/README.md",
        ".figma/marwes/components/component-heading.json",
        ".figma/marwes/pages/-banner/component-heading_1932-7061.json",
        ".figma/marwes/pages/-banner/component-heading_1935-7184.json",
        ".figma/marwes/pages/additional-to-this-file/component-heading_1918-15754.json",
        ".figma/marwes/pages/additional-to-this-file/component-heading_1918-15800.json",
        ".figma/marwes/pages/additional-to-this-file/component-heading_1918-15833.json",
      ],
      pageReferences: [
        ".figma/marwes/pages/-typography/typography_1368-5656.json",
        ".figma/marwes/pages/-typography/typography_1368-5677.json",
        ".figma/marwes/pages/-typography/typography_1368-5698.json",
        ".figma/marwes/pages/-typography/typography_1368-5717.json",
      ],
      nodeReferences: {
        typographyLightSection: "1368:5656",
        typographyDarkSection: "1368:5677",
        headingH1LightRow: "1368:5665",
        headingH2LightRow: "1368:5666",
        headingH3LightRow: "1368:5667",
        headingH1DarkRow: "1368:5686",
        headingH2DarkRow: "1368:5687",
        headingH3DarkRow: "1368:5688",
        instrumentSansLightSection: "1368:5698",
        instrumentSansDarkSection: "1368:5717",
        componentHeadingComponent: "1918:15754",
      },
      figmaTokens: ["Heading/H1", "Heading/H2", "Heading/H3"],
      figmaStates: {
        baseVariants: ["h1", "h2", "h3"],
        interactionStates: ["light", "dark", "typography-scale", "documentation-scaffold"],
      },
    },
  }),
  icon: createRegistryFamilySource({
    family: "icon",
    contractPaths: ["tests/contracts/icon.contract.ts"],
    pathOverrides: {
      presetPaths: ["packages/presets/src/firstEdition/icon.css"],
    },
    semantics: {
      coverageLevel: "none",
      dataComponent: null,
      canonicalAttributes: [],
      allowedPurposes: [],
      purposeAttributes: {},
      sourceOfTruthPaths: [
        "packages/core/src/components/atoms/icon/icon-registry.ts",
        "packages/core/src/components/atoms/icon/icon-scales.ts",
        "packages/core/src/components/atoms/icon/icon-recipe.ts",
        "packages/react/src/components/icon/icon.tsx",
        "packages/vue/src/components/icon/icon.ts",
        "tests/contracts/icon.contract.ts",
      ],
      notes: [
        "Icon relies on native SVG semantics and surrounding control context rather than the wave-1 central semantic registry.",
        "The family does not emit data-component or purpose metadata today; the shipped adapters render SVGs directly from iconRegistry and shared size helpers, while createIconRecipe and icon.css remain adjacent but are not the current adapter path.",
      ],
    },
    figma: {
      componentJsons: [
        ".figma/marwes/components/icons-interface-search.json",
        ".figma/marwes/components/icons-interface-help-circle.json",
        ".figma/marwes/components/icons-interface-x.json",
        ".figma/marwes/components/icons-arrows-arrow-right.json",
        ".figma/marwes/components/icons-arrows-chevron-down.json",
        ".figma/marwes/components/icons-users-user.json",
        ".figma/marwes/components/bold-1.json",
        ".figma/marwes/components/play-1.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-icons/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-icons/-icons_1384-10135.json",
        ".figma/marwes/pages/-icons/-icons-dark_1384-10579.json",
        ".figma/marwes/pages/-icons/component-container_1384-11023.json",
        ".figma/marwes/pages/-icons/component-container_1384-11076.json",
        ".figma/marwes/pages/-icons/component-container_1384-11137.json",
        ".figma/marwes/pages/-icons/component-container_2015-6777.json",
        ".figma/marwes/pages/-icons/component-container_2015-7449.json",
        ".figma/marwes/pages/-icons/default-24px-xs-sm-md-lg_1455-8865.json",
      ],
      nodeReferences: {
        iconLightFrame: "1384:10135",
        iconDarkFrame: "1384:10579",
        interfaceComponentContainer: "1384:11023",
        arrowsComponentContainer: "1384:11076",
        usersComponentContainer: "1384:11137",
        editorComponentContainer: "2015:6777",
        mediasComponentContainer: "2015:7449",
        sizeLegendText: "1455:8865",
        searchIconComponent: "1382:9204",
        chevronDownIconComponent: "1382:9262",
        userIconComponent: "1382:9330",
        boldIconComponent: "2015:7037",
        playIconComponent: "2015:7436",
      },
      figmaTokens: ["icon/default"],
      figmaStates: {
        baseVariants: [
          "interface-icons",
          "arrows-icons",
          "users-icons",
          "editor-icons",
          "medias-icons",
        ],
        interactionStates: ["xs", "sm", "md", "lg", "light", "dark", "gallery"],
      },
    },
  }),
  paragraph: createRegistryFamilySource({
    family: "paragraph",
    contractPaths: ["tests/contracts/paragraph.contract.ts"],
    pathOverrides: {
      presetPaths: ["packages/presets/src/firstEdition/typography.css"],
    },
    semantics: {
      coverageLevel: "none",
      dataComponent: null,
      canonicalAttributes: [],
      allowedPurposes: [],
      purposeAttributes: {},
      sourceOfTruthPaths: [
        "packages/core/src/components/atoms/paragraph/paragraph-recipe.ts",
        "packages/core/src/theme/theme-defaults.ts",
        "packages/react/src/components/paragraph/paragraph.tsx",
        "packages/vue/src/components/paragraph/paragraph.ts",
        "tests/contracts/paragraph.contract.ts",
      ],
      notes: [
        "Paragraph relies on native p semantics rather than the wave-1 central semantic registry.",
        "The family does not emit data-component or purpose metadata today; semantic meaning comes from the rendered paragraph element, while sizing comes from theme typography and the shared typography preset.",
      ],
    },
    figma: {
      componentJsons: [],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/tokens/typography.json",
        ".figma/marwes/pages/-typography/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-typography/typography_1368-5656.json",
        ".figma/marwes/pages/-typography/typography_1368-5677.json",
        ".figma/marwes/pages/-typography/typography_1368-5698.json",
        ".figma/marwes/pages/-typography/typography_1368-5717.json",
      ],
      nodeReferences: {
        typographyLightSection: "1368:5656",
        typographyDarkSection: "1368:5677",
        bodyLightSection: "1368:5669",
        bodyMediumLightRow: "1368:5671",
        bodyDefaultLightRow: "1368:5742",
        bodyDarkSection: "1368:5690",
        bodyMediumDarkRow: "1368:5692",
        bodyDefaultDarkRow: "1368:5746",
        instrumentSansLightSection: "1368:5698",
        instrumentSansDarkSection: "1368:5717",
      },
      figmaTokens: ["Body/Medium", "Body/Default", "Body/16 Paragraph", "P - Paragraph"],
      figmaStates: {
        baseVariants: ["paragraph", "body-default", "body-medium"],
        interactionStates: ["sm", "md", "lg", "light", "dark", "typography-scale", "long-form"],
      },
    },
  }),
  spacing: createRegistryFamilySource({
    family: "spacing",
    contractPaths: ["tests/contracts/spacing.contract.ts"],
    pathOverrides: {
      presetPaths: [
        "packages/presets/src/firstEdition/spacing.css",
        "packages/presets/src/firstEdition/tokens.css",
      ],
    },
    semantics: {
      coverageLevel: "family-local",
      dataComponent: "spacing",
      canonicalAttributes: [],
      allowedPurposes: [],
      purposeAttributes: {},
      sourceOfTruthPaths: [
        "packages/core/src/components/atoms/spacing/spacing.recipe.ts",
        "packages/core/src/components/atoms/spacing/spacing.types.ts",
        "packages/presets/src/firstEdition/tokens.css",
      ],
      notes: [
        "Spacing is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "The atom emits data-component=spacing and data-size directly from core, while its token scale currently comes from the shared firstEdition tokens.css file rather than a dedicated synced Figma family.",
      ],
    },
    figma: {
      componentJsons: [],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
      ],
      pageReferences: [],
      nodeReferences: {},
      figmaTokens: [],
      figmaStates: {
        baseVariants: [],
        interactionStates: [],
      },
    },
  }),
  tab: createRegistryFamilySource({
    family: "tab",
    contractPaths: ["tests/contracts/tab.contract.ts"],
    familyAuditDocPath: "docs/audits/tab-family-accessibility.md",
    pathOverrides: {
      presetPaths: [
        "packages/presets/src/firstEdition/tab.css",
        "packages/presets/src/firstEdition/molecules/tab-group.css",
      ],
    },
    semantics: {
      coverageLevel: "family-local",
      dataComponent: null,
      canonicalAttributes: [],
      allowedPurposes: ["navigation-tabs", "content-tabs", "settings-tabs"],
      purposeAttributes: {
        "navigation-tabs": {
          "data-purpose": "navigation-tabs",
        },
        "content-tabs": {
          "data-purpose": "content-tabs",
        },
        "settings-tabs": {
          "data-purpose": "settings-tabs",
        },
      },
      sourceOfTruthPaths: [
        "packages/react/src/components/tab/variants.tsx",
        "packages/vue/src/components/tab/variants.ts",
      ],
      notes: [
        "Tabs are not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "Purpose metadata currently lives in the React and Vue purpose-tab wrappers rather than the central semantic registry.",
      ],
    },
    figma: {
      componentJsons: [
        ".figma/marwes/components/tab.json",
        ".figma/marwes/components/tab-group.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-tab/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-tab/tab_1364-7729.json",
        ".figma/marwes/pages/-tab/tab-group_1737-9904.json",
        ".figma/marwes/pages/-tab/-tab_1364-11703.json",
        ".figma/marwes/pages/-tab/-tab-dark_1368-6067.json",
        ".figma/marwes/pages/-tab/component-container_1574-21105.json",
        ".figma/marwes/pages/-tab/tab-bar_1896-33125.json",
      ],
      nodeReferences: {
        tabComponent: "1364:7729",
        tabGroupComponent: "1737:9904",
        tabLightFrame: "1364:11703",
        tabDarkFrame: "1368:6067",
        tabBarFrame: "1896:33125",
      },
      figmaTokens: ["tab/surface", "tab/label", "tab/indicator"],
      figmaStates: {
        baseVariants: ["tab", "tab-group", "navigation-tabs", "content-tabs", "settings-tabs"],
        interactionStates: ["default", "selected", "hover", "pressed", "disabled", "focus"],
      },
    },
  }),
  switch: createRegistryFamilySource({
    family: "switch",
    contractPaths: ["tests/contracts/switch.contract.ts"],
    familyAuditDocPath: "docs/audits/switch-family-accessibility.md",
    pathOverrides: {
      presetPaths: [
        "packages/presets/src/firstEdition/switch.css",
        "packages/presets/src/firstEdition/molecules/switch-field.css",
      ],
    },
    semantics: {
      coverageLevel: "family-local",
      dataComponent: null,
      canonicalAttributes: [],
      allowedPurposes: ["feature-toggle", "preference", "permission"],
      purposeAttributes: {
        "feature-toggle": {
          "data-purpose": "feature-toggle",
        },
        preference: {
          "data-purpose": "preference",
        },
        permission: {
          "data-purpose": "permission",
        },
      },
      sourceOfTruthPaths: [
        "packages/react/src/components/switch/variants.tsx",
        "packages/vue/src/components/switch/variants.ts",
      ],
      notes: [
        "Switch is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "Purpose metadata currently lives in the React and Vue purpose-switch wrappers rather than the central semantic registry.",
      ],
    },
    figma: {
      componentJsons: [".figma/marwes/components/switch.json"],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-switch/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-switch/-switch_1364-11442.json",
        ".figma/marwes/pages/-switch/-switch-dark_1369-4001.json",
        ".figma/marwes/pages/-switch/component-container_1371-12852.json",
      ],
      nodeReferences: {
        switchComponentSet: "1371:12723",
        switchLightFrame: "1364:11442",
        switchDarkFrame: "1369:4001",
        switchComponentContainer: "1371:12852",
      },
      figmaTokens: [
        "switch/track-on",
        "switch/thumb-on",
        "switch/track-off",
        "switch/thumb-off",
        "switch/label",
      ],
      figmaStates: {
        baseVariants: ["switch", "switch-field", "feature-toggle", "preference", "permission"],
        interactionStates: [
          "off",
          "on",
          "default",
          "hover",
          "pressed",
          "disabled",
          "focus",
          "compact",
          "wide",
          "rich",
        ],
      },
    },
  }),
  accordion: createRegistryFamilySource({
    family: "accordion",
    contractPaths: ["tests/contracts/accordion.contract.ts"],
    familyAuditDocPath: "docs/audits/accordion-family-accessibility.md",
    pathOverrides: {
      presetPaths: [
        "packages/presets/src/firstEdition/accordion.css",
        "packages/presets/src/firstEdition/molecules/accordion-field.css",
      ],
    },
    semantics: {
      coverageLevel: "family-local",
      dataComponent: null,
      canonicalAttributes: [],
      allowedPurposes: ["faq", "settings", "sections"],
      purposeAttributes: {
        faq: {
          "data-purpose": "faq",
        },
        settings: {
          "data-purpose": "settings",
        },
        sections: {
          "data-purpose": "sections",
        },
      },
      sourceOfTruthPaths: [
        "packages/react/src/components/accordion/variants.tsx",
        "packages/vue/src/components/accordion/variants.ts",
      ],
      notes: [
        "Accordion is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "Purpose metadata currently lives in the React and Vue purpose-accordion wrappers rather than the central semantic registry.",
      ],
    },
    figma: {
      componentJsons: [".figma/marwes/components/accordion.json"],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-accordion/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-accordion/-accordion_1364-11755.json",
        ".figma/marwes/pages/-accordion/-accordion-dark_2276-47132.json",
        ".figma/marwes/pages/-accordion/component-container_1369-6219.json",
      ],
      nodeReferences: {
        accordionComponentSet: "1369:6218",
        accordionLightFrame: "1364:11755",
        accordionDarkFrame: "2276:47132",
        accordionComponentContainer: "1369:6219",
      },
      figmaTokens: [
        "accordion/surface",
        "accordion/border",
        "accordion/title",
        "accordion/content",
      ],
      figmaStates: {
        baseVariants: ["accordion", "accordion-field", "faq", "settings", "sections"],
        interactionStates: [
          "collapsed",
          "expanded",
          "default",
          "hover",
          "pressed",
          "disabled",
          "focus",
          "single-open",
          "multi-open",
        ],
      },
    },
  }),
  slider: createRegistryFamilySource({
    family: "slider",
    contractPaths: ["tests/contracts/slider.contract.ts"],
    familyAuditDocPath: "docs/audits/slider-family-accessibility.md",
    pathOverrides: {
      presetPaths: [
        "packages/presets/src/firstEdition/slider.css",
        "packages/presets/src/firstEdition/molecules/slider-field.css",
      ],
    },
    semantics: {
      coverageLevel: "family-local",
      dataComponent: "slider",
      canonicalAttributes: [],
      allowedPurposes: ["volume", "brightness", "radius"],
      purposeAttributes: {
        volume: {
          "data-purpose": "volume",
        },
        brightness: {
          "data-purpose": "brightness",
        },
        radius: {
          "data-purpose": "radius",
        },
      },
      sourceOfTruthPaths: [
        "packages/core/src/components/atoms/slider/slider-recipe.ts",
        "packages/core/src/shared/field-helpers.ts",
        "packages/react/src/components/slider/variants.tsx",
        "packages/vue/src/components/slider/variants.ts",
      ],
      notes: [
        "Slider is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "The atom emits data-component=slider from core, while purpose-slider metadata currently lives in the React and Vue wrappers.",
      ],
    },
    figma: {
      componentJsons: [
        ".figma/marwes/components/slider.json",
        ".figma/marwes/components/slider-field.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-v2-slider/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-v2-slider/slider_1926-3827.json",
        ".figma/marwes/pages/-v2-slider/slider-field_1926-3720.json",
        ".figma/marwes/pages/-v2-slider/-slider_1921-33210.json",
        ".figma/marwes/pages/-v2-slider/-slider-dark_2010-12058.json",
        ".figma/marwes/pages/-v2-slider/component-container_1574-26984.json",
        ".figma/marwes/pages/-v2-slider/range-field_2010-12026.json",
      ],
      nodeReferences: {
        sliderComponentSet: "1926:3827",
        sliderFieldComponentSet: "1926:3720",
        sliderLightFrame: "1921:33210",
        sliderDarkFrame: "2010:12058",
        sliderComponentContainer: "1574:26984",
        sliderRangeField: "2010:12026",
      },
      figmaTokens: [],
      figmaStates: {
        baseVariants: ["slider", "slider-field", "volume", "brightness", "radius"],
        interactionStates: [
          "default",
          "hover-track",
          "hover-thumb",
          "pressed",
          "disabled",
          "focus",
          "tooltip",
          "touch-area",
          "top-labels",
          "inline-labels",
        ],
      },
    },
  }),
  spinner: createRegistryFamilySource({
    family: "spinner",
    contractPaths: ["tests/contracts/spinner.contract.ts"],
    semantics: {
      coverageLevel: "family-local",
      dataComponent: "spinner",
      canonicalAttributes: [],
      allowedPurposes: ["button-loading", "empty-state"],
      purposeAttributes: {
        "button-loading": {
          "data-purpose": "button-loading",
          "data-context": "button-loading",
        },
        "empty-state": {
          "data-purpose": "empty-state",
          "data-context": "empty-state",
        },
      },
      sourceOfTruthPaths: [
        "packages/core/src/components/atoms/spinner/spinner-recipe.ts",
        "packages/react/src/components/spinner/variants.tsx",
        "packages/vue/src/components/spinner/variants.ts",
      ],
      notes: [
        "Spinner is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "The atom emits data-component=spinner from core, while context-spinner metadata currently lives in the React and Vue wrappers.",
      ],
    },
    figma: {
      componentJsons: [
        ".figma/marwes/components/spinnerring.json",
        ".figma/marwes/components/spinnerclassic.json",
        ".figma/marwes/components/spinnerdual.json",
        ".figma/marwes/components/spinnerdots-round.json",
        ".figma/marwes/components/spinnerdots-square.json",
        ".figma/marwes/components/spinnerlines.json",
        ".figma/marwes/components/spinnercross.json",
        ".figma/marwes/components/newspinner.json",
        ".figma/marwes/components/spinner-animation.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-spinner/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-spinner/component-container_1737-10631.json",
        ".figma/marwes/pages/-spinner/-spinner_1737-10635.json",
        ".figma/marwes/pages/-spinner/-spinner-dark_1780-1543.json",
        ".figma/marwes/pages/-spinner/tinospinner_1766-153.json",
        ".figma/marwes/pages/cover/spinnerdots-round_1825-30933.json",
      ],
      nodeReferences: {
        spinnerComponentContainer: "1737:10631",
        spinnerLightFrame: "1737:10635",
        spinnerDarkFrame: "1780:1543",
        spinnerRingComponent: "1737:10523",
        spinnerClassicComponent: "1737:10526",
        spinnerDualComponent: "1737:10538",
        spinnerDotsRoundComponent: "1737:10529",
        spinnerDotsSquareComponent: "1780:1345",
        spinnerLinesComponent: "1780:1343",
        spinnerCrossComponent: "1780:1342",
        newSpinnerComponentSet: "1766:127",
        spinnerAnimationSet: "1767:153",
        tinoSpinnerSection: "1766:153",
        spinnerCoverDotsRoundFrame: "1825:30933",
      },
      figmaTokens: [],
      figmaStates: {
        baseVariants: [
          "classic",
          "ring",
          "dual",
          "dots-round",
          "dots-square",
          "lines",
          "cross",
          "button-loading",
          "empty-state",
        ],
        interactionStates: [
          "xs",
          "sm",
          "md",
          "lg",
          "custom",
          "light",
          "dark",
          "decorative",
          "status",
        ],
      },
    },
  }),
  toast: createRegistryFamilySource({
    family: "toast",
    contractPaths: ["tests/contracts/toast.contract.ts"],
    pathOverrides: {
      presetPaths: [
        "packages/presets/src/firstEdition/toast.css",
        "packages/presets/src/firstEdition/molecules/toast-container.css",
      ],
    },
    figma: {
      componentJsons: [".figma/marwes/components/toast.json"],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-toast/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-toast/-toast-light_1365-12526.json",
        ".figma/marwes/pages/-toast/-toast-dark_2276-56938.json",
        ".figma/marwes/pages/-toast/component-container_1574-20451.json",
      ],
      nodeReferences: {
        toastComponentSet: "1365:11937",
        toastLightFrame: "1365:12526",
        toastDarkFrame: "2276:56938",
        toastComponentContainer: "1574:20451",
      },
      figmaTokens: [
        "toast/subtle/surface",
        "toast/subtle/border",
        "toast/subtle/text",
        "toast/subtle/action",
        "toast/outline/surface",
        "toast/outline/border",
        "toast/outline/text",
        "toast/outline/action",
        "toast/rich/surface",
        "toast/rich/border",
        "toast/rich/text",
        "toast/rich/action",
      ],
      figmaStates: {
        baseVariants: [
          "subtle",
          "outline",
          "rich",
          "neutral",
          "info",
          "success",
          "warning",
          "error",
          "brand",
        ],
        interactionStates: ["light", "dark", "semantic", "primitives"],
      },
    },
  }),
  tooltip: createRegistryFamilySource({
    family: "tooltip",
    contractPaths: ["tests/contracts/tooltip.contract.ts"],
    familyAuditDocPath: "docs/audits/tooltip-family-accessibility.md",
    semantics: {
      coverageLevel: "family-local",
      dataComponent: null,
      canonicalAttributes: [],
      allowedPurposes: [],
      purposeAttributes: {},
      sourceOfTruthPaths: [
        "packages/core/src/components/atoms/tooltip/tooltip-recipe.ts",
        "packages/react/src/components/tooltip/tooltip-group.tsx",
        "packages/vue/src/components/tooltip/tooltip-group.ts",
      ],
      notes: [
        "Tooltip is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "The atom emits data-component=tooltip from core, while TooltipGroup adds its own tooltip-group metadata in the adapters.",
      ],
    },
    figma: {
      componentJsons: [
        ".figma/marwes/components/tooltip.json",
        ".figma/marwes/components/tooltip-group.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-tooltip/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-tooltip/tooltip_1364-7739.json",
        ".figma/marwes/pages/-tooltip/tooltip-group_1574-21100.json",
        ".figma/marwes/pages/-tooltip/component-container_1574-21156.json",
        ".figma/marwes/pages/-tooltip/-tooltip-group_1574-21179.json",
        ".figma/marwes/pages/-tooltip/-tooltip-group-dark_1574-21235.json",
      ],
      nodeReferences: {
        tooltipComponent: "1364:7739",
        tooltipGroupComponent: "1574:21100",
        tooltipComponentContainer: "1574:21156",
        tooltipGroupLightFrame: "1574:21179",
        tooltipGroupDarkFrame: "1574:21235",
      },
      figmaTokens: [],
      figmaStates: {
        baseVariants: ["tooltip", "tooltip-group"],
        interactionStates: ["open", "closed", "hover", "focus", "escape-dismiss", "light", "dark"],
      },
    },
  }),
}
