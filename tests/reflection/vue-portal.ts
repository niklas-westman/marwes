import { IconName } from "@marwes-ui/core"
import type { ContextMenuEntry } from "@marwes-ui/core"
import {
  Accordion,
  Badge,
  BadgeVariant,
  Card,
  CheckboxField,
  ContextMenu,
  DestructiveButton,
  Dialog,
  Divider,
  InputField,
  PrimaryButton,
  Radio,
  RadioGroupField,
  SecondaryButton,
  SegmentedControl,
  Slider,
  SwitchField,
  Text,
  TextButton,
} from "@marwes-ui/vue"
import { MarwesProvider, ThemeMode } from "@marwes-ui/vue"
import type { ReflectionPortalMountInput } from "reflection-check"
import { type VNode, createApp, h, nextTick } from "vue"

type PortalCase = {
  render: () => VNode
}

const accordionBody =
  "Accordion content goes here. This is the expandable section that provides more detail."
const cardBody =
  "Card description text goes here. This provides more context about the card content."
const dialogDescription =
  "Describe the dialog purpose. Provide enough context for the user to understand the action or information being presented."
const radioGroupOptions = [
  { value: "one", label: "Label" },
  { value: "two", label: "Label" },
  { value: "three", label: "Label" },
]
const segmentedControlItems = [
  { value: "one", label: "Label" },
  { value: "two", label: "Label" },
  { value: "three", label: "Label" },
]

const contextMenuItems: ContextMenuEntry[] = [
  { value: "edit", label: "Edit", icon: IconName.Edit },
  { value: "preview", label: "Preview", icon: IconName.Eye },
  { value: "download", label: "Download", icon: IconName.Download },
  { kind: "divider" },
  { value: "bookmark", label: "Bookmark", icon: IconName.Bookmark },
  { value: "report", label: "Report", icon: IconName.Flag },
  { kind: "divider" },
  { value: "delete", label: "Delete", icon: IconName.Trash },
]

function renderCheckboxStates() {
  return h("div", { style: { display: "flex", alignItems: "center", gap: "16px" } }, [
    h(CheckboxField, {
      id: "reflection-checkbox-unchecked",
      label: "Label",
      checkbox: {},
    }),
    h(CheckboxField, {
      id: "reflection-checkbox-checked",
      label: "Label",
      checkbox: { checked: true },
    }),
    h(CheckboxField, {
      id: "reflection-checkbox-mixed",
      label: "Label",
      checkbox: { indeterminate: true },
    }),
  ])
}

function renderRadioStates() {
  return h("div", { style: { display: "flex", alignItems: "center", gap: "24px" } }, [
    h(
      "label",
      { style: { display: "inline-flex", height: "32px", alignItems: "center", gap: "8px" } },
      [
        h(Radio, { name: "reflection-radio-states", checked: true, ariaLabel: "Label" }),
        h(Text, { variant: "label" }, { default: () => "Label" }),
      ],
    ),
    h(
      "label",
      { style: { display: "inline-flex", height: "32px", alignItems: "center", gap: "8px" } },
      [
        h(Radio, { name: "reflection-radio-states", ariaLabel: "Label" }),
        h(Text, { variant: "label" }, { default: () => "Label" }),
      ],
    ),
  ])
}

function renderRadioGroup() {
  return h(RadioGroupField, {
    name: "reflection-radio-group",
    label: "Group label",
    description: "Select one option",
    defaultValue: "one",
    options: radioGroupOptions,
  })
}

function renderSwitchStates() {
  return h("div", { style: { display: "flex", alignItems: "center", gap: "24px" } }, [
    h(SwitchField, { label: "Label", switch: { checked: true } }),
    h(SwitchField, { label: "Label", switch: {} }),
  ])
}

function renderSegmentedControl() {
  return h("div", [
    h("style", ".reflection-segmented-control{inline-size:332px}"),
    h(SegmentedControl, {
      className: "reflection-segmented-control",
      ariaLabel: "Reflection segmented control",
      modelValue: "one",
      items: segmentedControlItems,
    }),
  ])
}

function renderInputField(width: number) {
  return h("div", { style: { width: `${width}px` } }, [
    h(InputField, {
      id: `reflection-input-field-${width}`,
      label: "Label",
      helperText: "Hint text",
      input: { placeholder: "Enter text" },
    }),
  ])
}

function renderSlider(value: number) {
  return h("div", { style: { width: "260px" } }, [
    h(Slider, {
      ariaLabel: "Reflection slider",
      defaultValue: value,
      showTooltip: false,
      style: { width: "260px" },
    }),
  ])
}

function renderDialog() {
  return h(Dialog, {
    title: "Dialog title",
    description: dialogDescription,
    size: "medium",
    onClose: () => undefined,
    footer: [
      h(PrimaryButton, {}, { default: () => "Label" }),
      h(SecondaryButton, {}, { default: () => "Label" }),
    ],
  })
}

const portalCases: Record<string, PortalCase> = {
  "/reflection/accordion/expanded/light": {
    render: () =>
      h("div", { style: { width: "360px" } }, [
        h(
          Accordion,
          { open: true },
          {
            title: () => "Accordion title",
            default: () => accordionBody,
          },
        ),
      ]),
  },
  "/reflection/accordion/expanded/dark": {
    render: () =>
      h("div", { style: { width: "360px" } }, [
        h(
          Accordion,
          { open: true },
          {
            title: () => "Accordion title",
            default: () => accordionBody,
          },
        ),
      ]),
  },
  "/reflection/badge/neutral/light": {
    render: () => h(Badge, { variant: BadgeVariant.neutral }, { default: () => "Badge" }),
  },
  "/reflection/badge/neutral/dark": {
    render: () => h(Badge, { variant: BadgeVariant.neutral }, { default: () => "Badge" }),
  },
  "/reflection/badge/primary/light": {
    render: () => h(Badge, { variant: BadgeVariant.info }, { default: () => "Badge" }),
  },
  "/reflection/badge/primary/dark": {
    render: () => h(Badge, { variant: BadgeVariant.info }, { default: () => "Badge" }),
  },
  "/reflection/badge/success/light": {
    render: () => h(Badge, { variant: BadgeVariant.success }, { default: () => "Badge" }),
  },
  "/reflection/badge/success/dark": {
    render: () => h(Badge, { variant: BadgeVariant.success }, { default: () => "Badge" }),
  },
  "/reflection/badge/warning/light": {
    render: () => h(Badge, { variant: BadgeVariant.warning }, { default: () => "Badge" }),
  },
  "/reflection/badge/warning/dark": {
    render: () => h(Badge, { variant: BadgeVariant.warning }, { default: () => "Badge" }),
  },
  "/reflection/badge/destructive/light": {
    render: () => h(Badge, { variant: BadgeVariant.error }, { default: () => "Badge" }),
  },
  "/reflection/badge/destructive/dark": {
    render: () => h(Badge, { variant: BadgeVariant.error }, { default: () => "Badge" }),
  },
  "/reflection/button/basic/light": {
    render: () => h(PrimaryButton, {}, { default: () => "Label" }),
  },
  "/reflection/button/secondary/light": {
    render: () => h(SecondaryButton, {}, { default: () => "Label" }),
  },
  "/reflection/button/text/light": {
    render: () => h(TextButton, {}, { default: () => "Label" }),
  },
  "/reflection/button/destructive/light": {
    render: () => h(DestructiveButton, {}, { default: () => "Delete" }),
  },
  "/reflection/card/default/light": {
    render: () =>
      h("div", { style: { width: "320px" } }, [
        h(Card, {}, { title: () => "Card title", default: () => cardBody }),
      ]),
  },
  "/reflection/card/default/dark": {
    render: () =>
      h("div", { style: { width: "320px" } }, [
        h(Card, {}, { title: () => "Card title", default: () => cardBody }),
      ]),
  },
  "/reflection/checkbox/states-default/light": {
    render: renderCheckboxStates,
  },
  "/reflection/checkbox/states-default/dark": {
    render: renderCheckboxStates,
  },
  "/reflection/context-menu/full/light": {
    render: () => h(ContextMenu, { items: contextMenuItems, ariaLabel: "Context menu" }),
  },
  "/reflection/context-menu/full/dark": {
    render: () => h(ContextMenu, { items: contextMenuItems, ariaLabel: "Context menu" }),
  },
  "/reflection/dialog/medium/light": {
    render: renderDialog,
  },
  "/reflection/dialog/medium/dark": {
    render: renderDialog,
  },
  "/reflection/divider/sp-16/light": {
    render: () => h("div", { style: { width: "480px" } }, [h(Divider, { size: "sm" })]),
  },
  "/reflection/divider/sp-16/dark": {
    render: () => h("div", { style: { width: "480px" } }, [h(Divider, { size: "sm" })]),
  },
  "/reflection/input-fields/default/light": {
    render: () => renderInputField(460),
  },
  "/reflection/input-fields/default/dark": {
    render: () => renderInputField(460),
  },
  "/reflection/input-types-overview/text/light": {
    render: () => renderInputField(288),
  },
  "/reflection/input-types-overview/text/dark": {
    render: () => renderInputField(288),
  },
  "/reflection/radio/states-default/light": {
    render: renderRadioStates,
  },
  "/reflection/radio/states-default/dark": {
    render: renderRadioStates,
  },
  "/reflection/radio-group/default/light": {
    render: renderRadioGroup,
  },
  "/reflection/radio-group/default/dark": {
    render: renderRadioGroup,
  },
  "/reflection/segmented-control/three-segments/light": {
    render: renderSegmentedControl,
  },
  "/reflection/segmented-control/three-segments/dark": {
    render: renderSegmentedControl,
  },
  "/reflection/slider/default/light": {
    render: () => renderSlider(63.2),
  },
  "/reflection/slider/default/dark": {
    render: () => renderSlider(42),
  },
  "/reflection/switch/states-default/light": {
    render: renderSwitchStates,
  },
  "/reflection/switch/states-default/dark": {
    render: renderSwitchStates,
  },
}

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

async function waitForMarwesTheme(root: HTMLElement) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await nextFrame()

    const themeRoot = root.querySelector("[data-marwes-theme]")
    const component = root.querySelector(
      ".mw-btn, .mw-badge, .mw-accordion, .mw-card, .mw-checkbox-field, .mw-context-menu, .mw-dialog, .mw-divider, .mw-input-field, .mw-radio, .mw-radio-group-field, .mw-segmented-control, .mw-slider, .mw-switch-field",
    )
    const primaryColor = themeRoot
      ? getComputedStyle(themeRoot).getPropertyValue("--mw-color-primary-base").trim()
      : ""

    if (component && primaryColor) {
      await document.fonts?.ready
      return
    }
  }

  throw new Error("Marwes theme variables were not applied before Reflection capture.")
}

function themeModeForPath(path: string) {
  return path.endsWith("/dark") ? ThemeMode.dark : ThemeMode.light
}

export async function mountReflectionCase(input: ReflectionPortalMountInput) {
  const portalCase = portalCases[input.path]

  if (!portalCase) {
    throw new Error(`Unknown Vue Reflection portal path: ${input.path}`)
  }

  const app = createApp({
    render() {
      return h(
        MarwesProvider,
        {
          enableSystem: false,
          theme: { mode: themeModeForPath(input.path) },
        },
        {
          default: () => portalCase.render(),
        },
      )
    },
  })

  app.mount(input.root)
  await nextTick()
  await waitForMarwesTheme(input.root)

  return () => app.unmount()
}
