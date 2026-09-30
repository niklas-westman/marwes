#!/usr/bin/env node

import { execFileSync } from "node:child_process"
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { dashboardDocsGuides } from "./dashboard-doc-routes.mjs"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const appRoot = path.join(repoRoot, "apps/dashboard-teaser")
const docsNavigation = JSON.parse(
  await readFile(path.join(appRoot, "src/docs/components/docs-navigation.json"), "utf8"),
)
const headerSource = await readFile(path.join(appRoot, "src/components/Header.tsx"), "utf8")
const logoPaths = [...headerSource.matchAll(/<path\s+d="([^"]+)"\s+fill="currentColor"\s*\/>/gu)]
  .map(([, d]) => `<path d="${d}" fill="currentColor"/>`)
  .join("")
if (!logoPaths) throw new Error("Missing shared Marwes logo paths")
const registryPath = path.join(repoRoot, "artifacts/component-registry.json")
const publicApiPath = path.join(repoRoot, "artifacts/public-api.json")
const manifestPath = path.join(appRoot, "src/docs/generated/docs-routes.json")
const checkMode = process.argv.includes("--check")

const frameworkPackages = {
  react: "@marwes-ui/react",
  vue: "@marwes-ui/vue",
  svelte: "@marwes-ui/svelte",
}

const storybookOrigins = {
  react: "https://storybook-react.marwes.io/latest/",
  vue: "https://storybook-vue.marwes.io/latest/",
  svelte: "https://storybook-svelte.marwes.io/latest/",
}

const canonicalExports = {
  accordion: "AccordionField",
  avatar: "ProfileAvatar",
  badge: "StatusBadge",
  banner: "InfoBanner",
  breadcrumb: "Breadcrumb",
  button: "PrimaryButton",
  card: "ProductCard",
  checkbox: "CheckboxField",
  "context-menu": "ContextMenu",
  "date-picker": "DatePickerField",
  dialog: "DialogModal",
  divider: "Divider",
  drawer: "Drawer",
  heading: "H1",
  icon: "Icon",
  input: "InputField",
  pagination: "PaginationField",
  paragraph: "Paragraph",
  "progress-bar": "ProgressBar",
  radio: "RadioGroupField",
  "segmented-control": "SegmentedControlField",
  skeleton: "Skeleton",
  slider: "SliderField",
  spacing: "Spacer",
  spinner: "Spinner",
  "stat-tile": "StatTile",
  switch: "SwitchField",
  tab: "NavigationTabs",
  text: "Text",
  toast: "InfoToast",
  tooltip: "TooltipGroup",
}

const staticRoutes = dashboardDocsGuides

const fixtureNamesByFamily = {
  accordion: "accordion",
  avatar: "avatar",
  badge: "badge",
  banner: "banner",
  breadcrumb: "breadcrumb",
  button: "button",
  card: "card",
  checkbox: "checkbox",
  "context-menu": "context-menu",
  "date-picker": "date-picker",
  dialog: "dialog-drawer",
  divider: "divider",
  drawer: "dialog-drawer",
  heading: "typography",
  icon: "icon",
  input: "input",
  pagination: "pagination",
  paragraph: "typography",
  "progress-bar": "progress",
  radio: "radio",
  "segmented-control": "segmented",
  skeleton: "skeleton",
  slider: "slider",
  spacing: "spacing",
  spinner: "spinner",
  "stat-tile": "stat-tile",
  switch: "switch",
  tab: "tab",
  text: "typography",
  toast: "toast",
  tooltip: "tooltip",
}

const internalAtomReplacements = {
  Accordion: "AccordionField",
  Checkbox: "CheckboxField",
  DatePicker: "DatePickerField",
  Input: "InputField",
  InputOtp: "InputOtpField",
  Pagination: "PaginationField",
  Radio: "RadioGroupField",
  RichText: "RichTextField",
  SegmentedControl: "SegmentedControlField",
  Select: "SelectField",
  Slider: "SliderField",
  Switch: "SwitchField",
  Textarea: "TextareaField",
}

const inputRecommendedComponents = [
  { name: "InputField", description: "Base text input with validation" },
  { name: "EmailField", description: "Email input with semantic browser attributes" },
  { name: "PasswordField", description: "Password input with visibility toggle" },
  { name: "SearchField", description: "Search input with clear action" },
  { name: "SelectField", description: "Dropdown select with native feel" },
  { name: "TextareaField", description: "Multi-line text input" },
  { name: "InputOtpField", description: "One-time passcode input" },
]

const buttonRecommendedComponents = [
  { name: "PrimaryButton", description: "Default high-emphasis product action" },
  { name: "SecondaryButton", description: "Supporting action with reduced emphasis" },
  { name: "SubmitButton", description: "Form submission with locked action semantics" },
  { name: "DestructiveButton", description: "Destructive action with explicit intent" },
  { name: "LinkButton", description: "Button styling with honest link semantics" },
  { name: "IconButton", description: "Compact icon action with explicit accessible naming" },
]

const badgeRecommendedComponents = [
  { name: "StatusBadge", description: "Passive state labels with explicit status semantics" },
  { name: "PriorityBadge", description: "Compact priority labels for ordered work" },
  {
    name: "NotificationBadge",
    description: "Notification counts with an accessible numeric label",
  },
  { name: "BadgeGroup", description: "A labeled collection of related passive badges" },
]

const bannerRecommendedComponents = [
  { name: "InfoBanner", description: "Persistent informational page-level messaging" },
  { name: "SuccessBanner", description: "Confirmation of a completed product outcome" },
  { name: "WarningBanner", description: "Important caution before a problem occurs" },
  { name: "ErrorBanner", description: "Actionable page-level failure messaging" },
]

const cardRecommendedComponents = [
  { name: "ProductCard", description: "Passive product summary surface" },
  { name: "ProfileCard", description: "Passive person or account summary surface" },
  { name: "StatCard", description: "Passive metric and supporting context surface" },
  { name: "Card", description: "Flexible surface when no purpose wrapper fits" },
]

const dividerRecommendedComponents = [
  { name: "Divider", description: "Semantic horizontal or vertical content separation" },
]

const skeletonRecommendedComponents = [
  { name: "Skeleton", description: "Decorative loading structure for text, media and blocks" },
]

const spinnerRecommendedComponents = [
  { name: "ButtonSpinner", description: "Compact loading feedback inside an action" },
  { name: "EmptyStateSpinner", description: "Centered loading feedback for an empty region" },
  { name: "Spinner", description: "Indeterminate loading indicator for custom contexts" },
]

const progressBarRecommendedComponents = [
  { name: "ProgressBar", description: "Read-only determinate progress with shared semantics" },
]

const checkboxRecommendedComponents = [
  {
    name: "CheckboxField",
    description: "Single checkbox with connected label, description and error",
  },
  {
    name: "CheckboxGroupField",
    description:
      "Fieldset of related checkboxes with grouped label and select-all indeterminate state",
  },
]

const radioRecommendedComponents = [
  { name: "YesNoRadioGroup", description: "Binary yes/no choice with explicit semantics" },
  {
    name: "RatingRadioGroup",
    description: "Numeric rating scale generated as an accessible radio group",
  },
  {
    name: "OptionRadioGroup",
    description: "General labeled option selection with purpose metadata",
  },
  {
    name: "RadioGroupField",
    description: "Base radio group for custom option sets; the deliberate escape hatch",
  },
]

const switchRecommendedComponents = [
  {
    name: "FeatureToggle",
    description: "Enable or disable a feature with explicit toggle semantics",
  },
  { name: "PreferenceSwitch", description: "Persisted user preference toggle" },
  { name: "PermissionSwitch", description: "Grant or revoke a permission with explicit intent" },
  {
    name: "SwitchField",
    description: "Base switch for custom toggle contexts; the deliberate escape hatch",
  },
]

const sliderRecommendedComponents = [
  { name: "VolumeSlider", description: "Preconfigured 0-100 volume control with a value tooltip" },
  {
    name: "BrightnessSlider",
    description: "Preconfigured 0-100 brightness control with a value tooltip",
  },
  { name: "RadiusSlider", description: "Preconfigured size control with sensible pixel bounds" },
  {
    name: "SliderField",
    description: "Base slider for custom numeric ranges; the deliberate escape hatch",
  },
]

const segmentedControlRecommendedComponents = [
  {
    name: "SegmentedControlField",
    description: "Labeled set of mutually exclusive views or filters",
  },
]

const datePickerRecommendedComponents = [
  {
    name: "DatePickerField",
    description: "Labeled single-date selection with helper text and error wiring",
  },
]

const paginationRecommendedComponents = [
  {
    name: "PaginationField",
    description: "Labeled page-based navigation through a paged data set",
  },
]

const avatarRecommendedComponents = [
  { name: "ProfileAvatar", description: "A person's identity image, initials, or icon fallback" },
  {
    name: "PresenceAvatar",
    description: "An avatar with an online, away, or offline status indicator",
  },
  {
    name: "TeamAvatarGroup",
    description: "A compact overlapping group of members with an overflow count",
  },
  { name: "Avatar", description: "Base avatar for custom contexts; the deliberate escape hatch" },
]

const breadcrumbRecommendedComponents = [
  {
    name: "Breadcrumb",
    description: "Labeled trail of the current page's location in the site hierarchy",
  },
]

const headingRecommendedComponents = [
  { name: "H1", description: "Top-level page heading" },
  { name: "H2", description: "Major section heading" },
  { name: "H3", description: "Subsection heading" },
]

const iconRecommendedComponents = [
  { name: "Icon", description: "Decorative or informative glyph from the shared icon set" },
]

const paragraphRecommendedComponents = [
  { name: "Paragraph", description: "Body copy at a small, medium, or large reading size" },
]

const spacingRecommendedComponents = [
  {
    name: "Spacing",
    description: "Token-driven decorative vertical gap between stacked content",
  },
]

const statTileRecommendedComponents = [
  {
    name: "StatTile",
    description: "Single labeled metric with an optional trend and semantic tone",
  },
]

const textRecommendedComponents = [
  {
    name: "Text",
    description: "Inline or block text across display, label, caption, and overline variants",
  },
]

const accordionRecommendedComponents = [
  { name: "FAQAccordion", description: "Frequently asked questions with single-open semantics" },
  {
    name: "SettingsAccordion",
    description: "Grouped settings sections that can stay open independently",
  },
  {
    name: "SectionsAccordion",
    description: "General content sections with purpose metadata",
  },
  {
    name: "AccordionField",
    description: "Base accordion group for custom sections; the deliberate escape hatch",
  },
]

const contextMenuRecommendedComponents = [
  {
    name: "ContextMenu",
    description: "Inline action list the consumer composes for placement and visibility",
  },
]

const dialogRecommendedComponents = [
  {
    name: "ConfirmDialog",
    description: "Confirm a reversible action with cancel and confirm controls",
  },
  {
    name: "DestructiveDialog",
    description: "Confirm an irreversible or destructive action with explicit warning intent",
  },
  { name: "InfoDialog", description: "Present information with a single acknowledgement control" },
  {
    name: "DialogModal",
    description: "Base portaled dialog for custom footer content; the deliberate escape hatch",
  },
]

const drawerRecommendedComponents = [
  {
    name: "Drawer",
    description: "Presentational slide-in panel the consumer mounts conditionally when open",
  },
]

const tabRecommendedComponents = [
  { name: "NavigationTabs", description: "Primary in-page navigation between related views" },
  { name: "ContentTabs", description: "Grouped content sections switched without navigation" },
  { name: "SettingsTabs", description: "Settings categories switched within one page" },
  {
    name: "TabGroup",
    description: "Base tab group for custom panel content; the deliberate escape hatch",
  },
]

const toastRecommendedComponents = [
  { name: "InfoToast", description: "Persistent informational toast messaging" },
  { name: "SuccessToast", description: "Confirmation of a completed outcome" },
  { name: "WarningToast", description: "Important caution before a problem occurs" },
  { name: "ErrorToast", description: "Actionable failure messaging with assertive urgency" },
]

const tooltipRecommendedComponents = [
  {
    name: "TooltipGroup",
    description: "Self-contained trigger and tooltip content with hover and keyboard focus support",
  },
]

const componentPagePresentation = {
  checkbox: {
    recommendedComponents: checkboxRecommendedComponents,
    recommendationDescription:
      "Use CheckboxField for a single choice and CheckboxGroupField when several related checkboxes share one label.",
  },
  radio: {
    recommendedComponents: radioRecommendedComponents,
    recommendationDescription:
      "Choose the purpose wrapper that matches the meaning; use RadioGroupField as the deliberate primitive escape hatch.",
  },
  switch: {
    recommendedComponents: switchRecommendedComponents,
    recommendationDescription:
      "Choose the purpose wrapper that matches the meaning; use SwitchField as the deliberate primitive escape hatch.",
  },
  slider: {
    recommendedComponents: sliderRecommendedComponents,
    recommendationDescription:
      "Choose the purpose wrapper that matches the meaning; use SliderField as the deliberate primitive escape hatch.",
  },
  "segmented-control": {
    recommendedComponents: segmentedControlRecommendedComponents,
    recommendationDescription:
      "Use SegmentedControlField when a small set of mutually exclusive views or filters should stay visible at once.",
  },
  "date-picker": {
    recommendedComponents: datePickerRecommendedComponents,
    recommendationDescription:
      "Use DatePickerField for a single labeled date selection with connected helper text and error states.",
  },
  pagination: {
    recommendedComponents: paginationRecommendedComponents,
    recommendationDescription:
      "Use PaginationField for page-based navigation through a paged data set.",
  },
  accordion: {
    recommendedComponents: accordionRecommendedComponents,
    recommendationDescription:
      "Choose the purpose wrapper that matches the meaning; use AccordionField as the deliberate primitive escape hatch.",
  },
  "context-menu": {
    recommendedComponents: contextMenuRecommendedComponents,
    recommendationDescription:
      "Use ContextMenu for a list of contextual actions; position and visibility are the consumer's responsibility.",
  },
  dialog: {
    recommendedComponents: dialogRecommendedComponents,
    recommendationDescription:
      "Choose the purpose wrapper that matches the meaning; use DialogModal as the deliberate primitive escape hatch.",
  },
  drawer: {
    recommendedComponents: drawerRecommendedComponents,
    recommendationDescription:
      "Mount Drawer conditionally when open and choose the placement that matches the surrounding layout.",
  },
  tab: {
    recommendedComponents: tabRecommendedComponents,
    recommendationDescription:
      "Choose the purpose wrapper that matches the meaning; use TabGroup as the deliberate primitive escape hatch.",
  },
  toast: {
    recommendedComponents: toastRecommendedComponents,
    recommendationDescription:
      "Choose a semantic toast intent so transient status messages remain consistent and understandable.",
  },
  tooltip: {
    recommendedComponents: tooltipRecommendedComponents,
    recommendationDescription:
      "Use TooltipGroup for supplementary help text triggered by hover or keyboard focus.",
  },
  avatar: {
    recommendedComponents: avatarRecommendedComponents,
    recommendationDescription:
      "Choose the purpose wrapper that matches the meaning; use Avatar as the deliberate primitive escape hatch.",
  },
  breadcrumb: {
    recommendedComponents: breadcrumbRecommendedComponents,
    recommendationDescription:
      "Use Breadcrumb to show where the current page sits within the site hierarchy.",
  },
  heading: {
    recommendedComponents: headingRecommendedComponents,
    recommendationDescription:
      "Choose the heading level that matches real document structure; use size only to change visual weight without changing that structure.",
  },
  icon: {
    recommendedComponents: iconRecommendedComponents,
    recommendationDescription:
      "Mark every icon decorative or give it a truthful ariaLabel; never leave both unset.",
  },
  paragraph: {
    recommendedComponents: paragraphRecommendedComponents,
    recommendationDescription:
      "Use Paragraph for body copy and reserve Text for shorter labels, captions, and overlines.",
  },
  spacing: {
    recommendedComponents: spacingRecommendedComponents,
    recommendationDescription:
      "Use Spacing tokens instead of hardcoded margins to keep vertical rhythm consistent.",
  },
  "stat-tile": {
    recommendedComponents: statTileRecommendedComponents,
    recommendationDescription:
      "Use StatTile for a single key metric with an optional trend direction and semantic tone.",
  },
  text: {
    recommendedComponents: textRecommendedComponents,
    recommendationDescription:
      "Use Text for shorter labels, captions, and overlines; use Paragraph for body copy and Heading for document structure.",
  },
  badge: {
    recommendedComponents: badgeRecommendedComponents,
    recommendationDescription:
      "Choose the purpose wrapper that matches the meaning; use Badge as the deliberate primitive escape hatch.",
  },
  banner: {
    recommendedComponents: bannerRecommendedComponents,
    recommendationDescription:
      "Choose a semantic banner intent so persistent page-level messages remain consistent and understandable.",
  },
  button: {
    recommendedComponents: buttonRecommendedComponents,
    recommendationDescription:
      "Purpose-first buttons make action intent explicit; use the base Button as the deliberate escape hatch.",
  },
  card: {
    recommendedComponents: cardRecommendedComponents,
    recommendationDescription:
      "Prefer a purpose card for known summaries and keep every Card passive unless it contains honest interactive controls.",
  },
  divider: {
    recommendedComponents: dividerRecommendedComponents,
    recommendationDescription:
      "Use Divider only when a semantic separator adds structure; use spacing when visual breathing room is enough.",
  },
  input: {
    recommendedComponents: inputRecommendedComponents,
    recommendationDescription:
      "Purpose-first fields cover common text-entry and selection use cases.",
  },
  "progress-bar": {
    recommendedComponents: progressBarRecommendedComponents,
    recommendationDescription:
      "Use ProgressBar for measurable completion and keep Slider for values the user can change.",
  },
  skeleton: {
    recommendedComponents: skeletonRecommendedComponents,
    recommendationDescription:
      "Match the placeholder shape to the loading content and let the surrounding region own loading status.",
  },
  spinner: {
    recommendedComponents: spinnerRecommendedComponents,
    recommendationDescription:
      "Prefer context wrappers for common loading placements and use Spinner for deliberate custom compositions.",
  },
}

const migratedComponentFamilies = Object.keys(componentPagePresentation)
const componentPageModelPaths = Object.fromEntries(
  migratedComponentFamilies.map((family) => [
    family,
    path.join(appRoot, "src/docs/generated", `${family}-page.json`),
  ]),
)

const componentPageSections = [
  { id: "what-this-family-solves", label: "What this family solves" },
  { id: "recommended-components", label: "Recommended components" },
  { id: "public-imports", label: "Public imports" },
  { id: "examples", label: "Examples" },
  { id: "accessibility", label: "Accessibility" },
  { id: "theming", label: "Theming" },
  { id: "resources", label: "Resources" },
]

let getStartedExamples = {}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function titleCase(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function humanizeIdentifier(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll("-", " ")
    .toLowerCase()
}

function consumerizeText(value) {
  const publicNames = Object.entries(internalAtomReplacements).reduce(
    (text, [atom, replacement]) =>
      text.replace(new RegExp(`\\b${atom}\\b(?!Field|GroupField)`, "g"), replacement),
    String(value),
  )

  return publicNames
    .replace(/\braw[- ]/gi, "")
    .replace(/\batoms\b/gi, "components")
    .replace(/\batom\b/gi, "component")
    .replace(/\bmolecules\b/gi, "compositions")
    .replace(/\bmolecule\b/gi, "composition")
    .replace(/\b([A-Z][A-Za-z0-9]+) or \1\b/g, "$1")
}

async function readJson(filePath, optional = false) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"))
  } catch (error) {
    if (optional && error?.code === "ENOENT") return null
    throw error
  }
}

function normalizePublicApi(value) {
  const exports = []

  function visit(node, context = {}) {
    if (!node || typeof node !== "object") return
    if (Array.isArray(node)) {
      for (const item of node) visit(item, context)
      return
    }

    const nextContext = {
      framework: node.framework ?? context.framework,
      packageName: node.package ?? node.packageName ?? context.packageName,
    }
    const name = node.exportName ?? node.name
    const family = node.family ?? node.registryFamily
    const kind = node.kind
    if (typeof name === "string" && typeof family === "string" && typeof kind === "string") {
      exports.push({
        family,
        framework: nextContext.framework,
        importPath: node.importPath ?? nextContext.packageName,
        kind,
        name,
      })
    }

    for (const nested of Object.values(node)) visit(nested, nextContext)
  }

  visit(value)
  return exports
}

function resolveFamilyExports(family, publicExports, hasPublicApi) {
  const matching = publicExports.filter((item) => item.family === family)
  const fallback = canonicalExports[family]

  return Object.fromEntries(
    Object.entries(frameworkPackages).map(([framework, packageName]) => {
      const components = matching
        .filter((item) => !item.framework || item.framework === framework)
        .filter((item) => item.kind === "component")
        .map((item) => item.name)
      const types = matching
        .filter((item) => !item.framework || item.framework === framework)
        .filter((item) => item.kind === "type")
        .map((item) => item.name)
      const exports = matching
        .filter((item) => !item.framework || item.framework === framework)
        .filter((item) => ["component", "type", "enum", "helper"].includes(item.kind))
        .map((item) => ({ kind: item.kind, name: item.name }))
        .filter(
          (entry, index, entries) =>
            entries.findIndex(
              (candidate) => candidate.kind === entry.kind && candidate.name === entry.name,
            ) === index,
        )
        .sort((left, right) => left.name.localeCompare(right.name))
      return [
        framework,
        {
          importPath:
            matching.find((item) => item.framework === framework)?.importPath || packageName,
          names: [
            ...new Set(
              components.length > 0 || hasPublicApi ? components : fallback ? [fallback] : [],
            ),
          ].sort(),
          types: [...new Set(types)].sort(),
          exports:
            exports.length > 0 || hasPublicApi
              ? exports
              : fallback
                ? [{ kind: "component", name: fallback }]
                : [],
        },
      ]
    }),
  )
}

function getAccessibility(family) {
  const familyRequirements = {
    checkbox: [
      "Verify indeterminate select-all checkboxes announce their mixed state correctly.",
      "Keep individual checkbox labels distinct from the surrounding group label in CheckboxGroupField.",
    ],
    radio: [
      "Keep radio group semantics honest; never build a single-choice control from checkboxes.",
      "Verify keyboard arrow-key navigation moves focus and selection together within the group.",
    ],
    switch: [
      "Use a switch only for an immediate on/off action, not a form submission or navigation trigger.",
      "Verify the switch state is announced immediately without requiring a separate submit action.",
    ],
    slider: [
      "Provide clear min and max value labels so the numeric range is understood without a screen.",
      "Verify keyboard arrow-key, Home, and End behavior sets the value the same way pointer input does.",
    ],
    "segmented-control": [
      "Give every icon-only segment a truthful ariaLabel since no visible text label exists.",
      "Verify arrow-key navigation moves focus between segments the same way pointer input does.",
    ],
    "date-picker": [
      "Verify the selected date and today's date are both distinguishable without relying on color alone.",
      "Verify keyboard arrow-key day navigation and month change announcements work without a pointer.",
    ],
    pagination: [
      "Keep the current page state visible and announced, not just implied by visual emphasis.",
      "Verify keyboard access to previous, next, and direct page controls without a pointer.",
    ],
    accordion: [
      "Keep single-open vs multi-open behavior intentional; do not silently change it between renders.",
      "Verify expand and collapse state and content are announced correctly to screen readers.",
    ],
    "context-menu": [
      "Compose real focus management, outside-click dismissal, and positioning around this primitive.",
      "Give every destructive action an explicit visual and semantic distinction from safe actions.",
    ],
    dialog: [
      "Keep restoreFocus enabled so closing a dialog returns focus to its trigger.",
      "Verify closeOnEscape and closeOnScrimClick match the real risk of losing unsaved input.",
    ],
    drawer: [
      "Mount Drawer only while open; do not leave a hidden instance competing for focus.",
      "Verify the chosen placement and modal behavior match how the surrounding page is used.",
    ],
    tab: [
      "Keep the active tab and its panel connected through matching ids, not just visual position.",
      "Verify arrow-key navigation between tabs follows the roving-tabindex pattern.",
    ],
    toast: [
      "Match ariaLive urgency to the message; reserve assertive announcements for real failures.",
      "Keep a toast visible long enough to read and let people dismiss it before it disappears.",
    ],
    tooltip: [
      "Keep tooltip content supplementary; never put required information only inside a tooltip.",
      "Verify the trigger is reachable and dismissible by keyboard, not only by pointer hover.",
    ],
    avatar: [
      "Provide real alt text for photographic avatars and mark decorative fallbacks appropriately.",
      "Give every status indicator on AvatarBadge a truthful statusLabel, not just a colored dot.",
    ],
    breadcrumb: [
      "Keep the current page marked once so aria-current reflects the real location, not just the last item by default.",
      "Keep link labels short and honest; avoid truncating text in a way that hides the real destination.",
    ],
    heading: [
      "Keep heading levels sequential in the real document outline; use size only to change visual weight.",
      "Verify screen-reader users can navigate the page by heading level alone.",
    ],
    icon: [
      "Mark every icon decorative or give it a truthful ariaLabel; never leave both unset.",
      "Verify decorative icons are never the only carrier of required information.",
    ],
    paragraph: [
      "Keep body copy in Paragraph and reserve Text for shorter labels and captions.",
      "Verify color contrast and line length stay readable at every supported size.",
    ],
    spacing: [
      "Use Spacing tokens instead of hardcoded margins so vertical rhythm stays consistent and decorative.",
      "Verify Spacing never becomes the only separation between two genuinely distinct regions; use real structure instead.",
    ],
    "stat-tile": [
      "Keep the trend direction and tone semantically accurate; do not use tone as decoration alone.",
      "Verify the auto-built trend announcement reads correctly to screen readers.",
    ],
    text: [
      "Use headingLevel only when the text is genuinely part of the document outline at that depth.",
      "Keep variant a visual choice and as/headingLevel the semantic choice; do not conflate the two.",
    ],
    badge: [
      "Keep badge text concise and provide ariaLabel when numeric content needs fuller context.",
      "Verify grouped badges retain enough visible or surrounding context in the finished product.",
    ],
    banner: [
      "Keep the message concise and make any call to action describe its result.",
      "Choose live-region urgency based on the real message; not every warning or error is assertive.",
    ],
    card: [
      "Keep the card passive unless nested links or buttons provide the actual interaction semantics.",
      "Verify heading structure and reading order in the finished card composition.",
    ],
    divider: [
      "Use a semantic divider only when it represents a meaningful separation between content groups.",
      "Verify vertical dividers have a real layout height and do not replace clearer headings or spacing.",
    ],
    "progress-bar": [
      "Provide a truthful label whenever the visible label is hidden.",
      "Verify changing progress values are announced appropriately for the duration of the product flow.",
    ],
    skeleton: [
      "Keep structural skeletons decorative unless the loading region needs an announced status label.",
      "Verify the surrounding region communicates loading without repeated or noisy announcements.",
    ],
    spinner: [
      "Provide nearby loading text or a truthful ariaLabel when the spinner announces status on its own.",
      "Verify longer loading sequences with assistive technology and reduced-motion preferences.",
    ],
  }
  const requirements = familyRequirements[family] ?? [
    "Provide a truthful accessible name and preserve Marwes focus indicators.",
    "Verify keyboard behavior and screen-reader output in the finished product flow.",
  ]
  if (
    [
      "input",
      "checkbox",
      "radio",
      "switch",
      "slider",
      "date-picker",
      "segmented-control",
      "pagination",
      "accordion",
    ].includes(family)
  ) {
    requirements.push(
      "Use the public Field component so labels, helper text, errors, and invalid state stay connected.",
    )
  }
  if (["dialog", "drawer", "context-menu", "tooltip"].includes(family)) {
    requirements.push(
      "Test focus entry, focus return, dismissal, and escape-key behavior in context.",
    )
  }
  if (family === "button" || family === "icon") {
    requirements.push(
      "Give every icon-only control an accessible name through its public naming prop.",
    )
  }
  return requirements
}

function getThemingCopy(family) {
  return `${titleCase(family)} uses Marwes preset CSS and theme variables. Customize it through the theme passed to MarwesProvider; do not add a second component stylesheet.`
}

function getStaticBody(route) {
  const routePath = route.path
  if (routePath.startsWith("/docs/integrations/")) {
    return renderIntegration(routePath.split("/").filter(Boolean).at(-1))
  }
  return ""
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
}

function renderCode(code, language = "text") {
  return `<pre data-language="${language}"><code>${escapeHtml(code)}</code></pre>`
}

function buildAccessibilityRequirements(family) {
  const titlesByFamily = {
    checkbox: ["Indeterminate state", "Group and item labeling", "Connected field wiring"],
    radio: ["Honest group semantics", "Keyboard navigation", "Connected field wiring"],
    switch: ["Immediate on/off action", "State announcement", "Connected field wiring"],
    slider: ["Value range labeling", "Keyboard range control", "Connected field wiring"],
    "segmented-control": [
      "Icon-only segment naming",
      "Keyboard segment navigation",
      "Connected field wiring",
    ],
    "date-picker": [
      "Distinguishable date states",
      "Keyboard date navigation",
      "Connected field wiring",
    ],
    pagination: ["Visible current page", "Keyboard page access", "Connected field wiring"],
    accordion: ["Intentional open behavior", "State announcement", "Connected field wiring"],
    "context-menu": [
      "Consumer-composed interaction",
      "Destructive action distinction",
      "Focus and escape review",
    ],
    dialog: ["Focus return on close", "Escape and scrim behavior", "Focus and escape review"],
    drawer: ["Conditional mounting", "Placement and modal behavior", "Focus and escape review"],
    tab: ["Connected tab and panel ids", "Keyboard tab navigation"],
    toast: ["Matched announcement urgency", "Readable dismiss timing"],
    tooltip: [
      "Supplementary content only",
      "Keyboard reachable dismissal",
      "Focus and escape review",
    ],
    avatar: ["Truthful alt text", "Status labeling"],
    breadcrumb: ["Accurate current page", "Honest link labels"],
    heading: ["Sequential heading levels", "Heading navigation review"],
    icon: ["Decorative vs informative", "Icon-only information review", "Icon-only control naming"],
    paragraph: ["Paragraph vs Text usage", "Readability review"],
    spacing: ["Token-driven rhythm", "Real structure over spacing"],
    "stat-tile": ["Accurate trend semantics", "Trend announcement review"],
    text: ["Intentional heading depth", "Visual vs semantic separation"],
    badge: ["Truthful label", "Screen-reader review"],
    banner: ["Concise message", "Keyboard and screen-reader review"],
    button: ["Accessible action names", "Keyboard and screen-reader review", "Icon-only controls"],
    card: ["Passive semantics", "Keyboard and screen-reader review"],
    divider: ["Meaningful separation", "Screen-reader review"],
    input: ["Accessible names", "Keyboard and screen-reader review", "Field relationships"],
    "progress-bar": ["Accessible progress name", "Progress announcement review"],
    skeleton: ["Loading context", "Screen-reader review"],
    spinner: ["Loading status", "Motion and screen-reader review"],
  }
  const titles = titlesByFamily[family.family] ?? []
  const requirements = family.accessibility.map((description, index) => ({
    description,
    title: titles[index] ?? `Requirement ${index + 1}`,
  }))
  family.manualReviewRequired.forEach((description, index) => {
    requirements.push({
      description,
      title: index === 0 ? "Manual review boundary" : `Manual review ${index + 1}`,
    })
  })
  return requirements
}

function buildComponentPageModel(family) {
  const presentation = componentPagePresentation[family.family]
  if (!presentation) {
    throw new Error(`Missing component page presentation for ${family.family}`)
  }

  const missingRecommendations = presentation.recommendedComponents.filter(({ name }) =>
    Object.entries(family.exports).some(
      ([, entry]) => !entry.exports.some((item) => item.kind === "component" && item.name === name),
    ),
  )
  if (missingRecommendations.length > 0) {
    throw new Error(
      `${family.displayName} recommendations are missing from at least one adapter: ${missingRecommendations
        .map(({ name }) => name)
        .join(", ")}`,
    )
  }

  const frameworks = Object.entries(family.exports).map(([framework, entry]) => ({
    framework,
    packageName: entry.importPath,
    exports: entry.exports,
    example: family.examples[framework],
  }))
  if (frameworks.length === 0) throw new Error(`${family.displayName} has no framework adapters`)

  const resources = [
    ...Object.entries(storybookOrigins).map(([framework, href]) => ({
      title: `${titleCase(framework)} Storybook`,
      description: `Explore ${titleCase(framework)} variants`,
      href,
      kind: "storybook",
    })),
    ...Object.entries(frameworkPackages).map(([framework, packageName]) => ({
      title: `${titleCase(framework)} npm package`,
      description: `Install ${packageName}`,
      href: `https://www.npmjs.com/package/${packageName}`,
      kind: "npm",
    })),
    {
      title: "Source and registry evidence",
      description: "Review the canonical family sources",
      href: `https://github.com/niklas-westman/marwes/blob/main/${family.sourcePath}`,
      kind: "source",
    },
    {
      title: "Public API inventory",
      description: "Inspect the complete machine-readable API",
      href: "/ai/v1/public-api.json",
      kind: "source",
    },
    {
      title: "Report an issue",
      description: "Get help or suggest a change",
      href: "https://github.com/niklas-westman/marwes/issues/new",
      kind: "issue",
    },
  ]

  return {
    schemaVersion: 1,
    family: family.family,
    title: family.displayName,
    summary: family.summary,
    useWhen: family.useWhen,
    avoidWhen: family.avoidWhen,
    recommendationDescription: presentation.recommendationDescription,
    recommendedComponents: presentation.recommendedComponents,
    frameworks,
    accessibility: buildAccessibilityRequirements(family),
    sections: componentPageSections,
    theming: family.theming,
    resources,
  }
}

function renderComponentStaticBody(model) {
  const intentCards = [
    ["What this family solves", `<p>${escapeHtml(model.summary)}</p>`],
    ["Use when", renderList(model.useWhen)],
    ["Avoid when", renderList(model.avoidWhen)],
  ]
    .map(
      ([title, content], index) =>
        `<article${index === 0 ? ' id="what-this-family-solves"' : ""}><h2>${title}</h2>${content}</article>`,
    )
    .join("")
  const recommendations = model.recommendedComponents
    .map(
      ({ name, description }) =>
        `<article><h3>${escapeHtml(name)}</h3><p>${escapeHtml(description)}</p></article>`,
    )
    .join("")
  const publicApiInventories = model.frameworks
    .map(({ framework, packageName, exports }) => {
      const groups = ["component", "type", "enum", "helper"]
        .map((kind) => {
          const names = exports.filter((entry) => entry.kind === kind).map((entry) => entry.name)
          if (names.length === 0) return ""
          return `<h4>${titleCase(kind)}${names.length === 1 ? "" : "s"}</h4><p>${names.map((name) => `<code>${escapeHtml(name)}</code>`).join(", ")}</p>`
        })
        .join("")
      return `<article data-framework-inventory="${framework}"><h3>${titleCase(framework)} — <code>${escapeHtml(packageName)}</code></h3>${groups}</article>`
    })
    .join("")
  const examples = model.frameworks
    .map(
      ({ framework, example }) =>
        `<article><h3>${titleCase(framework)}</h3>${renderCode(example, framework === "react" ? "tsx" : framework)}</article>`,
    )
    .join("")
  const accessibility = model.accessibility
    .map(
      ({ title, description }) =>
        `<li><strong>${escapeHtml(title)}:</strong> ${escapeHtml(description)}</li>`,
    )
    .join("")
  const resources = model.resources
    .map(
      ({ title, description, href }) =>
        `<li><a href="${escapeHtml(href)}">${escapeHtml(title)}</a> — ${escapeHtml(description)}</li>`,
    )
    .join("")

  return `<header class="component-static-intro"><p class="component-static-eyebrow">Marwes documentation</p><h1>${escapeHtml(model.title)}</h1><p>${escapeHtml(model.summary)}</p></header><div class="component-static-intents">${intentCards}</div><section id="recommended-components"><h2>Recommended public components</h2><p>${escapeHtml(model.recommendationDescription)}</p><div class="component-static-grid">${recommendations}</div></section><section id="public-imports"><h2>Public imports</h2><p>Choose an adapter in the verified examples. The inventory below reflects each framework package exactly.</p><div class="component-static-grid">${publicApiInventories}</div></section><section id="examples"><h2>Verified minimal examples</h2><p>These examples come from the same fixtures verified by the repository checks.</p>${examples}</section><section id="accessibility"><h2>Accessibility requirements</h2><ul>${accessibility}</ul></section><section id="theming"><h2>Theming</h2><p>${escapeHtml(model.theming)} See the <a href="/docs/theming/">theming guide</a> for configuration and token details.</p></section><section id="resources"><h2>Resources</h2><ul>${resources}</ul></section>`
}

function buildGetStartedPageModel(framework) {
  const packageName = frameworkPackages[framework]
  const codeLanguage = framework === "react" ? "tsx" : framework

  return {
    schemaVersion: 1,
    framework,
    packageName,
    title: `Get started with ${titleCase(framework)}`,
    summary: `Install Marwes for ${titleCase(framework)} and render your first accessible component.`,
    steps: [
      {
        id: "install",
        title: "Install with the official CLI",
        description: `The CLI installs ${packageName}, wires the provider for supported Vite layouts, and runs diagnostics.`,
        code: { language: "shell", content: `pnpm dlx @marwes-ui/cli init --adapter ${framework}` },
      },
      {
        id: "render",
        title: "Render a public component",
        description: `This is the same canonical fixture that the repository typechecks for ${titleCase(framework)}.`,
        code: { language: codeLanguage, content: getStartedExamples[framework] },
      },
      {
        id: "verify",
        title: "Verify the app",
        description:
          "A successful doctor run confirms the adapter import, rendered provider, and production build.",
        code: { language: "shell", content: "pnpm dlx @marwes-ui/cli doctor --run-build" },
      },
    ],
    sections: [
      { id: "install", label: "Install" },
      { id: "render", label: "Render" },
      { id: "verify", label: "Verify" },
    ],
  }
}

function buildIntroductionPageModel() {
  return {
    schemaVersion: 1,
    title: "Introduction",
    summary:
      "Build one branded, accessible UI language across React, Vue, and Svelte. One core, thin framework adapters, and a single theme boundary.",
    topics: [
      {
        id: "what-marwes-is",
        title: "What Marwes is",
        description:
          "Marwes is a framework-agnostic design system: a pure TypeScript core with thin React, Vue, and Svelte adapters built from the same contracts. Every adapter ships static preset CSS and CSS variables, with no CSS-in-JS runtime required.",
      },
      {
        id: "how-its-organized",
        title: "How it's organized",
        description:
          "Each component family ships one recommended public component, purpose wrappers where relevant, and a base primitive as a deliberate escape hatch. The same contract compiles across React, Vue, and Svelte, and generated public API artifacts keep export names and import paths stable.",
      },
      {
        id: "accessible-by-contract",
        title: "Accessible by contract",
        description:
          "Core owns semantic contracts through typed recipes: roles, ARIA state, label wiring, and invalid state. Adapters apply that contract to real DOM elements instead of inventing separate accessibility behavior per framework. Consumers remain responsible for truthful labels and page-level structure.",
      },
      {
        id: "theming-through-one-provider",
        title: "Theming through one provider",
        description:
          "Wrap the app once in the framework provider and pass a theme. Resolved theme values flow through CSS variables, so there is no second stylesheet or CSS-in-JS runtime to reconcile.",
      },
    ],
    links: [
      {
        label: "Get started",
        href: "/docs/get-started/react/",
        description: "Install the CLI and render your first accessible component.",
      },
      {
        label: "Components",
        href: "/docs/components/",
        description: "Browse every component family and its recommended public API.",
      },
      {
        label: "Theming",
        href: "/docs/theming/",
        description: "Wrap once, provide a theme, and brand every Marwes component.",
      },
      {
        label: "Accessibility",
        href: "/docs/accessibility/",
        description: "Understand the accessibility contract shared by every component.",
      },
    ],
    sections: [
      { id: "what-marwes-is", label: "What Marwes is" },
      { id: "how-its-organized", label: "How it's organized" },
      { id: "accessible-by-contract", label: "Accessible by contract" },
      { id: "theming-through-one-provider", label: "Theming" },
      { id: "where-to-go-next", label: "Where to go next" },
    ],
  }
}

function renderIntroductionStaticBody(model) {
  const topics = model.topics
    .map(
      (topic) =>
        `<section id="${topic.id}"><h2>${escapeHtml(topic.title)}</h2><p>${escapeHtml(topic.description)}</p></section>`,
    )
    .join("")
  const links = model.links
    .map(
      (link) =>
        `<li><a href="${escapeHtml(link.href)}"><strong>${escapeHtml(link.label)}</strong></a> — ${escapeHtml(link.description)}</li>`,
    )
    .join("")

  return `<header class="component-static-intro"><p class="component-static-eyebrow">Marwes documentation</p><h1>${escapeHtml(model.title)}</h1><p>${escapeHtml(model.summary)}</p></header>${topics}<section id="where-to-go-next"><h2>Where to go next</h2><p>Pick a framework and render the first component.</p><ul>${links}</ul></section>`
}

function renderGetStartedStaticBody(model) {
  const steps = model.steps
    .map(
      (step, index) =>
        `<section id="${step.id}"><h2>${index + 1}. ${escapeHtml(step.title)}</h2><p>${escapeHtml(step.description)}</p>${
          step.code ? renderCode(step.code.content, step.code.language) : ""
        }</section>`,
    )
    .join("")

  return `<header class="component-static-intro"><p class="component-static-eyebrow">Marwes documentation</p><h1>${escapeHtml(model.title)}</h1><p>${escapeHtml(model.summary)}</p></header>${steps}<aside><strong>Manual fallback:</strong> install <code>${escapeHtml(model.packageName)}</code>, render <code>MarwesProvider</code> once at the application boundary, and import components only from the package root.</aside>`
}

function buildCatalogEntry(family) {
  const exports = Object.values(family.exports).flatMap((entry) => entry.names)
  const recommended = canonicalExports[family.family] ?? ""
  const alsoAvailable = [...new Set(exports)].filter((name) => name !== recommended)
  const searchTerms = [
    family.displayName,
    family.family,
    family.summary,
    ...exports,
    ...exports.map(humanizeIdentifier),
    ...Object.keys(frameworkPackages),
    ...Object.values(frameworkPackages),
    ...family.useWhen,
  ]
    .join(" ")
    .toLowerCase()

  return {
    family: family.family,
    displayName: family.displayName,
    summary: family.summary,
    recommended,
    alsoAvailable,
    searchTerms,
  }
}

function buildCatalogPageModel(families) {
  return {
    schemaVersion: 1,
    title: "Component catalog",
    summary: "Find the right public Marwes component by family, framework, export, or use case.",
    entries: families.map(buildCatalogEntry),
    sections: [{ id: "components", label: "Components" }],
  }
}

function renderCatalogStaticBody(model) {
  const cards = model.entries
    .map(
      (entry) =>
        `<li class="component-static-card"><h2><a href="/docs/components/${entry.family}/">${escapeHtml(entry.displayName)}</a></h2><p>${escapeHtml(entry.summary)}</p><p><strong>Recommended:</strong> ${escapeHtml(entry.recommended || "See family guidance")}</p>${entry.alsoAvailable.length > 0 ? `<p><strong>Also public:</strong> ${escapeHtml(entry.alsoAvailable.join(", "))}</p>` : ""}</li>`,
    )
    .join("")

  return `<header class="component-static-intro"><p class="component-static-eyebrow">Marwes documentation</p><h1>${escapeHtml(model.title)}</h1><p>${escapeHtml(model.summary)}</p></header><section id="components"><label for="component-search">Family, export, or use case</label><input id="component-search" type="search" disabled autocomplete="off" placeholder="Try email field, pagination, or icon button" /><p>${model.entries.length} component families</p><ul class="component-static-grid">${cards}</ul></section>`
}

function buildThemingPageModel() {
  return {
    schemaVersion: 1,
    title: "Theming",
    summary: "Wrap once, provide a theme, and brand every Marwes component.",
    heading: "One provider, one theme boundary",
    description:
      "Marwes components consume resolved theme values from the framework provider and ship static preset CSS. There is no CSS-in-JS runtime in the component packages.",
    code: {
      language: "tsx",
      content:
        'const theme = { color: { primary: "#5558ff" } }\n\n<MarwesProvider theme={theme}>\n  <App />\n</MarwesProvider>',
    },
    calloutTitle: "React consumers",
    calloutBody:
      "Use useTheme() when JavaScript needs resolved values. The styled theme contains CSS variable references whose definitions live below the document root.",
    sections: [{ id: "theming", label: "Theming" }],
  }
}

function renderThemingStaticBody(model) {
  return `<header class="component-static-intro"><p class="component-static-eyebrow">Marwes documentation</p><h1>${escapeHtml(model.title)}</h1><p>${escapeHtml(model.summary)}</p></header><section id="theming"><h2>${escapeHtml(model.heading)}</h2><p>${escapeHtml(model.description)}</p>${renderCode(model.code.content, model.code.language)}</section><aside><strong>${escapeHtml(model.calloutTitle)}:</strong> ${escapeHtml(model.calloutBody)}</aside>`
}

function buildAccessibilityPageModel() {
  return {
    schemaVersion: 1,
    title: "Accessibility",
    summary: "Understand the accessibility contract shared by Marwes components.",
    heading: "Accessible by contract, verified in context",
    description:
      "Marwes supplies component semantics, keyboard behavior, and accessible state wiring. Consumers still own truthful labels, page structure, focus return around overlays, and product-level testing.",
    requirements: [
      "Give every icon-only button an accessible name through the adapter's ariaLabel API.",
      "Preserve visible focus indicators and test keyboard order.",
      "Connect validation messages and descriptions to their fields.",
      "Test real workflows with browser accessibility tooling and assistive technology.",
    ],
    sections: [{ id: "accessibility", label: "Accessibility" }],
  }
}

function renderAccessibilityStaticBody(model) {
  return `<header class="component-static-intro"><p class="component-static-eyebrow">Marwes documentation</p><h1>${escapeHtml(model.title)}</h1><p>${escapeHtml(model.summary)}</p></header><section id="accessibility"><h2>${escapeHtml(model.heading)}</h2><p>${escapeHtml(model.description)}</p>${renderList(model.requirements)}</section>`
}

function buildTroubleshootingPageModel() {
  return {
    schemaVersion: 1,
    title: "Troubleshooting",
    summary:
      "Diagnose missing styles, provider wiring, imports, SSR, fonts, and partial CLI setup.",
    heading: "Common setup failures",
    issues: [
      {
        title: "No styling",
        description:
          "Import from the adapter root. It loads the static preset CSS; do not add a second stylesheet.",
      },
      {
        title: "Provider at the wrong level",
        description: "Render MarwesProvider once above every Marwes component.",
      },
      {
        title: "Wrong import",
        description:
          "Use @marwes-ui/react, @marwes-ui/vue, or @marwes-ui/svelte — never a different adapter or a deep path.",
      },
      {
        title: "Theme values are empty",
        description:
          "CSS references such as var(--mw-*) resolve only inside the provider boundary. Use useTheme() when JavaScript needs resolved values.",
      },
      {
        title: "Light/dark flash during SSR",
        description:
          "Install the framework theme script before hydration and keep the server and client preference policy aligned.",
      },
      {
        title: "Fonts blocked by CSP",
        description:
          "Allow the configured font origin or self-host the selected font. Keep font loading consistent with the CSP.",
      },
      {
        title: "Peer version mismatch",
        description:
          "Check the adapter package peerDependencies and align framework and renderer versions.",
      },
      {
        title: "Partial CLI setup",
        description:
          "Follow the printed provider example, then rerun pnpm dlx @marwes-ui/cli doctor --run-build. An init result labelled manual-action-required uses exit code 2; command failures can also preserve an underlying exit code 2, so read the printed status.",
      },
    ],
    code: { language: "shell", content: "pnpm dlx @marwes-ui/cli doctor --run-build" },
    sections: [{ id: "troubleshooting", label: "Troubleshooting" }],
  }
}

function renderTroubleshootingStaticBody(model) {
  const issues = model.issues
    .map(
      (issue) =>
        `<article><h3>${escapeHtml(issue.title)}</h3><p>${escapeHtml(issue.description)}</p></article>`,
    )
    .join("")
  return `<header class="component-static-intro"><p class="component-static-eyebrow">Marwes documentation</p><h1>${escapeHtml(model.title)}</h1><p>${escapeHtml(model.summary)}</p></header><section id="troubleshooting"><h2>${escapeHtml(model.heading)}</h2><div class="component-static-grid">${issues}</div>${renderCode(model.code.content, model.code.language)}</section>`
}

function buildCompatibilityPageModel() {
  const peerRequirements = {
    react: "React and React DOM 18 or newer",
    vue: "Vue 3.4 or newer",
    svelte: "Svelte 5.20 or newer",
  }
  return {
    schemaVersion: 1,
    title: "Compatibility",
    summary: "Supported frameworks, runtimes, browsers, and package boundaries.",
    heading: "Supported consumer boundary",
    description:
      "Use one public adapter package for React, Vue, or Svelte. The adapter imports the static preset stylesheet and exposes the provider, components, helpers, and public types.",
    requirements: Object.entries(frameworkPackages).map(([framework, packageName]) => ({
      framework,
      packageName,
      peerRequirement: peerRequirements[framework],
      getStartedHref: `/docs/get-started/${framework}/`,
    })),
    runtimeRequirements: [
      "Node.js 20 or newer for installation, builds, and the CLI.",
      "A current evergreen browser with standard CSS custom property support.",
      "The framework and renderer peer versions declared by the selected adapter package.",
      "A known Vite starter layout for automatic provider patching; other build systems use the documented manual provider setup.",
    ],
    footnote:
      "Direct imports from @marwes-ui/core, @marwes-ui/presets, or package-internal paths are not part of the consumer setup.",
    sections: [{ id: "compatibility", label: "Compatibility" }],
  }
}

function renderCompatibilityStaticBody(model) {
  const rows = model.requirements
    .map(
      (requirement) =>
        `<tr><td>${titleCase(requirement.framework)}</td><td><code>${escapeHtml(requirement.packageName)}</code></td><td>${escapeHtml(requirement.peerRequirement)}</td><td><a href="${escapeHtml(requirement.getStartedHref)}">Get started</a></td></tr>`,
    )
    .join("")
  return `<header class="component-static-intro"><p class="component-static-eyebrow">Marwes documentation</p><h1>${escapeHtml(model.title)}</h1><p>${escapeHtml(model.summary)}</p></header><section id="compatibility"><h2>${escapeHtml(model.heading)}</h2><p>${escapeHtml(model.description)}</p><table><thead><tr><th>Framework</th><th>Package</th><th>Peer requirement</th><th>Setup</th></tr></thead><tbody>${rows}</tbody></table><h3>Runtime requirements</h3>${renderList(model.runtimeRequirements)}<p>${escapeHtml(model.footnote)}</p></section>`
}

function buildAiPageModel() {
  return {
    schemaVersion: 1,
    title: "AI and agent usage",
    summary: "Give coding agents canonical, machine-readable Marwes documentation.",
    heading: "Machine-readable entrypoints",
    description:
      "Start agents at /llms.txt, then choose the framework guide and public API inventory.",
    entrypoint: "/llms.txt",
    resources: [
      "/ai/react.md",
      "/ai/vue.md",
      "/ai/svelte.md",
      "/ai/index.json",
      "/ai/v1/public-api.json",
      "/ai/v1/component-registry.json",
    ],
    footnote:
      "Agents should import real Marwes components from the chosen adapter root. They must not recreate Marwes as local mw-* classes.",
    sections: [{ id: "ai", label: "AI and agents" }],
  }
}

function renderAiStaticBody(model) {
  return `<header class="component-static-intro"><p class="component-static-eyebrow">Marwes documentation</p><h1>${escapeHtml(model.title)}</h1><p>${escapeHtml(model.summary)}</p></header><section id="ai"><h2>${escapeHtml(model.heading)}</h2><p>Start agents at <a href="${escapeHtml(model.entrypoint)}"><code>${escapeHtml(model.entrypoint)}</code></a>, then choose the framework guide and public API inventory.</p>${renderList(model.resources)}<p>${escapeHtml(model.footnote)}</p></section>`
}

function buildContributingPageModel() {
  return {
    schemaVersion: 1,
    title: "Contributing",
    summary: "Contribute to Marwes without confusing internal atoms with its public consumer API.",
    heading: "Preserve the consumer contract",
    description:
      "Registry metadata describes implementation evidence. The public API artifact owns consumer export names and import paths. Raw atoms may exist internally but must not appear in consumer examples.",
    secondaryDescription:
      "Before opening a change, run the repository consumer docs check and the focused framework validation.",
    code: { language: "shell", content: "pnpm docs:consumer-check" },
    externalLink: {
      href: "https://github.com/niklas-westman/marwes/blob/main/CONTRIBUTING.md",
      label: "Read the repository contribution guide",
    },
    sections: [{ id: "contributing", label: "Contributing" }],
  }
}

function renderContributingStaticBody(model) {
  return `<header class="component-static-intro"><p class="component-static-eyebrow">Marwes documentation</p><h1>${escapeHtml(model.title)}</h1><p>${escapeHtml(model.summary)}</p></header><section id="contributing"><h2>${escapeHtml(model.heading)}</h2><p>${escapeHtml(model.description)}</p><p>${escapeHtml(model.secondaryDescription)}</p>${renderCode(model.code.content, model.code.language)}<p><a href="${escapeHtml(model.externalLink.href)}">${escapeHtml(model.externalLink.label)}</a></p></section>`
}

function renderIntegration(integration) {
  const framework = integration === "next" ? "react" : integration === "nuxt" ? "vue" : "svelte"
  const notes = {
    next: "Place the provider in a client boundary near the application root. Emit the Marwes theme script before hydration when the theme follows system or stored preference.",
    nuxt: "Register a client-safe application provider and keep theme preference initialization consistent between the rendered HTML and hydration.",
    sveltekit:
      "Place the provider in the root layout. Add the Marwes theme script to the document head before hydration to avoid a light or dark mode flash.",
  }
  const examples = {
    next: `// app/providers.tsx
"use client"

import { MarwesProvider } from "@marwes-ui/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MarwesProvider
      defaultPreference="system"
      storageKey="marwes-theme"
      target="html"
      attribute="class"
      variableStrategy="style-tag"
    >
      {children}
    </MarwesProvider>
  )
}

// app/layout.tsx
import { MarwesThemeScript, MarwesThemeStyle } from "@marwes-ui/react"
import { Providers } from "./providers"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <MarwesThemeStyle target="html" attribute="class" />
        <MarwesThemeScript
          storageKey="marwes-theme"
          defaultPreference="system"
          target="html"
          attribute="class"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}`,
    nuxt: `<script setup lang="ts">
import {
  MarwesProvider,
  createMarwesThemeScript,
  createMarwesThemeStyle,
} from "@marwes-ui/vue"

useHead({
  htmlAttrs: { "data-allow-mismatch": "class" },
  style: [{ innerHTML: createMarwesThemeStyle({ target: "html", attribute: "class" }) }],
  script: [{
    innerHTML: createMarwesThemeScript({
      storageKey: "marwes-theme",
      defaultPreference: "system",
      target: "html",
      attribute: "class",
    }),
  }],
})
</script>

<template>
  <MarwesProvider
    default-preference="system"
    storage-key="marwes-theme"
    target="html"
    attribute="class"
    variable-strategy="style-tag"
  >
    <NuxtPage />
  </MarwesProvider>
</template>`,
    sveltekit: `<script lang="ts">
  import {
    MarwesProvider,
    createMarwesThemeScript,
    createMarwesThemeStyle,
  } from "@marwes-ui/svelte"

  let { children } = $props()
  const themeHead = \`<style>\${createMarwesThemeStyle({ target: "html", attribute: "class" })}</style><script>\${createMarwesThemeScript({ storageKey: "marwes-theme", defaultPreference: "system", target: "html", attribute: "class" })}<\\/script>\`
</script>

<svelte:head>{@html themeHead}</svelte:head>
<MarwesProvider
  defaultPreference="system"
  storageKey="marwes-theme"
  target="html"
  attribute="class"
  variableStrategy="style-tag"
>
  {@render children()}
</MarwesProvider>`,
  }
  const language = integration === "next" ? "tsx" : integration === "nuxt" ? "vue" : "svelte"
  return `<section><h2>${titleCase(integration)} setup</h2><p>${notes[integration]}</p><ol><li>Complete the <a href="/docs/get-started/${framework}/">${titleCase(framework)} setup</a>.</li><li>Render one provider at the application boundary.</li><li>Keep server and browser theme initialization aligned.</li><li>Run <code>pnpm dlx @marwes-ui/cli doctor --run-build</code>.</li></ol>${renderCode(examples[integration], language)}<aside><strong>CSP:</strong> pass the request nonce to generated style and script entries when your policy requires one. Never concatenate untrusted values into generated head markup.</aside></section>`
}

function renderFamilyBody(family) {
  const imports = Object.entries(family.exports)
    .map(([framework, entry]) => {
      if (entry.names.length === 0) {
        return `<article><h3>${titleCase(framework)}</h3><p>No public component is currently registered for this family in <code>${entry.importPath}</code>.</p></article>`
      }
      return `<article><h3>${titleCase(framework)}</h3>${renderCode(`import { ${entry.names.join(", ")} } from "${entry.importPath}"`, framework === "react" ? "tsx" : framework)}</article>`
    })
    .join("")
  const propTypes = Object.entries(family.exports)
    .map(
      ([framework, entry]) =>
        `<li><strong>${titleCase(framework)}:</strong> ${entry.types.length > 0 ? entry.types.map((name) => `<code>${escapeHtml(name)}</code>`).join(", ") : "No family-specific public prop type is currently registered."}</li>`,
    )
    .join("")
  const examples = Object.entries(family.examples)
    .map(
      ([framework, code]) =>
        `<article><h3>${titleCase(framework)}</h3>${renderCode(code, framework === "react" ? "tsx" : framework)}</article>`,
    )
    .join("")
  const exampleSection = examples
    ? `<section><h2>Verified minimal examples</h2><p>These examples are rendered from the same fixture files used by the repository checks.</p><div class="docs-stack">${examples}</div></section>`
    : "<section><h2>Minimal example</h2><p>This family does not yet have a canonical compiled fixture. Use the public import above and follow the linked Storybook contract; this page intentionally does not invent required props.</p></section>"
  const storybooks = Object.entries(storybookOrigins)
    .map(
      ([framework, origin]) => `<li><a href="${origin}">${titleCase(framework)} Storybook</a></li>`,
    )
    .join("")
  const packageLinks = Object.entries(frameworkPackages)
    .map(
      ([framework, packageName]) =>
        `<li><a href="https://www.npmjs.com/package/${packageName}">${titleCase(framework)} package on npm</a></li>`,
    )
    .join("")

  return `<section><h2>What this family solves</h2><p>${escapeHtml(family.summary)}</p></section><div class="docs-columns"><section><h2>Use when</h2>${renderList(family.useWhen)}</section><section><h2>Avoid when</h2>${renderList(family.avoidWhen)}</section></div><section><h2>Public imports</h2><p>Import only from the adapter root. Field- and purpose-level exports are the recommended consumer API.</p><div class="docs-stack">${imports}</div><h3>Public prop types</h3><ul>${propTypes}</ul><p>The complete typed inventory is published at <a href="/ai/v1/public-api.json"><code>/ai/v1/public-api.json</code></a>.</p></section>${exampleSection}<section><h2>Accessibility requirements</h2>${renderList(family.accessibility)}</section><section><h2>Theming</h2><p>${escapeHtml(family.theming)}</p></section><section><h2>Reference links</h2><ul>${storybooks}<li><a href="https://github.com/niklas-westman/marwes/blob/main/${family.sourcePath}">Source and registry evidence</a></li>${packageLinks}<li><a href="https://github.com/niklas-westman/marwes/issues/new">Report an issue</a></li></ul></section>`
}

function renderDocsNavigationLinks(currentPath) {
  const link = (label, href) =>
    `<a href="${href}"${href === currentPath ? ' aria-current="page"' : ""}>${escapeHtml(label)}</a>`
  const guides = docsNavigation.documentationLinks
    .map(({ label, path }) => link(label, path))
    .join("")
  const groups = docsNavigation.componentGroups
    .map(
      ({ label, items }) =>
        `<div class="component-static-nav-group"><p>${escapeHtml(label)}</p>${items.map((item) => link(item, `/docs/components/${item.toLowerCase().replaceAll(" ", "-")}/`)).join("")}</div>`,
    )
    .join("")
  return `<div class="component-static-nav-group"><p>Documentation</p>${guides}</div>${groups}`
}

function renderNavigation(currentPath) {
  if (!currentPath) {
    return `<header class="docs-header"><a class="docs-brand" href="/">Marwes UI</a><nav aria-label="Documentation"><a href="/docs/get-started/react/">Get started</a><a href="/docs/components/">Components</a><a href="/docs/theming/">Theming</a><a href="/docs/accessibility/">Accessibility</a><a href="/docs/troubleshooting/">Troubleshoot</a></nav></header>`
  }
  const links = renderDocsNavigationLinks(currentPath)
  return `<header class="docs-header" data-site-header data-docs-header><a class="docs-brand" href="/" aria-label="Marwes homepage"><svg width="98" height="20" viewBox="0 0 98 20" fill="none" role="img" aria-label="Marwes">${logoPaths}</svg></a><div class="component-static-header-right"><nav aria-label="Main"><a href="/">Home</a><a href="/docs/introduction/" aria-current="page">Docs</a></nav><span class="component-static-theme" aria-hidden="true"><span>☀</span><span>☾</span></span></div></header><details class="component-static-browse"><summary>Browse docs</summary><nav aria-label="Browse documentation">${links}</nav></details>`
}

function serializeEmbeddedJson(value) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029")
}

const staticDocsCss = `
    #root[data-static-docs] { min-height: 100vh; background: #fff; color: #141414; font-family: "Instrument Sans", Inter, system-ui, sans-serif; }
    #root[data-static-docs] *, #root[data-static-docs] *::before, #root[data-static-docs] *::after { box-sizing: border-box; margin: 0; }
    #root[data-static-docs] a { color: #2527ca; text-underline-offset: .2em; }
    #root[data-static-docs] .component-static-skip { position: fixed; z-index: 100; top: .5rem; left: .5rem; padding: .75rem 1rem; border-radius: .5rem; background: #fff; transform: translateY(calc(-100% - 1rem)); }
    #root[data-static-docs] .component-static-skip:focus { transform: translateY(0); }
    #root[data-static-docs] > header { position: sticky; z-index: 20; top: 0; display: flex; align-items: center; justify-content: space-between; height: 4.25rem; max-width: 90rem; margin: 0 auto; padding: 1rem 5rem; background: #fff; }
    #root[data-static-docs] .component-static-header-right { display: flex; align-items: center; gap: 1.5rem; }
    #root[data-static-docs] .docs-brand { display: flex; color: inherit; }
    #root[data-static-docs] > header nav { display: flex; gap: 1.5rem; }
    #root[data-static-docs] > header nav a { color: #545454; font-size: .875rem; font-weight: 500; text-decoration: none; }
    #root[data-static-docs] > header nav a[aria-current="page"] { color: inherit; font-weight: 700; }
    #root[data-static-docs] .component-static-theme { display: flex; align-items: center; gap: .125rem; height: 2.125rem; padding: .1875rem; border-radius: .375rem; background: #f8f8f8; }
    #root[data-static-docs] .component-static-theme span { display: grid; place-items: center; width: 1.75rem; height: 1.75rem; font-size: .875rem; }
    #root[data-static-docs] .component-static-theme span:first-child { background: #141414; color: #fff; border-radius: .25rem; }
    #root[data-static-docs] .component-static-layout { display: grid; grid-template-columns: 15.5rem minmax(0, 1fr) 11.5rem; width: 100%; max-width: 90rem; margin: 1rem auto; }
    #root[data-static-docs] .component-static-left { padding: 1rem 1rem 1rem 5rem; }
    #root[data-static-docs] .component-static-left nav { position: sticky; top: 6rem; max-height: calc(100vh - 6rem); overflow-y: auto; }
    #root[data-static-docs] .component-static-nav-group { margin-bottom: .75rem; }
    #root[data-static-docs] .component-static-nav-group p { font-size: .75rem; font-weight: 600; margin-bottom: .125rem; }
    #root[data-static-docs] .component-static-nav-group a { display: flex; align-items: center; min-height: 2rem; padding: .25rem .5rem; font-size: .75rem; line-height: 1.35; text-decoration: none; color: #545454; border-left: 2px solid transparent; }
    #root[data-static-docs] .component-static-nav-group a[aria-current] { border-color: #2f31fc; color: #1b1d97; background: #eeeeff; }
    #root[data-static-docs] .component-static-browse { display: none; border-bottom: 1px solid #d8d8d8; background: #f5f5f5; }
    #root[data-static-docs] .component-static-browse summary { padding: .75rem 1.5rem; font-size: .8125rem; line-height: 17px; font-weight: 600; cursor: pointer; }
    #root[data-static-docs] .component-static-browse nav { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: 1rem; padding: 1rem 1.5rem; }
    #root[data-static-docs] main { min-width: 0; background: #f8f8f8; border-radius: 2rem; padding: clamp(1rem, 3vw, 2rem); }
    #root[data-static-docs] .component-static-content { width: 100%; max-width: 62rem; margin: 0 auto; }
    #root[data-static-docs] .component-static-footer { max-width: 90rem; margin: 4rem auto 0; padding: 0 5rem 1.5rem; font-size: .75rem; color: #545454; }
    #root[data-static-docs] .component-static-footer > div { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-top: 1.5rem; }
    #root[data-static-docs] .component-static-footer a { color: inherit; }
    @media (max-width: 639.98px) { #root[data-static-docs] .component-static-footer { padding: 0 1.25rem 1.5rem; } }
    html.dark #root[data-static-docs] .component-static-footer { color: #c4c4c4; }
    html.dark #root[data-static-docs] .component-static-footer > div { border-color: #333; }
    #root[data-static-docs] .component-static-compact { display: none; margin-top: 1.5rem; }
    #root[data-static-docs] .component-static-compact > p { margin-bottom: .5rem; font-size: .8125rem; font-weight: 700; }
    #root[data-static-docs] .component-static-compact > div { display: grid; gap: .25rem; }
    #root[data-static-docs] .component-static-compact a { padding: .25rem 0 .25rem .5rem; border-left: 2px solid #d8d8d8; color: #545454; font-size: .6875rem; line-height: 1.35; text-decoration: none; }
    #root[data-static-docs] .component-static-toc { padding: 1rem; font-size: .6875rem; }
    #root[data-static-docs] .component-static-toc nav { position: sticky; top: 6rem; display: grid; gap: .5rem; }
    #root[data-static-docs] .component-static-intro { padding-bottom: 2.5rem; }
    #root[data-static-docs] .component-static-eyebrow { margin-bottom: .5rem; color: #1b1d97; font-size: .6875rem; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; }
    #root[data-static-docs] h1 { font-size: clamp(2.25rem, 5vw, 3.5rem); font-weight: 700; letter-spacing: -.045em; line-height: 1; }
    #root[data-static-docs] .component-static-intro > p:not(.component-static-eyebrow) { max-width: 48rem; margin-top: .75rem; color: #545454; font-size: 1rem; line-height: 1.65; }
    #root[data-static-docs] section { margin-top: 2.5rem; scroll-margin-top: 5.8125rem; }
    #root[data-static-docs] .component-static-intents, #root[data-static-docs] .component-static-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .75rem; }
    #root[data-static-docs] article { min-width: 0; padding: 1rem; border: 1px solid #d8d8d8; border-radius: .75rem; }
    #root[data-static-docs] pre { max-height: 24rem; overflow: auto; padding: 1rem; border-radius: .5rem; background: #f5f5f5; }
    #root[data-static-docs] code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    html.dark #root[data-static-docs] { background: #0f0f0f; color: #f7f7f7; color-scheme: dark; }
    html.dark #root[data-static-docs] a { color: #ababfd; }
    html.dark #root[data-static-docs] > header, html.dark #root[data-static-docs] .component-static-toc { border-color: #333; }
    html.dark #root[data-static-docs] article { border-color: #454545; background: #292929; }
    html.dark #root[data-static-docs] pre { background: #191919; }
    html.dark #root[data-static-docs] > header { background: #0f0f0f; }
    html.dark #root[data-static-docs] main, html.dark #root[data-static-docs] .component-static-browse, html.dark #root[data-static-docs] .component-static-compact, html.dark #root[data-static-docs] .component-static-theme { background: #191919; border-color: #333; }
    html.dark #root[data-static-docs] .component-static-theme span:first-child { background: transparent; color: inherit; }
    html.dark #root[data-static-docs] .component-static-theme span:last-child { background: #f7f7f7; color: #141414; border-radius: .25rem; }
    html.dark #root[data-static-docs] .component-static-intro > p:not(.component-static-eyebrow), html.dark #root[data-static-docs] .component-static-compact a, html.dark #root[data-static-docs] .component-static-nav-group a, html.dark #root[data-static-docs] > header nav a { color: #c4c4c4; }
    @media (max-width: 1199.98px) { #root[data-static-docs] .component-static-layout { display: block; padding: 0 1rem; } #root[data-static-docs] .component-static-toc, #root[data-static-docs] .component-static-left { display: none; } #root[data-static-docs] .component-static-browse, #root[data-static-docs] .component-static-compact { display: block; } }
    @media (max-width: 639.98px) { #root[data-static-docs] > header { padding: 1rem 1.25rem; } #root[data-static-docs] .component-static-header-right { gap: 1rem; } #root[data-static-docs] > header nav a:first-child { display: none; } #root[data-static-docs] .component-static-intents, #root[data-static-docs] .component-static-grid { grid-template-columns: 1fr; } }
  `

function renderStaticDocsPage({ route, model, modelElementId, mainHtml }) {
  const canonical = `https://marwes.io${route.path}`
  const onThisPage = model.sections
    .map(({ id, label }) => `<a href="#${id}">${escapeHtml(label)}</a>`)
    .join("")
  const inlineNavigation = `<nav class="component-static-compact" aria-label="On this page (compact)"><p>On this page</p><div>${onThisPage}</div></nav>`
  const contentHtml = mainHtml.replace("</header>", `${inlineNavigation}</header>`)

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(route.title)} — Marwes UI</title>
    <meta name="description" content="${escapeHtml(route.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/src/docs/docs-static.css" />
    <script>(()=>{let mode="light";try{mode=localStorage.getItem("marwes-site-theme")==="dark"?"dark":"light"}catch{}document.documentElement.dataset.marwesMode=mode;document.documentElement.classList.add(mode);document.documentElement.style.colorScheme=mode})()</script>
    <style>${staticDocsCss}</style>
  </head>
  <body style="margin:0">
    <div id="root" data-static-docs>
      <a class="component-static-skip" href="#main-content">Skip to main content</a>
      ${renderNavigation(route.path)}
      <div class="component-static-layout">
        <aside class="component-static-left" aria-label="Documentation navigation"><nav>${renderDocsNavigationLinks(route.path)}</nav></aside>
        <main id="main-content"><div class="component-static-content">${contentHtml}</div></main>
        <aside class="component-static-toc"><nav aria-label="On this page"><strong>On this page</strong>${onThisPage}</nav></aside>
      </div>
      <footer class="component-static-footer"><div><span>Marwes — /mɑːr.wɛz/</span><a href="/docs/components/">Browse all components</a></div></footer>
    </div>
    <script id="${modelElementId}" type="application/json">${serializeEmbeddedJson(model)}</script>
    <script type="module" src="/src/docs/components/docs-page-main.tsx"></script>
  </body>
</html>
`
}

function renderComponentHtml(route, model) {
  return renderStaticDocsPage({
    route,
    model,
    modelElementId: "component-docs-model",
    mainHtml: renderComponentStaticBody(model),
  })
}

function renderGetStartedHtml(route, model) {
  return renderStaticDocsPage({
    route,
    model,
    modelElementId: "get-started-model",
    mainHtml: renderGetStartedStaticBody(model),
  })
}

function renderIntroductionHtml(route, model) {
  return renderStaticDocsPage({
    route,
    model,
    modelElementId: "introduction-model",
    mainHtml: renderIntroductionStaticBody(model),
  })
}

function renderCatalogHtml(route, model) {
  return renderStaticDocsPage({
    route,
    model,
    modelElementId: "catalog-model",
    mainHtml: renderCatalogStaticBody(model),
  })
}

function renderThemingHtml(route, model) {
  return renderStaticDocsPage({
    route,
    model,
    modelElementId: "theming-model",
    mainHtml: renderThemingStaticBody(model),
  })
}

function renderAccessibilityHtml(route, model) {
  return renderStaticDocsPage({
    route,
    model,
    modelElementId: "accessibility-model",
    mainHtml: renderAccessibilityStaticBody(model),
  })
}

function renderTroubleshootingHtml(route, model) {
  return renderStaticDocsPage({
    route,
    model,
    modelElementId: "troubleshooting-model",
    mainHtml: renderTroubleshootingStaticBody(model),
  })
}

function renderCompatibilityHtml(route, model) {
  return renderStaticDocsPage({
    route,
    model,
    modelElementId: "compatibility-model",
    mainHtml: renderCompatibilityStaticBody(model),
  })
}

function renderAiHtml(route, model) {
  return renderStaticDocsPage({
    route,
    model,
    modelElementId: "ai-model",
    mainHtml: renderAiStaticBody(model),
  })
}

function renderContributingHtml(route, model) {
  return renderStaticDocsPage({
    route,
    model,
    modelElementId: "contributing-model",
    mainHtml: renderContributingStaticBody(model),
  })
}

const singlePageRenderers = {
  introduction: renderIntroductionHtml,
  catalog: renderCatalogHtml,
  theming: renderThemingHtml,
  accessibility: renderAccessibilityHtml,
  troubleshooting: renderTroubleshootingHtml,
  compatibility: renderCompatibilityHtml,
  ai: renderAiHtml,
  contributing: renderContributingHtml,
}

function renderHtml(route, componentPageModels, getStartedPageModels, singlePageModels) {
  const componentModel = route.family ? componentPageModels.get(route.family.family) : undefined
  if (componentModel) return renderComponentHtml(route, componentModel)

  const singlePageEntry = Object.entries(singlePageRoutePaths).find(
    ([, path]) => path === route.path,
  )
  if (singlePageEntry) {
    const [key] = singlePageEntry
    return singlePageRenderers[key](route, singlePageModels[key])
  }

  const getStartedMatch = route.path.match(/^\/docs\/get-started\/([a-z]+)\/$/)
  const getStartedModel = getStartedMatch ? getStartedPageModels.get(getStartedMatch[1]) : undefined
  if (getStartedModel) return renderGetStartedHtml(route, getStartedModel)

  const canonical = `https://marwes.io${route.path}`
  const body = route.kind === "family" ? renderFamilyBody(route.family) : getStaticBody(route)
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(route.title)} — Marwes UI</title>
    <meta name="description" content="${escapeHtml(route.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/src/docs/docs.css" />
  </head>
  <body>
    ${renderNavigation()}
    <main class="docs-shell">
      <nav class="docs-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/docs/components/">Docs</a></nav>
      <header class="docs-intro"><p class="docs-eyebrow">Marwes documentation</p><h1>${escapeHtml(route.title)}</h1><p>${escapeHtml(route.description)}</p></header>
      ${body}
    </main>
    <footer class="docs-footer"><p>Build one branded, accessible UI language across React, Vue, and Svelte.</p><a href="https://github.com/niklas-westman/marwes">GitHub</a></footer>
    <script type="module" src="/src/docs/docs-main.ts"></script>
  </body>
</html>
`
}

async function listGeneratedHtmlFiles(directory) {
  try {
    const entries = await readdir(directory)
    const files = []
    for (const entry of entries) {
      const absolute = path.join(directory, entry)
      const info = await stat(absolute)
      if (info.isDirectory()) files.push(...(await listGeneratedHtmlFiles(absolute)))
      else if (entry === "index.html") files.push(absolute)
    }
    return files
  } catch (error) {
    if (error?.code === "ENOENT") return []
    throw error
  }
}

async function assertOrWrite(filePath, content, failures) {
  if (checkMode) {
    let current = null
    try {
      current = await readFile(filePath, "utf8")
    } catch (error) {
      if (error?.code !== "ENOENT") throw error
    }
    if (current !== content) failures.push(path.relative(repoRoot, filePath))
    return
  }
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, content)
}

const registry = await readJson(registryPath)
const publicApi = await readJson(publicApiPath, true)
const publicExports = normalizePublicApi(publicApi)
getStartedExamples = Object.fromEntries(
  await Promise.all(
    Object.keys(frameworkPackages).map(async (framework) => {
      const extension = framework === "react" ? "tsx" : framework
      const filePath = path.join(appRoot, "src/fixtures", `get-started.${extension}`)
      return [framework, (await readFile(filePath, "utf8")).trim()]
    }),
  ),
)
const families = registry.families.map(({ family, meta, readmePath }) => ({
  accessibility: getAccessibility(family),
  avoidWhen: (meta?.usage?.avoidWhen ?? []).map(consumerizeText),
  displayName: meta?.displayName ?? titleCase(family),
  exports: resolveFamilyExports(family, publicExports, publicApi !== null),
  examples: {},
  family,
  manualReviewRequired: (meta?.axe?.manualReviewRequired ?? []).map(consumerizeText),
  summary: consumerizeText(
    meta?.summary ?? `${titleCase(family)} components for Marwes applications.`,
  ),
  sourcePath: readmePath,
  theming: getThemingCopy(family),
  useWhen: (meta?.usage?.useWhen ?? []).map(consumerizeText),
}))

for (const family of families) {
  const fixtureName = fixtureNamesByFamily[family.family]
  if (!fixtureName) {
    throw new Error(`Missing canonical fixture mapping for registry family: ${family.family}`)
  }
  for (const framework of Object.keys(frameworkPackages)) {
    const extension = framework === "react" ? "tsx" : framework
    const fixturePath = path.join(appRoot, "src/fixtures/snippets", `${fixtureName}.${extension}`)
    try {
      family.examples[framework] = (await readFile(fixturePath, "utf8")).trim()
    } catch (error) {
      if (error?.code === "ENOENT") {
        throw new Error(
          `Missing canonical ${framework} fixture for registry family ${family.family}: ${path.relative(repoRoot, fixturePath)}`,
        )
      }
      throw error
    }
    if (family.examples[framework].length === 0) {
      throw new Error(
        `Canonical ${framework} fixture is empty for registry family ${family.family}: ${path.relative(repoRoot, fixturePath)}`,
      )
    }
  }
}

const componentPageModels = new Map(
  migratedComponentFamilies.map((familyName) => {
    const family = families.find((candidate) => candidate.family === familyName)
    if (!family) throw new Error(`Component registry is missing the ${familyName} family`)
    return [familyName, buildComponentPageModel(family)]
  }),
)

const getStartedPageModels = new Map(
  Object.keys(frameworkPackages).map((framework) => [
    framework,
    buildGetStartedPageModel(framework),
  ]),
)
const getStartedPageModelPaths = Object.fromEntries(
  Object.keys(frameworkPackages).map((framework) => [
    framework,
    path.join(appRoot, "src/docs/generated", `get-started-${framework}-page.json`),
  ]),
)

const singlePageModels = {
  introduction: buildIntroductionPageModel(),
  catalog: buildCatalogPageModel(families),
  theming: buildThemingPageModel(),
  accessibility: buildAccessibilityPageModel(),
  troubleshooting: buildTroubleshootingPageModel(),
  compatibility: buildCompatibilityPageModel(),
  ai: buildAiPageModel(),
  contributing: buildContributingPageModel(),
}
const singlePageModelPaths = {
  introduction: path.join(appRoot, "src/docs/generated", "introduction-page.json"),
  catalog: path.join(appRoot, "src/docs/generated", "catalog-page.json"),
  theming: path.join(appRoot, "src/docs/generated", "theming-page.json"),
  accessibility: path.join(appRoot, "src/docs/generated", "accessibility-page.json"),
  troubleshooting: path.join(appRoot, "src/docs/generated", "troubleshooting-page.json"),
  compatibility: path.join(appRoot, "src/docs/generated", "compatibility-page.json"),
  ai: path.join(appRoot, "src/docs/generated", "ai-page.json"),
  contributing: path.join(appRoot, "src/docs/generated", "contributing-page.json"),
}
const singlePageRoutePaths = {
  introduction: "/docs/introduction/",
  catalog: "/docs/components/",
  theming: "/docs/theming/",
  accessibility: "/docs/accessibility/",
  troubleshooting: "/docs/troubleshooting/",
  compatibility: "/docs/compatibility/",
  ai: "/docs/ai/",
  contributing: "/docs/contributing/",
}

const routes = [
  ...staticRoutes.map(([routePath, title, description]) => ({
    description,
    kind: "guide",
    path: routePath,
    title,
  })),
  ...families.map((family) => ({
    description: `${family.summary} Public imports, usage guidance, accessibility requirements, and framework references.`,
    family,
    kind: "family",
    path: `/docs/components/${family.family}/`,
    title: family.displayName,
  })),
].map((route) => (route.path === "/docs/components/" ? { ...route, families } : route))

const manifest = {
  schemaVersion: 1,
  familyCount: families.length,
  routes: routes.map(({ family, families: routeFamilies, ...route }) => {
    const getStartedMatch = route.path.match(/^\/docs\/get-started\/([a-z]+)\/$/)
    return {
      ...route,
      ...(family
        ? {
            family: family.family,
            ...(componentPageModels.has(family.family) ? { renderer: "component-docs" } : {}),
          }
        : {}),
      ...(getStartedMatch && getStartedPageModels.has(getStartedMatch[1])
        ? { renderer: "get-started" }
        : {}),
      ...(() => {
        const singlePageEntry = Object.entries(singlePageRoutePaths).find(
          ([, path]) => path === route.path,
        )
        return singlePageEntry ? { renderer: singlePageEntry[0] } : {}
      })(),
      ...(routeFamilies ? { familyCount: routeFamilies.length } : {}),
    }
  }),
}
const failures = []
await assertOrWrite(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, failures)
for (const [family, model] of componentPageModels) {
  await assertOrWrite(
    componentPageModelPaths[family],
    `${JSON.stringify(model, null, 2)}\n`,
    failures,
  )
}
for (const [framework, model] of getStartedPageModels) {
  await assertOrWrite(
    getStartedPageModelPaths[framework],
    `${JSON.stringify(model, null, 2)}\n`,
    failures,
  )
}
for (const [key, model] of Object.entries(singlePageModels)) {
  const filePath = singlePageModelPaths[key]
  const content = execFileSync(
    path.join(repoRoot, "node_modules/.bin/biome"),
    ["format", "--stdin-file-path", filePath],
    { input: `${JSON.stringify(model, null, 2)}\n`, encoding: "utf8", cwd: repoRoot },
  )
  await assertOrWrite(filePath, content, failures)
}

const expectedHtmlPaths = new Set()
for (const route of routes) {
  const relative = route.path.replace(/^\//, "")
  const filePath = path.join(appRoot, relative, "index.html")
  expectedHtmlPaths.add(filePath)
  await assertOrWrite(
    filePath,
    renderHtml(route, componentPageModels, getStartedPageModels, singlePageModels),
    failures,
  )
}

for (const filePath of await listGeneratedHtmlFiles(path.join(appRoot, "docs"))) {
  if (!expectedHtmlPaths.has(filePath)) failures.push(path.relative(repoRoot, filePath))
}

if (failures.length > 0) {
  console.error(
    `Dashboard docs are stale:\n${[...new Set(failures)]
      .sort()
      .map((item) => `- ${item}`)
      .join("\n")}`,
  )
  console.error("Run: node scripts/generate-dashboard-docs.mjs")
  process.exit(1)
}

console.log(
  `${checkMode ? "Checked" : "Generated"} ${routes.length} documentation routes (${families.length} component families).`,
)
