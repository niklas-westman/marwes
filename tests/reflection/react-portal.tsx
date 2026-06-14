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
  InputOtp,
  PrimaryButton,
  Radio,
  RadioGroupField,
  SecondaryButton,
  SegmentedControl,
  Select,
  Slider,
  SwitchField,
  Text,
  TextButton,
  TextareaField,
  TooltipGroup,
} from "@marwes-ui/react"
import { MarwesProvider, ThemeMode } from "@marwes-ui/react"
import type { ReactNode } from "react"
import { flushSync } from "react-dom"
import { createRoot } from "react-dom/client"
import type { ReflectionPortalMountInput } from "reflection-check"

type PortalCase = {
  render: () => ReactNode
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
const selectOptions = [{ value: "option", label: "Option" }]

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
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <CheckboxField id="reflection-checkbox-unchecked" label="Label" checkbox={{}} />
      <CheckboxField id="reflection-checkbox-checked" label="Label" checkbox={{ checked: true }} />
      <CheckboxField
        id="reflection-checkbox-mixed"
        label="Label"
        checkbox={{ indeterminate: true }}
      />
    </div>
  )
}

function renderRadioStates() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <label
        htmlFor="reflection-radio-states-checked"
        style={{ display: "inline-flex", height: 32, alignItems: "center", gap: 8 }}
      >
        <Radio
          id="reflection-radio-states-checked"
          name="reflection-radio-states"
          defaultChecked
          ariaLabel="Label"
        />
        <Text variant="label">Label</Text>
      </label>
      <label
        htmlFor="reflection-radio-states-unchecked"
        style={{ display: "inline-flex", height: 32, alignItems: "center", gap: 8 }}
      >
        <Radio
          id="reflection-radio-states-unchecked"
          name="reflection-radio-states"
          ariaLabel="Label"
        />
        <Text variant="label">Label</Text>
      </label>
    </div>
  )
}

function renderRadioGroup() {
  return (
    <RadioGroupField
      name="reflection-radio-group"
      label="Group label"
      description="Select one option"
      defaultValue="one"
      options={radioGroupOptions}
    />
  )
}

function renderSwitchStates() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <SwitchField label="Label" switch={{ checked: true }} />
      <SwitchField label="Label" switch={{}} />
    </div>
  )
}

function renderSegmentedControl() {
  return (
    <>
      <style>{".reflection-segmented-control{inline-size:332px}"}</style>
      <SegmentedControl
        className="reflection-segmented-control"
        ariaLabel="Reflection segmented control"
        defaultValue="one"
        items={segmentedControlItems}
      />
    </>
  )
}

function renderInputField(width: number) {
  return (
    <div style={{ width }}>
      <InputField
        id={`reflection-input-field-${width}`}
        label="Label"
        helperText="Hint text"
        input={{ placeholder: "Enter text" }}
      />
    </div>
  )
}

function renderInputOtp() {
  return (
    <InputOtp
      id="reflection-input-otp"
      label="Verification code"
      helperText="Enter the 6-digit code sent to your email"
      placeholderCharacter="·"
    />
  )
}

function renderSelect() {
  return <Select ariaLabel="Option" defaultValue="option" options={selectOptions} native={false} />
}

function renderTextarea() {
  return (
    <div style={{ width: 288 }}>
      <TextareaField
        id="reflection-textarea"
        label="Label"
        helperText="Hint text"
        counterText="0/100"
        textarea={{ placeholder: "Enter message..." }}
      />
    </div>
  )
}

function renderTooltipGroup() {
  return <TooltipGroup open content="Tooltip text" triggerLabel="Show tooltip" />
}

function renderSlider(value: number) {
  return (
    <div style={{ width: 260 }}>
      <Slider
        ariaLabel="Reflection slider"
        defaultValue={value}
        showTooltip={false}
        style={{ width: 260 }}
      />
    </div>
  )
}

function renderDialog() {
  return (
    <Dialog
      title="Dialog title"
      description={dialogDescription}
      size="medium"
      onClose={() => undefined}
      footer={
        <>
          <PrimaryButton>Label</PrimaryButton>
          <SecondaryButton>Label</SecondaryButton>
        </>
      }
    />
  )
}

const portalCases: Record<string, PortalCase> = {
  "/reflection/accordion/expanded/light": {
    render: () => (
      <div style={{ width: 360 }}>
        <Accordion open title="Accordion title">
          {accordionBody}
        </Accordion>
      </div>
    ),
  },
  "/reflection/accordion/expanded/dark": {
    render: () => (
      <div style={{ width: 360 }}>
        <Accordion open title="Accordion title">
          {accordionBody}
        </Accordion>
      </div>
    ),
  },
  "/reflection/badge/neutral/light": {
    render: () => <Badge variant={BadgeVariant.neutral}>Badge</Badge>,
  },
  "/reflection/badge/neutral/dark": {
    render: () => <Badge variant={BadgeVariant.neutral}>Badge</Badge>,
  },
  "/reflection/badge/primary/light": {
    render: () => <Badge variant={BadgeVariant.info}>Badge</Badge>,
  },
  "/reflection/badge/primary/dark": {
    render: () => <Badge variant={BadgeVariant.info}>Badge</Badge>,
  },
  "/reflection/badge/success/light": {
    render: () => <Badge variant={BadgeVariant.success}>Badge</Badge>,
  },
  "/reflection/badge/success/dark": {
    render: () => <Badge variant={BadgeVariant.success}>Badge</Badge>,
  },
  "/reflection/badge/warning/light": {
    render: () => <Badge variant={BadgeVariant.warning}>Badge</Badge>,
  },
  "/reflection/badge/warning/dark": {
    render: () => <Badge variant={BadgeVariant.warning}>Badge</Badge>,
  },
  "/reflection/badge/destructive/light": {
    render: () => <Badge variant={BadgeVariant.error}>Badge</Badge>,
  },
  "/reflection/badge/destructive/dark": {
    render: () => <Badge variant={BadgeVariant.error}>Badge</Badge>,
  },
  "/reflection/button/basic/light": {
    render: () => <PrimaryButton>Label</PrimaryButton>,
  },
  "/reflection/button/secondary/light": {
    render: () => <SecondaryButton>Label</SecondaryButton>,
  },
  "/reflection/button/text/light": {
    render: () => <TextButton>Label</TextButton>,
  },
  "/reflection/button/destructive/light": {
    render: () => <DestructiveButton>Delete</DestructiveButton>,
  },
  "/reflection/card/default/light": {
    render: () => (
      <div style={{ width: 320 }}>
        <Card title="Card title">{cardBody}</Card>
      </div>
    ),
  },
  "/reflection/card/default/dark": {
    render: () => (
      <div style={{ width: 320 }}>
        <Card title="Card title">{cardBody}</Card>
      </div>
    ),
  },
  "/reflection/checkbox/states-default/light": {
    render: renderCheckboxStates,
  },
  "/reflection/checkbox/states-default/dark": {
    render: renderCheckboxStates,
  },
  "/reflection/context-menu/full/light": {
    render: () => <ContextMenu items={contextMenuItems} ariaLabel="Context menu" />,
  },
  "/reflection/context-menu/full/dark": {
    render: () => <ContextMenu items={contextMenuItems} ariaLabel="Context menu" />,
  },
  "/reflection/dialog/medium/light": {
    render: renderDialog,
  },
  "/reflection/dialog/medium/dark": {
    render: renderDialog,
  },
  "/reflection/divider/sp-16/light": {
    render: () => (
      <div style={{ width: 480 }}>
        <Divider size="sm" />
      </div>
    ),
  },
  "/reflection/divider/sp-16/dark": {
    render: () => (
      <div style={{ width: 480 }}>
        <Divider size="sm" />
      </div>
    ),
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
  "/reflection/input-otp/default/light": {
    render: renderInputOtp,
  },
  "/reflection/input-otp/default/dark": {
    render: renderInputOtp,
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
  "/reflection/select/default/light": {
    render: renderSelect,
  },
  "/reflection/select/default/dark": {
    render: renderSelect,
  },
  "/reflection/textarea/default/light": {
    render: renderTextarea,
  },
  "/reflection/textarea/default/dark": {
    render: renderTextarea,
  },
  "/reflection/tooltip/with-help-icon/light": {
    render: renderTooltipGroup,
  },
  "/reflection/tooltip/with-help-icon/dark": {
    render: renderTooltipGroup,
  },
}

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

async function waitForMarwesTheme(root: HTMLElement) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await nextFrame()

    const themeRoot = root.querySelector("[data-marwes-theme]")
    const component = root.querySelector(
      ".mw-btn, .mw-badge, .mw-accordion, .mw-card, .mw-checkbox-field, .mw-context-menu, .mw-dialog, .mw-divider, .mw-input-field, .mw-input-otp, .mw-radio, .mw-radio-group-field, .mw-segmented-control, .mw-select, .mw-slider, .mw-switch-field, .mw-tooltip-group",
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
    throw new Error(`Unknown React Reflection portal path: ${input.path}`)
  }

  const root = createRoot(input.root)

  flushSync(() => {
    root.render(
      <MarwesProvider enableSystem={false} theme={{ mode: themeModeForPath(input.path) }}>
        {portalCase.render()}
      </MarwesProvider>,
    )
  })

  await waitForMarwesTheme(input.root)

  return () => root.unmount()
}
