/**
 * Svelte adapter: Verifies the complete public API surface —
 * all component exports, function/hook exports, and core re-exports
 * are available from the package root.
 */
import { describe, expect, it } from "vitest"
import type { MwTheme } from "../lib/index.js"
import * as publicApi from "../lib/index.js"

describe("Public API exports", () => {
  describe("Component exports", () => {
    const expectedComponents = [
      "Accordion",
      "AccordionField",
      "FAQAccordion",
      "SettingsAccordion",
      "SectionsAccordion",
      "Avatar",
      "AvatarBadge",
      "AvatarGroup",
      "ProfileAvatar",
      "PresenceAvatar",
      "TeamAvatarGroup",
      "Badge",
      "BadgeGroup",
      "StatusBadge",
      "PriorityBadge",
      "NotificationBadge",
      "Button",
      "PrimaryButton",
      "SecondaryButton",
      "TextButton",
      "SuccessButton",
      "DestructiveButton",
      "SubmitButton",
      "CancelButton",
      "CreateButton",
      "LinkButton",
      "SaveButton",
      "ConfirmButton",
      "VerifyButton",
      "EditButton",
      "CloseButton",
      "RefreshButton",
      "UploadButton",
      "DownloadButton",
      "CopyButton",
      "SearchButton",
      "FilterButton",
      "SortButton",
      "DropdownButton",
      "Card",
      "ProductCard",
      "ProfileCard",
      "StatCard",
      "Checkbox",
      "CheckboxField",
      "CheckboxGroupField",
      "DatePicker",
      "Dialog",
      "DialogModal",
      "ConfirmDialog",
      "DestructiveDialog",
      "InfoDialog",
      "Drawer",
      "Divider",
      "H1",
      "H2",
      "H3",
      "Paragraph",
      "Text",
      "TypographyText",
      "Icon",
      "Input",
      "InputField",
      "InputOtp",
      "RichText",
      "RichTextField",
      "EmailField",
      "PasswordField",
      "SearchField",
      "PhoneField",
      "URLField",
      "CurrencyField",
      "DateOfBirthField",
      "ZipCodeField",
      "DropdownField",
      "Select",
      "SelectField",
      "Textarea",
      "TextareaField",
      "Radio",
      "RadioGroupField",
      "OptionRadioGroup",
      "YesNoRadioGroup",
      "RatingRadioGroup",
      "ProgressBar",
      "Skeleton",
      "Slider",
      "SliderField",
      "VolumeSlider",
      "BrightnessSlider",
      "RadiusSlider",
      "Spacer",
      "Spacing",
      "Spinner",
      "ButtonSpinner",
      "EmptyStateSpinner",
      "StatTile",
      "Switch",
      "SwitchField",
      "FeatureToggle",
      "PreferenceSwitch",
      "PermissionSwitch",
      "TabGroup",
      "Tab",
      "TabPanel",
      "NavigationTabs",
      "ContentTabs",
      "SettingsTabs",
      "Toast",
      "ToastContainer",
      "ToastProvider",
      "SuccessToast",
      "ErrorToast",
      "WarningToast",
      "InfoToast",
      "Tooltip",
      "TooltipGroup",
      "MarwesProvider",
    ]

    it.each(expectedComponents)("exports %s", (name) => {
      expect((publicApi as Record<string, unknown>)[name]).toBeDefined()
    })
  })

  describe("Function/hook exports", () => {
    it("exports useTheme", () => {
      expect(publicApi.useTheme).toBeDefined()
      expect(typeof publicApi.useTheme).toBe("function")
    })

    it("exports useThemeMode", () => {
      expect(publicApi.useThemeMode).toBeDefined()
      expect(typeof publicApi.useThemeMode).toBe("function")
    })

    it("exports useToast", () => {
      expect(publicApi.useToast).toBeDefined()
      expect(typeof publicApi.useToast).toBe("function")
    })

    it("exports createMarwesThemeScript", () => {
      expect(publicApi.createMarwesThemeScript).toBeDefined()
      expect(typeof publicApi.createMarwesThemeScript).toBe("function")
    })

    it("exports createMarwesThemeStyle", () => {
      expect(publicApi.createMarwesThemeStyle).toBeDefined()
      expect(typeof publicApi.createMarwesThemeStyle).toBe("function")
    })
  })

  describe("Core re-exports", () => {
    const expectedEnums = [
      "AvatarSize",
      "AvatarType",
      "BadgeVariant",
      "ButtonAction",
      "ButtonSize",
      "ButtonVariant",
      "IconName",
      "Spacings",
      "SwitchSize",
      "TextVariant",
      "ThemeMode",
    ]

    it.each(expectedEnums)("exports %s", (name) => {
      expect((publicApi as Record<string, unknown>)[name]).toBeDefined()
    })

    it("exports createFontStack", () => {
      expect(publicApi.createFontStack).toBeDefined()
    })

    it("exports mwTheme", () => {
      const exportedTheme: MwTheme = publicApi.mwTheme

      expect(publicApi.mwTheme).toBeDefined()
      expect(exportedTheme.spacing.sp16).toBe("var(--mw-spacing-sp-16)")
      expect(publicApi.mwTheme.media.desktopAndAbove).toBe("@media (min-width: 1200px)")
    })

    it("exports mwThemeVars", () => {
      expect(publicApi.mwThemeVars).toBeDefined()
    })

    it("exports createMwTheme helpers", () => {
      expect(publicApi.createMwTheme).toBeDefined()
      expect(publicApi.createMwThemeMedia).toBeDefined()
    })

    it("exports mwVar", () => {
      expect(publicApi.mwVar).toBeDefined()
    })
  })
})
