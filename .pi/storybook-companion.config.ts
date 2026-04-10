interface StorybookCompanionFamilyConfig {
  titleByStem?: Record<string, string>
  canonicalComponentStems?: string[]
  exportParityExempt?: boolean
  storyOnly?: boolean
  excluded?: boolean
}

interface StorybookCompanionConfig {
  ignoredComponentStemPatterns: {
    exact: string[]
    prefixes: string[]
    suffixes: string[]
  }
  families: Record<string, StorybookCompanionFamilyConfig>
}

function toPascalCase(value: string): string {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

function mapTitles(prefix: string, stems: string[]): Record<string, string> {
  return Object.fromEntries(stems.map((stem) => [stem, `${prefix}/${toPascalCase(stem)}`]))
}

export const storybookCompanionConfig: StorybookCompanionConfig = {
  ignoredComponentStemPatterns: {
    exact: ["variants", "field-variants", "toast-manager-types", "toast-provider"],
    prefixes: ["create-"],
    suffixes: ["-variants", "-types", "-icon"],
  },
  families: {
    button: {
      titleByStem: {
        button: "Buttons/Atom/Button",
        ...mapTitles("Buttons/Variant", ["primary-button", "secondary-button", "text-button"]),
        ...mapTitles("Buttons/Purpose", [
          "cancel-button",
          "close-button",
          "confirm-button",
          "copy-button",
          "create-button",
          "danger-button",
          "download-button",
          "dropdown-button",
          "edit-button",
          "filter-button",
          "link-button",
          "refresh-button",
          "save-button",
          "search-button",
          "sort-button",
          "submit-button",
          "upload-button",
          "verify-button",
        ]),
      },
    },
    spinner: {
      canonicalComponentStems: ["spinner", "button-spinner", "empty-state-spinner"],
    },
    input: {
      titleByStem: {
        ...mapTitles("Input/Atom", ["input", "textarea", "rich-text", "select"]),
        ...mapTitles("Input/Molecule", [
          "input-field",
          "textarea-field",
          "rich-text-field",
          "select-field",
        ]),
        ...mapTitles("Input/Purpose", [
          "dropdown-field",
          "search-field",
          "password-field",
          "email-field",
          "date-of-birth-field",
          "zip-code-field",
          "phone-field",
          "currency-field",
        ]),
        "url-field": "Input/Purpose/URLField",
      },
    },
    badge: {
      titleByStem: {
        badge: "Badge/Atom",
        "badge-group": "Badge/Molecule",
        "status-badge": "Badge/Purpose/Status",
        "priority-badge": "Badge/Purpose/Priority",
        "notification-badge": "Badge/Purpose/Notification",
      },
    },
    accordion: {
      titleByStem: {
        accordion: "Accordion/Atom",
        "accordion-field": "Accordion/Molecule",
        "faq-accordion": "Accordion/Purpose/FAQ",
        "sections-accordion": "Accordion/Purpose/Sections",
        "settings-accordion": "Accordion/Purpose/Settings",
      },
    },
    radio: {
      titleByStem: {
        radio: "Radio/Atom",
        "radio-group-field": "Radio/Molecule",
        "yes-no-radio-group": "Radio/Purpose/YesNo",
        "rating-radio-group": "Radio/Purpose/Rating",
        "option-radio-group": "Radio/Purpose/Option",
      },
    },
    slider: {
      titleByStem: {
        slider: "Slider/Atom",
        "slider-field": "Slider/Molecule",
        ...mapTitles("Slider/Purpose", ["volume-slider", "brightness-slider", "radius-slider"]),
      },
    },
    switch: {
      titleByStem: {
        switch: "Switch/Atom",
        "switch-field": "Switch/Molecule",
        "feature-toggle": "Switch/Purpose/FeatureToggle",
        "preference-switch": "Switch/Purpose/Preference",
        "permission-switch": "Switch/Purpose/Permission",
      },
    },
    dialog: {
      titleByStem: {
        dialog: "Dialog/Atom",
        "dialog-modal": "Dialog/Molecule",
        ...mapTitles("Dialog/Purpose", ["confirm-dialog", "destructive-dialog", "info-dialog"]),
      },
    },
    card: {
      titleByStem: {
        card: "Card/Atom",
        ...mapTitles("Card/Purpose", ["product-card", "profile-card", "stat-card"]),
      },
    },
    tab: {
      titleByStem: {
        tab: "Tab/Atom",
        "tab-group": "Tab/Molecule",
        ...mapTitles("Tab/Purpose", ["navigation-tabs", "content-tabs", "settings-tabs"]),
      },
    },
    avatar: {
      titleByStem: {
        avatar: "Avatar/Atom",
        "avatar-badge": "Avatar/Molecule/AvatarBadge",
        "avatar-group": "Avatar/Molecule/AvatarGroup",
        "profile-avatar": "Avatar/Purpose/ProfileAvatar",
        "presence-avatar": "Avatar/Purpose/PresenceAvatar",
        "team-avatar-group": "Avatar/Purpose/TeamAvatarGroup",
      },
    },
    toast: {
      titleByStem: {
        toast: "Toast/Atom",
        "toast-container": "Toast/Molecule",
        "toast-matrix": "Toast/Purpose/Matrix",
        ...mapTitles("Toast/Purpose", [
          "success-toast",
          "error-toast",
          "warning-toast",
          "info-toast",
        ]),
      },
    },
    heading: {
      titleByStem: {
        heading: "Heading/Atom",
      },
      canonicalComponentStems: ["heading"],
      exportParityExempt: true,
    },
    color: {
      titleByStem: {
        color: "Design System/Colors",
      },
      storyOnly: true,
    },
    typography: {
      excluded: true,
    },
  },
}
