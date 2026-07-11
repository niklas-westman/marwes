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
  svelteDir: string
  storybookReactDir: string
  storybookVueDir: string
  storybookSvelteDir: string
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
  svelteDir?: string
  storybookReactDir?: string
  storybookVueDir?: string
  storybookSvelteDir?: string
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
    svelteDir: `packages/svelte/src/lib/components/${family}`,
    storybookReactDir: `apps/storybook-react/src/stories/${family}`,
    storybookVueDir: `apps/storybook-vue/src/stories/${family}`,
    storybookSvelteDir: `apps/storybook-svelte/src/stories/${family}`,
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
        ".figma/marwes/pages/-avatar/-avatar_1574-27460.json",
        ".figma/marwes/pages/-avatar/-avatar-dark_1574-27570.json",
      ],
      nodeReferences: {
        avatarComponentSet: "1574:27371",
        avatarBadgeComponentSet: "1574:27394",
        avatarGroupComponent: "1574:27395",
        avatarLightFrame: "1574:27460",
        avatarDarkFrame: "1574:27570",
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
      componentJsons: [".figma/marwes/components/badge.json"],
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
        ".figma/marwes/pages/------playground---dashboard/badges_2832-30424.json",
      ],
      nodeReferences: {
        badgeLightFrame: "1364:11603",
        badgeDarkFrame: "2276:56582",
        badgeComponentContainer: "1369:6125",
        badgeComponent: "1364:7721",
        badgeDashboardFrame: "2832:30424",
      },
      figmaTokens: ["status-display/surface", "status-display/border", "status-display/text"],
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
  banner: createRegistryFamilySource({
    family: "banner",
    contractPaths: [],
    figma: {
      componentJsons: [".figma/marwes/components/banner.json"],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-banner/-banner_1593-5094.json",
        ".figma/marwes/pages/-banner/-banner-dark_2444-2179.json",
        ".figma/marwes/pages/-banner/overall-status_1730-4164.json",
        ".figma/marwes/pages/-banner/examples_1593-7192.json",
      ],
      nodeReferences: {
        bannerComponent: "1593:5080",
        bannerLightFrame: "1593:5094",
        bannerDarkFrame: "2444:2179",
      },
      figmaTokens: ["banner/surface", "banner/border", "banner/icon"],
      figmaStates: {
        baseVariants: ["neutral", "info", "success", "warning", "error"],
        interactionStates: [
          "light",
          "dark",
          "with-icon",
          "without-icon",
          "with-cta",
          "dismissible",
        ],
      },
    },
  }),
  button: createRegistryFamilySource({
    family: "button",
    contractPaths: ["tests/contracts/button.contract.ts"],
    familyAuditDocPath: "docs/audits/button-family-accessibility.md",
    figma: {
      componentJsons: [
        ".figma/marwes/components/button.json",
        ".figma/marwes/components/button-destructive.json",
        ".figma/marwes/components/button-success.json",
        ".figma/marwes/components/button-group.json",
        ".figma/marwes/components/icon-button.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/------playground---dashboard/buttons_2832-30431.json",
        ".figma/marwes/pages/-button/component-container_1364-11870.json",
        ".figma/marwes/pages/-button/-button_1371-11172.json",
        ".figma/marwes/pages/-button/-button-dark_1371-11537.json",
        ".figma/marwes/pages/-button/-purpose-buttons_1371-8933.json",
        ".figma/marwes/pages/-button/-purpose-buttons-dark_1371-9188.json",
      ],
      nodeReferences: {
        baseLightFrame: "1371:11172",
        baseDarkFrame: "1371:11537",
        purposeLightFrame: "1371:8933",
        purposeDarkFrame: "1371:9188",
      },
      figmaTokens: [
        "button/primary/surface",
        "button/primary/label",
        "button/secondary/label",
        "button/secondary/outline",
        "button/text/label",
        "button/gap",
        "button/paddingH",
        "button/paddingV",
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
      ],
      nodeReferences: {
        cardComponent: "1364:7718",
        cardLightFrame: "1364:11556",
        cardDarkFrame: "1368:5891",
        cardComponentContainer: "1371:13326",
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
        ".figma/marwes/pages/-checkbox/-checkbox-dark_2542-28177.json",
      ],
      nodeReferences: {
        checkboxComponentSet: "1369:4628",
        checkboxFieldComponentSet: "1364:5566",
        checkboxGroupComponent: "1369:4673",
        checkboxLightFrame: "1369:4700",
        checkboxDarkFrame: "2542:28177",
        checkboxComponentContainer: "1369:4657",
        checkboxGroupComponentContainer: "1369:6165",
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
        ".figma/marwes/pages/-radio-button/-radio-button_1368-6734.json",
        ".figma/marwes/pages/-radio-button/-radio-button-dark_2276-51787.json",
        ".figma/marwes/pages/-radio-button/-radio-button-dark_2969-11557.json",
        ".figma/marwes/pages/-radio-button/-radio-button_2969-10998.json",
      ],
      nodeReferences: {
        radioButtonComponentSet: "1368:6733",
        radioGroupComponent: "1368:6450",
        radioLightFrame: "1368:6734",
        radioDarkFrame: "2276:51787",
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
        ".figma/marwes/pages/-dialog/-dialog_1609-15527.json",
        ".figma/marwes/pages/-dialog/-dialog-dark_3017-37102.json",
        ".figma/marwes/pages/-dialog/icons-interface-x_1595-13879.json",
      ],
      nodeReferences: {
        dialogComponent: "1609:15459",
        dialogLightFrame: "1609:15527",
        dialogDarkFrame: "3017:37102",
        closeIcon: "1595:13879",
      },
      figmaTokens: ["text/primary", "text/secondary"],
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
      figmaTokens: [],
      figmaStates: {
        baseVariants: ["horizontal-divider"],
        interactionStates: [
          "sp-80",
          "sp-64",
          "sp-48",
          "sp-32",
          "sp-16",
          "sp-12",
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
      figmaTokens: [],
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
      figmaTokens: [],
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
        ".figma/marwes/pages/-slider/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/slider-archive/slider_1926-3827.json",
        ".figma/marwes/pages/slider-archive/slider-field_1926-3720.json",
        ".figma/marwes/pages/-slider/-slider_2462-11678.json",
        ".figma/marwes/pages/-slider/-slider_2464-13677.json",
      ],
      nodeReferences: {
        sliderComponentSet: "1926:3827",
        sliderFieldComponentSet: "1926:3720",
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
  skeleton: createRegistryFamilySource({
    family: "skeleton",
    contractPaths: ["tests/contracts/skeleton.contract.ts"],
    semantics: {
      coverageLevel: "family-local",
      dataComponent: "skeleton",
      canonicalAttributes: [],
      allowedPurposes: [],
      purposeAttributes: {},
      sourceOfTruthPaths: ["packages/core/src/components/atoms/skeleton/skeleton-recipe.ts"],
      notes: [
        "Skeleton is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "The atom emits data-component=skeleton plus local variant and animation attributes from core.",
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
      pageReferences: [
        ".figma/marwes/pages/-skeleton/skeleton_1921-34816.json",
        ".figma/marwes/pages/-v3-components-checklist/must-have-skeleton-needed-as-component-in-figma-though-nice_1896-33145.json",
      ],
      nodeReferences: {
        skeletonBaselineFrame: "1921:34816",
        skeletonChecklistItem: "1896:33145",
      },
      figmaTokens: [],
      figmaStates: {
        baseVariants: ["text", "circular", "rectangular"],
        interactionStates: ["pulse", "wave", "none", "decorative", "status", "custom-size"],
      },
    },
  }),
  "progress-bar": createRegistryFamilySource({
    family: "progress-bar",
    contractPaths: ["tests/contracts/progress-bar.contract.ts"],
    semantics: {
      coverageLevel: "family-local",
      dataComponent: "progress-bar",
      canonicalAttributes: [],
      allowedPurposes: [],
      purposeAttributes: {},
      sourceOfTruthPaths: [
        "packages/core/src/components/atoms/progress-bar/progress-bar-recipe.ts",
      ],
      notes: [
        "ProgressBar is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "The atom emits data-component=progress-bar plus local size, state, and disabled attributes from core.",
      ],
    },
    figma: {
      componentJsons: [".figma/marwes/components/progress-bar.json"],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-progress-bar/-progress-bar_1727-3932.json",
        ".figma/marwes/pages/-progress-bar/-progress-bar-dark_1727-4018.json",
      ],
      nodeReferences: {
        progressBarComponent: "1727:3852",
        progressBarLightFrame: "1727:3932",
        progressBarDarkFrame: "1727:4018",
      },
      figmaTokens: [],
      figmaStates: {
        baseVariants: ["progress-bar", "small", "default"],
        interactionStates: [
          "default",
          "hover",
          "pressed",
          "disabled",
          "focus",
          "label",
          "percentage",
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
  "date-picker": createRegistryFamilySource({
    family: "date-picker",
    contractPaths: ["tests/contracts/date-picker.contract.ts"],
    semantics: {
      coverageLevel: "family-local",
      dataComponent: "date-picker",
      canonicalAttributes: [],
      allowedPurposes: [],
      purposeAttributes: {},
      sourceOfTruthPaths: ["packages/core/src/components/atoms/date-picker/date-picker-recipe.ts"],
      notes: [
        "Date Picker is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "The component emits data-component=date-picker plus local device and day-state metadata from core.",
      ],
    },
    figma: {
      componentJsons: [
        ".figma/marwes/components/date-picker.json",
        ".figma/marwes/components/partsdate-picker-item.json",
        ".figma/marwes/components/date-picker-field.json",
        ".figma/marwes/components/icons-interface-calendar.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-v2-date-picker/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-v2-date-picker/date-picker_1918-16141.json",
        ".figma/marwes/pages/-v2-date-picker/-date-picker_1807-17542.json",
        ".figma/marwes/pages/-v2-date-picker/-date-picker-dark_1807-17615.json",
        ".figma/marwes/pages/-v2-date-picker/partsdate-picker-item_1807-16918.json",
      ],
      nodeReferences: {
        datePickerItemComponentSet: "1814:1221",
        datePickerField: "1807:17191",
      },
      figmaTokens: [],
      figmaStates: {
        baseVariants: ["desktop", "mobile"],
        interactionStates: [
          "default",
          "hover",
          "selected",
          "range",
          "range-hover",
          "disabled",
          "null",
        ],
      },
    },
  }),
  "stat-tile": createRegistryFamilySource({
    family: "stat-tile",
    contractPaths: ["tests/contracts/stat-tile.contract.ts"],
    semantics: {
      coverageLevel: "family-local",
      dataComponent: "stat-tile",
      canonicalAttributes: [],
      allowedPurposes: [],
      purposeAttributes: {},
      sourceOfTruthPaths: ["packages/core/src/components/atoms/stat-tile/stat-tile-recipe.ts"],
      notes: [
        "Stat Tile is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "The atom emits data-component=stat-tile plus local tone and trend attributes from core.",
      ],
    },
    figma: {
      componentJsons: [
        ".figma/marwes/components/stat-tile.json",
        ".figma/marwes/components/partsstat-tiletrend.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-stat-tile/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-stat-tile/-badge_3008-4750.json",
        ".figma/marwes/pages/-stat-tile/-badge-dark_3008-4890.json",
      ],
      nodeReferences: {
        statTileComponent: "1411:6857",
        statTileTrendComponentSet: "2695:25437",
      },
      figmaTokens: [],
      figmaStates: {
        baseVariants: ["neutral", "brand", "success", "warning", "danger"],
        interactionStates: ["positive", "negative", "label", "value", "subtitle", "trend"],
      },
    },
  }),
  "context-menu": createRegistryFamilySource({
    family: "context-menu",
    contractPaths: [],
    figma: {
      componentJsons: [
        ".figma/marwes/components/context-menu.json",
        ".figma/marwes/components/partscontext-menucontext-menu-item.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-context-menu/-context-menu_1574-24029.json",
        ".figma/marwes/pages/-context-menu/-context-menu-dark_1574-24160.json",
        ".figma/marwes/pages/-context-menu/component-container_2967-6148.json",
      ],
      nodeReferences: {
        contextMenuComponent: "1574:23952",
        contextMenuItemComponent: "1574:23946",
        contextMenuLightFrame: "1574:24029",
        contextMenuDarkFrame: "1574:24160",
        contextMenuContainer: "2967:6148",
      },
      figmaTokens: [],
      figmaStates: {
        baseVariants: ["default", "grouped", "quick-actions"],
        interactionStates: ["light", "dark", "disabled", "destructive", "divider"],
      },
    },
  }),
  breadcrumb: createRegistryFamilySource({
    family: "breadcrumb",
    contractPaths: [],
    figma: {
      componentJsons: [
        ".figma/marwes/components/breadcrumb.json",
        ".figma/marwes/components/partsbreadcrumbbreadcrumb-item.json",
        ".figma/marwes/components/partsbreadcrumbbreadcrumb-separator.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-breadcrumb/-breadcrumb_1574-27193.json",
        ".figma/marwes/pages/-breadcrumb/-breadcrumb-dark_1574-27268.json",
        ".figma/marwes/pages/-breadcrumb/component-container_1592-2744.json",
      ],
      nodeReferences: {
        breadcrumbComponent: "1574:26965",
        breadcrumbItemComponent: "1574:26960",
        breadcrumbSeparatorComponent: "1574:26962",
        breadcrumbLightFrame: "1574:27193",
        breadcrumbDarkFrame: "1574:27268",
        breadcrumbContainer: "1592:2744",
      },
      figmaTokens: [],
      figmaStates: {
        baseVariants: ["home", "link-item", "separator", "current-page"],
        interactionStates: ["light", "dark", "hover", "focus", "current"],
      },
    },
  }),
  drawer: createRegistryFamilySource({
    family: "drawer",
    contractPaths: [],
    figma: {
      componentJsons: [".figma/marwes/components/drawer.json"],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
        ".figma/marwes/pages/-drawer/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-drawer/-drawer_1609-15651.json",
        ".figma/marwes/pages/-drawer/-drawer-dark_3017-37492.json",
        ".figma/marwes/pages/-drawer/component-container_2967-7341.json",
      ],
      nodeReferences: {
        drawerComponentSet: "3017:37258",
        drawerLightFrame: "1609:15651",
        drawerDarkFrame: "3017:37492",
        drawerContainer: "2967:7341",
      },
      figmaTokens: [],
      figmaStates: {
        baseVariants: ["default", "minimal", "small", "medium", "large", "left", "right"],
        interactionStates: ["open", "closed", "modal", "scrim", "footer", "dismissible"],
      },
    },
  }),
  text: createRegistryFamilySource({
    family: "text",
    contractPaths: ["tests/contracts/text.contract.ts"],
    pathOverrides: {
      presetPaths: ["packages/presets/src/firstEdition/typography.css"],
    },
    semantics: {
      coverageLevel: "family-local",
      dataComponent: null,
      canonicalAttributes: [],
      allowedPurposes: [],
      purposeAttributes: {},
      sourceOfTruthPaths: [
        "packages/core/src/components/atoms/text/text-recipe.ts",
        "packages/core/src/components/atoms/text/text-types.ts",
        "packages/core/src/theme/text-variant.ts",
      ],
      notes: [
        "Text is not part of the wave-1 canonical semantic registry in @marwes-ui/core.",
        "The atom emits typography classes and native inline/block text elements without adding Marwes data-component metadata.",
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
      pageReferences: [
        ".figma/marwes/pages/------playground---dashboard/text_2832-29644.json",
        ".figma/marwes/pages/------playground---dashboard/row-1-typography-text-inputs_2832-29277.json",
        ".figma/marwes/pages/-dashboard-teaser/text-box_3088-24118.json",
      ],
      nodeReferences: {
        dashboardTextFrame: "2832:29644",
        typographyInputsRow: "2832:29277",
        dashboardTeaserTextBox: "3088:24118",
      },
      figmaTokens: [],
      figmaStates: {
        baseVariants: ["label", "caption", "overline", "micro", "body"],
        interactionStates: ["span", "p", "div", "light", "dark"],
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
        ".figma/marwes/pages/-toast/-toast-dark_2970-9564.json",
      ],
      nodeReferences: {
        toastComponentSet: "1365:11937",
        toastLightFrame: "1365:12526",
        toastDarkFrame: "2970:9564",
      },
      figmaTokens: [
        "status-display/subtle/surface",
        "status-display/subtle/border",
        "status-display/subtle/text",
        "status-display/outline/surface",
        "status-display/outline/border",
        "status-display/outline/text",
        "status-display/rich/surface",
        "status-display/rich/border",
        "status-display/rich/text",
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
  "segmented-control": createRegistryFamilySource({
    family: "segmented-control",
    contractPaths: [],
    figma: {
      componentJsons: [".figma/marwes/components/segmented-control.json"],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-segmented-control/-segmented-control_1571-19406.json",
        ".figma/marwes/pages/-segmented-control/-segmented-control_2702-10336.json",
        ".figma/marwes/pages/------playground---dashboard/segmented-control_2832-29116.json",
        ".figma/marwes/pages/------playground---dashboard/segmented-control_2832-29118.json",
        ".figma/marwes/pages/------playground---dashboard/segmented-control_2832-29119.json",
        ".figma/marwes/pages/------playground---dashboard/segmented-control_2832-29120.json",
      ],
      nodeReferences: {
        segmentedControlComponentSet: "1571:19333",
        segmentedControlShowcaseFrame: "1571:19406",
      },
      figmaTokens: [],
      figmaStates: {
        baseVariants: [
          "2-segments",
          "3-segments",
          "4-segments",
          "icon",
          "no-icon",
          "inverse",
          "default",
        ],
        interactionStates: ["active", "inactive", "disabled", "hover", "focus"],
      },
    },
  }),
  pagination: createRegistryFamilySource({
    family: "pagination",
    contractPaths: [],
    figma: {
      componentJsons: [
        ".figma/marwes/components/pagination.json",
        ".figma/marwes/components/partspaginationpage-item.json",
        ".figma/marwes/components/partspaginationactive-page-item.json",
        ".figma/marwes/components/partspaginationellipsis.json",
      ],
      curatedReferences: [
        ".figma/INDEX.md",
        ".figma/NODE_REFERENCE.md",
        ".figma/nodes.json",
        ".figma/marwes/components/_index.json",
        ".figma/marwes/manifest.json",
        ".figma/marwes/README.md",
      ],
      pageReferences: [
        ".figma/marwes/pages/-pagination/overall-status_1730-4200.json",
        ".figma/marwes/pages/-pagination/-pagination_1727-4104.json",
        ".figma/marwes/pages/-pagination/-pagination-dark_1727-4253.json",
        ".figma/marwes/pages/-pagination/component-container_1729-4143.json",
        ".figma/marwes/pages/-v3-components-checklist/must-have-skeleton-needed-as-component-in-figma-though-nice_1384-12675.json",
        ".figma/marwes/pages/-v3-components-checklist/must-have-skeleton-needed-as-component-in-figma-though-nice_1896-33145.json",
      ],
      nodeReferences: {
        paginationComponent: "1727:3905",
        paginationPageItem: "1727:3897",
        paginationActivePageItem: "1727:3899",
        paginationEllipsis: "1727:3903",
        paginationLightFrame: "1727:4104",
        paginationDarkFrame: "1727:4253",
      },
      figmaTokens: [
        "pagination/active-surface",
        "pagination/active-text",
        "pagination/item-border",
        "pagination/item-surface",
        "pagination/item-text",
      ],
      figmaStates: {
        baseVariants: ["with-prev-next", "without-prev-next", "page", "active-page", "ellipsis"],
        interactionStates: ["current", "disabled", "hover", "focus", "light", "dark"],
      },
    },
  }),
}
