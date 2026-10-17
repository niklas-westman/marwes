import { IconName } from "@marwes-ui/core"
import type { ContextMenuEntry } from "@marwes-ui/core"
import {
  Badge,
  BadgeVariant,
  Button,
  CancelButton,
  Card,
  CheckboxField,
  CloseButton,
  ConfirmButton,
  ContextMenu,
  CopyButton,
  CreateButton,
  DestructiveButton,
  Dialog,
  Divider,
  DownloadButton,
  DropdownButton,
  EditButton,
  FilterButton,
  IconButton,
  InputField,
  LinkButton,
  PrimaryButton,
  RadioGroupField,
  RefreshButton,
  SaveButton,
  SearchButton,
  SecondaryButton,
  SortButton,
  SubmitButton,
  SuccessButton,
  SwitchField,
  Text,
  TextButton,
  TextareaField,
  TooltipGroup,
  UploadButton,
  VerifyButton,
} from "@marwes-ui/react"
import { MarwesProvider, ThemeMode } from "@marwes-ui/react"
import type { ReactNode } from "react"
import { flushSync } from "react-dom"
import { createRoot } from "react-dom/client"
import type { ReflectionPortalMountInput } from "reflection-check"
import { alignFigmaFrameOrigin } from "../../packages/design-governance/src/runtime/frame-position"
import { Accordion } from "../../packages/react/src/components/accordion/accordion"
import { InputOtp } from "../../packages/react/src/components/input/input-otp"
import { Select } from "../../packages/react/src/components/input/select"
import { Radio } from "../../packages/react/src/components/radio/radio"
import { SegmentedControl } from "../../packages/react/src/components/segmented-control/segmented-control"
import { Slider } from "../../packages/react/src/components/slider/slider"
import { installButtonActivationOutput, recordButtonActivation } from "./support/button-activation"
import { buttonFormKind } from "./support/button-form-events"
import { ButtonFormReact } from "./support/button-form-react"

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
  "/reflection/button/basic-icon-right/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-left/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/standard-focus-example/light": {
    render: () => <PrimaryButton onClick={recordButtonActivation}>Label</PrimaryButton>,
  },
  "/reflection/button/standard-focus-example/dark": {
    render: () => <PrimaryButton onClick={recordButtonActivation}>Label</PrimaryButton>,
  },
  "/reflection/button/basic/light": {
    render: () => <PrimaryButton onClick={recordButtonActivation}>Label</PrimaryButton>,
  },
  "/reflection/button/secondary-icon-right/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-left/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary/light": {
    render: () => <SecondaryButton onClick={recordButtonActivation}>Label</SecondaryButton>,
  },
  "/reflection/button/text-icon-right/light": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-icon-left/light": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text/light": {
    render: () => <TextButton onClick={recordButtonActivation}>Label</TextButton>,
  },
  "/reflection/button/basic-icon-right/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-left/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic/dark": {
    render: () => <PrimaryButton onClick={recordButtonActivation}>Label</PrimaryButton>,
  },
  "/reflection/button/secondary-icon-right/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-left/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary/dark": {
    render: () => <SecondaryButton onClick={recordButtonActivation}>Label</SecondaryButton>,
  },
  "/reflection/button/text-icon-right/dark": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-icon-left/dark": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text/dark": {
    render: () => <TextButton onClick={recordButtonActivation}>Label</TextButton>,
  },
  "/reflection/button/basic-icon-right-hover/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-left-hover/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-hover/light": {
    render: () => <PrimaryButton onClick={recordButtonActivation}>Label</PrimaryButton>,
  },
  "/reflection/button/basic-icon-right-pressed/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-left-pressed/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-pressed/light": {
    render: () => <PrimaryButton onClick={recordButtonActivation}>Label</PrimaryButton>,
  },
  "/reflection/button/basic-icon-right-disabled/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} disabled>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-left-disabled/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} disabled>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-disabled/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} disabled>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/secondary-icon-right-hover/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-left-hover/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-hover/light": {
    render: () => <SecondaryButton onClick={recordButtonActivation}>Label</SecondaryButton>,
  },
  "/reflection/button/secondary-icon-right-pressed/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-left-pressed/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-pressed/light": {
    render: () => <SecondaryButton onClick={recordButtonActivation}>Label</SecondaryButton>,
  },
  "/reflection/button/secondary-icon-right-disabled/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} disabled>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-left-disabled/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} disabled>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-disabled/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} disabled>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/text-icon-right-hover/light": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-icon-left-hover/light": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-hover/light": {
    render: () => <TextButton onClick={recordButtonActivation}>Label</TextButton>,
  },
  "/reflection/button/text-icon-right-pressed/light": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-icon-left-pressed/light": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-pressed/light": {
    render: () => <TextButton onClick={recordButtonActivation}>Label</TextButton>,
  },
  "/reflection/button/text-icon-right-disabled/light": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} disabled>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-icon-left-disabled/light": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} disabled>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-disabled/light": {
    render: () => (
      <TextButton onClick={recordButtonActivation} disabled>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/basic-icon-right-hover/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-left-hover/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-hover/dark": {
    render: () => <PrimaryButton onClick={recordButtonActivation}>Label</PrimaryButton>,
  },
  "/reflection/button/basic-icon-right-pressed/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-left-pressed/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-pressed/dark": {
    render: () => <PrimaryButton onClick={recordButtonActivation}>Label</PrimaryButton>,
  },
  "/reflection/button/basic-icon-right-disabled/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} disabled>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-left-disabled/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} disabled>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-disabled/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} disabled>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/secondary-icon-right-hover/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-left-hover/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-hover/dark": {
    render: () => <SecondaryButton onClick={recordButtonActivation}>Label</SecondaryButton>,
  },
  "/reflection/button/secondary-icon-right-pressed/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-left-pressed/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-pressed/dark": {
    render: () => <SecondaryButton onClick={recordButtonActivation}>Label</SecondaryButton>,
  },
  "/reflection/button/secondary-icon-right-disabled/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} disabled>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-left-disabled/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} disabled>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-disabled/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} disabled>
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/text-icon-right-hover/dark": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-icon-left-hover/dark": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-hover/dark": {
    render: () => <TextButton onClick={recordButtonActivation}>Label</TextButton>,
  },
  "/reflection/button/text-icon-right-pressed/dark": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-icon-left-pressed/dark": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-pressed/dark": {
    render: () => <TextButton onClick={recordButtonActivation}>Label</TextButton>,
  },
  "/reflection/button/text-icon-right-disabled/dark": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} disabled>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-icon-left-disabled/dark": {
    render: () => (
      <TextButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} disabled>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-disabled/dark": {
    render: () => (
      <TextButton onClick={recordButtonActivation} disabled>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/basic-icon-right-sm/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} size="sm">
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-left-sm/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} size="sm">
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-sm/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} size="sm">
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-right-lg/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} size="lg">
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-left-lg/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} size="lg">
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-lg/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} size="lg">
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/secondary-icon-right-sm/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} size="sm">
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-left-sm/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} size="sm">
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-sm/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} size="sm">
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-right-lg/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} size="lg">
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-left-lg/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} size="lg">
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-lg/light": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} size="lg">
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/basic-icon-right-sm/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} size="sm">
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-left-sm/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} size="sm">
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-sm/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} size="sm">
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-right-lg/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} size="lg">
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-icon-left-lg/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} size="lg">
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/basic-lg/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} size="lg">
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/secondary-icon-right-sm/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} size="sm">
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-left-sm/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} size="sm">
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-sm/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} size="sm">
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-right-lg/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconRight={IconName.ArrowRight} size="lg">
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-icon-left-lg/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} iconLeft={IconName.ArrowLeft} size="lg">
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-lg/dark": {
    render: () => (
      <SecondaryButton onClick={recordButtonActivation} size="lg">
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/destructive/light": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} size="sm" iconRight={IconName.X}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/success-default/light": {
    render: () => <SuccessButton onClick={recordButtonActivation}>Confirm</SuccessButton>,
  },
  "/reflection/button/success-default/dark": {
    render: () => <SuccessButton onClick={recordButtonActivation}>Confirm</SuccessButton>,
  },
  "/reflection/button/success-hover/light": {
    render: () => <SuccessButton onClick={recordButtonActivation}>Confirm</SuccessButton>,
  },
  "/reflection/button/success-hover/dark": {
    render: () => <SuccessButton onClick={recordButtonActivation}>Confirm</SuccessButton>,
  },
  "/reflection/button/success-pressed/light": {
    render: () => <SuccessButton onClick={recordButtonActivation}>Confirm</SuccessButton>,
  },
  "/reflection/button/success-pressed/dark": {
    render: () => <SuccessButton onClick={recordButtonActivation}>Confirm</SuccessButton>,
  },
  "/reflection/button/success-disabled/light": {
    render: () => (
      <SuccessButton onClick={recordButtonActivation} disabled={true}>
        Confirm
      </SuccessButton>
    ),
  },
  "/reflection/button/success-disabled/dark": {
    render: () => (
      <SuccessButton onClick={recordButtonActivation} disabled={true}>
        Confirm
      </SuccessButton>
    ),
  },
  "/reflection/button/success-error/light": {
    render: () => (
      <SuccessButton onClick={recordButtonActivation} error={true}>
        Confirm
      </SuccessButton>
    ),
  },
  "/reflection/button/success-error/dark": {
    render: () => (
      <SuccessButton onClick={recordButtonActivation} error={true}>
        Confirm
      </SuccessButton>
    ),
  },
  "/reflection/button/danger-default/light": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} size={"sm"}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/danger-default/dark": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} size={"sm"}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/danger-hover/light": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} size={"sm"}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/danger-hover/dark": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} size={"sm"}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/danger-pressed/light": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} size={"sm"}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/danger-pressed/dark": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} size={"sm"}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/danger-disabled/light": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} size={"sm"} disabled={true}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/danger-disabled/dark": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} size={"sm"} disabled={true}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/danger-error/light": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} size={"sm"} error={true}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/danger-error/dark": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} size={"sm"} error={true}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/primary-error/light": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} error={true} iconRight={IconName.ArrowRight}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/primary-error/dark": {
    render: () => (
      <PrimaryButton onClick={recordButtonActivation} error={true} iconRight={IconName.ArrowRight}>
        Label
      </PrimaryButton>
    ),
  },
  "/reflection/button/secondary-error/light": {
    render: () => (
      <SecondaryButton
        onClick={recordButtonActivation}
        error={true}
        iconRight={IconName.ArrowRight}
      >
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-error/dark": {
    render: () => (
      <SecondaryButton
        onClick={recordButtonActivation}
        error={true}
        iconRight={IconName.ArrowRight}
      >
        Label
      </SecondaryButton>
    ),
  },
  "/reflection/button/text-error/light": {
    render: () => (
      <TextButton onClick={recordButtonActivation} error={true} iconRight={IconName.ArrowRight}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/text-error/dark": {
    render: () => (
      <TextButton onClick={recordButtonActivation} error={true} iconRight={IconName.ArrowRight}>
        Label
      </TextButton>
    ),
  },
  "/reflection/button/purpose-submit/light": {
    render: () => <SubmitButton onClick={recordButtonActivation}>Submit</SubmitButton>,
  },
  "/reflection/button/purpose-save/light": {
    render: () => <SaveButton onClick={recordButtonActivation}>Save</SaveButton>,
  },
  "/reflection/button/purpose-confirm/light": {
    render: () => <ConfirmButton onClick={recordButtonActivation}>Confirm</ConfirmButton>,
  },
  "/reflection/button/purpose-destructive/light": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} size={"sm"}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/purpose-verify/light": {
    render: () => <VerifyButton onClick={recordButtonActivation}>Verify</VerifyButton>,
  },
  "/reflection/button/purpose-create/light": {
    render: () => <CreateButton onClick={recordButtonActivation}>Create</CreateButton>,
  },
  "/reflection/button/purpose-edit/light": {
    render: () => <EditButton onClick={recordButtonActivation}>Edit</EditButton>,
  },
  "/reflection/button/purpose-upload/light": {
    render: () => <UploadButton onClick={recordButtonActivation}>Upload</UploadButton>,
  },
  "/reflection/button/purpose-download/light": {
    render: () => <DownloadButton onClick={recordButtonActivation}>Download</DownloadButton>,
  },
  "/reflection/button/purpose-search/light": {
    render: () => <SearchButton onClick={recordButtonActivation}>Search</SearchButton>,
  },
  "/reflection/button/purpose-dropdown/light": {
    render: () => <DropdownButton onClick={recordButtonActivation}>Options</DropdownButton>,
  },
  "/reflection/button/purpose-navigation/light": {
    render: () => (
      <LinkButton onClick={recordButtonActivation} href={"#governance-target"}>
        Link
      </LinkButton>
    ),
  },
  "/reflection/button/purpose-submit/dark": {
    render: () => <SubmitButton onClick={recordButtonActivation}>Submit</SubmitButton>,
  },
  "/reflection/button/purpose-save/dark": {
    render: () => <SaveButton onClick={recordButtonActivation}>Save</SaveButton>,
  },
  "/reflection/button/purpose-confirm/dark": {
    render: () => <ConfirmButton onClick={recordButtonActivation}>Confirm</ConfirmButton>,
  },
  "/reflection/button/purpose-destructive/dark": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} size={"sm"}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/purpose-verify/dark": {
    render: () => <VerifyButton onClick={recordButtonActivation}>Verify</VerifyButton>,
  },
  "/reflection/button/purpose-create/dark": {
    render: () => <CreateButton onClick={recordButtonActivation}>Create</CreateButton>,
  },
  "/reflection/button/purpose-edit/dark": {
    render: () => <EditButton onClick={recordButtonActivation}>Edit</EditButton>,
  },
  "/reflection/button/purpose-upload/dark": {
    render: () => <UploadButton onClick={recordButtonActivation}>Upload</UploadButton>,
  },
  "/reflection/button/purpose-download/dark": {
    render: () => <DownloadButton onClick={recordButtonActivation}>Download</DownloadButton>,
  },
  "/reflection/button/purpose-search/dark": {
    render: () => <SearchButton onClick={recordButtonActivation}>Search</SearchButton>,
  },
  "/reflection/button/purpose-dropdown/dark": {
    render: () => <DropdownButton onClick={recordButtonActivation}>Options</DropdownButton>,
  },
  "/reflection/button/purpose-navigation/dark": {
    render: () => (
      <LinkButton onClick={recordButtonActivation} href={"#governance-target"}>
        Link
      </LinkButton>
    ),
  },
  "/reflection/button/secondary-loading/light": {
    render: () => (
      <SecondaryButton
        onClick={recordButtonActivation}
        loading={{ isLoading: true, loadingLabel: "Please wait" }}
      >
        Please wait
      </SecondaryButton>
    ),
  },
  "/reflection/button/secondary-loading/dark": {
    render: () => (
      <SecondaryButton
        onClick={recordButtonActivation}
        loading={{ isLoading: true, loadingLabel: "Please wait" }}
      >
        Please wait
      </SecondaryButton>
    ),
  },
  "/reflection/button/neutral-default/light": {
    render: () => (
      <Button onClick={recordButtonActivation} variant={"neutral"}>
        Cancel
      </Button>
    ),
  },
  "/reflection/button/neutral-hover/light": {
    render: () => (
      <Button onClick={recordButtonActivation} variant={"neutral"}>
        Cancel
      </Button>
    ),
  },
  "/reflection/button/neutral-pressed/light": {
    render: () => (
      <Button onClick={recordButtonActivation} variant={"neutral"}>
        Cancel
      </Button>
    ),
  },
  "/reflection/button/neutral-disabled/light": {
    render: () => (
      <Button onClick={recordButtonActivation} variant={"neutral"} disabled={true}>
        Cancel
      </Button>
    ),
  },
  "/reflection/button/neutral-error/light": {
    render: () => (
      <Button onClick={recordButtonActivation} variant={"neutral"} error={true}>
        Cancel
      </Button>
    ),
  },
  "/reflection/button/neutral-default/dark": {
    render: () => (
      <Button onClick={recordButtonActivation} variant={"neutral"}>
        Cancel
      </Button>
    ),
  },
  "/reflection/button/neutral-hover/dark": {
    render: () => (
      <Button onClick={recordButtonActivation} variant={"neutral"}>
        Cancel
      </Button>
    ),
  },
  "/reflection/button/neutral-pressed/dark": {
    render: () => (
      <Button onClick={recordButtonActivation} variant={"neutral"}>
        Cancel
      </Button>
    ),
  },
  "/reflection/button/neutral-disabled/dark": {
    render: () => (
      <Button onClick={recordButtonActivation} variant={"neutral"} disabled={true}>
        Cancel
      </Button>
    ),
  },
  "/reflection/button/neutral-error/dark": {
    render: () => (
      <Button onClick={recordButtonActivation} variant={"neutral"} error={true}>
        Cancel
      </Button>
    ),
  },
  "/reflection/button/neutral-icon-left-default/light": {
    render: () => <RefreshButton onClick={recordButtonActivation}>Refresh</RefreshButton>,
  },
  "/reflection/button/neutral-icon-left-hover/light": {
    render: () => <RefreshButton onClick={recordButtonActivation}>Refresh</RefreshButton>,
  },
  "/reflection/button/neutral-icon-left-pressed/light": {
    render: () => <RefreshButton onClick={recordButtonActivation}>Refresh</RefreshButton>,
  },
  "/reflection/button/neutral-icon-left-disabled/light": {
    render: () => (
      <RefreshButton onClick={recordButtonActivation} disabled={true}>
        Refresh
      </RefreshButton>
    ),
  },
  "/reflection/button/neutral-icon-left-error/light": {
    render: () => (
      <RefreshButton onClick={recordButtonActivation} error={true}>
        Refresh
      </RefreshButton>
    ),
  },
  "/reflection/button/neutral-icon-left-default/dark": {
    render: () => <RefreshButton onClick={recordButtonActivation}>Refresh</RefreshButton>,
  },
  "/reflection/button/neutral-icon-left-hover/dark": {
    render: () => <RefreshButton onClick={recordButtonActivation}>Refresh</RefreshButton>,
  },
  "/reflection/button/neutral-icon-left-pressed/dark": {
    render: () => <RefreshButton onClick={recordButtonActivation}>Refresh</RefreshButton>,
  },
  "/reflection/button/neutral-icon-left-disabled/dark": {
    render: () => (
      <RefreshButton onClick={recordButtonActivation} disabled={true}>
        Refresh
      </RefreshButton>
    ),
  },
  "/reflection/button/neutral-icon-left-error/dark": {
    render: () => (
      <RefreshButton onClick={recordButtonActivation} error={true}>
        Refresh
      </RefreshButton>
    ),
  },
  "/reflection/button/purpose-cancel/light": {
    render: () => <CancelButton onClick={recordButtonActivation}>Cancel</CancelButton>,
  },
  "/reflection/button/purpose-copy/light": {
    render: () => <CopyButton onClick={recordButtonActivation}>Copy</CopyButton>,
  },
  "/reflection/button/purpose-filter/light": {
    render: () => <FilterButton onClick={recordButtonActivation}>Filter</FilterButton>,
  },
  "/reflection/button/purpose-sort/light": {
    render: () => <SortButton onClick={recordButtonActivation}>Sort</SortButton>,
  },
  "/reflection/button/purpose-close/light": {
    render: () => <CloseButton onClick={recordButtonActivation}>Close</CloseButton>,
  },
  "/reflection/button/purpose-refresh/light": {
    render: () => <RefreshButton onClick={recordButtonActivation}>Refresh</RefreshButton>,
  },
  "/reflection/button/purpose-cancel/dark": {
    render: () => <CancelButton onClick={recordButtonActivation}>Cancel</CancelButton>,
  },
  "/reflection/button/purpose-copy/dark": {
    render: () => <CopyButton onClick={recordButtonActivation}>Copy</CopyButton>,
  },
  "/reflection/button/purpose-filter/dark": {
    render: () => <FilterButton onClick={recordButtonActivation}>Filter</FilterButton>,
  },
  "/reflection/button/purpose-sort/dark": {
    render: () => <SortButton onClick={recordButtonActivation}>Sort</SortButton>,
  },
  "/reflection/button/purpose-close/dark": {
    render: () => <CloseButton onClick={recordButtonActivation}>Close</CloseButton>,
  },
  "/reflection/button/purpose-refresh/dark": {
    render: () => <RefreshButton onClick={recordButtonActivation}>Refresh</RefreshButton>,
  },
  "/reflection/button/success-icon-left-default/light": {
    render: () => (
      <SuccessButton onClick={recordButtonActivation} iconLeft={IconName.Check}>
        Success
      </SuccessButton>
    ),
  },
  "/reflection/button/danger-icon-left-default/light": {
    render: () => (
      <DestructiveButton onClick={recordButtonActivation} iconLeft={IconName.X} size={"sm"}>
        Delete
      </DestructiveButton>
    ),
  },
  "/reflection/button/icon-only-neutral-default/light": {
    render: () => (
      <IconButton
        onClick={recordButtonActivation}
        icon={IconName.X}
        size="md"
        variant="neutral"
        ariaLabel="Close"
      />
    ),
  },
  "/reflection/button/icon-only-neutral-default/dark": {
    render: () => (
      <IconButton
        onClick={recordButtonActivation}
        icon={IconName.X}
        size="md"
        variant="neutral"
        ariaLabel="Close"
      />
    ),
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
  const formKind = buttonFormKind(input.path)
  const portalCase = formKind
    ? { render: () => <ButtonFormReact kind={formKind} /> }
    : portalCases[input.path]

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
  const stopActivation = input.path.startsWith("/reflection/button/")
    ? installButtonActivationOutput(input.root)
    : () => {}
  const stopAligning = alignFigmaFrameOrigin(
    input.root,
    input.framing?.align,
    input.path.startsWith("/reflection/button/"),
  )

  return () => {
    stopActivation()
    stopAligning()
    root.unmount()
  }
}
