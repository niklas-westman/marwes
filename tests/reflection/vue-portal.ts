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
} from "@marwes-ui/vue"
import { MarwesProvider, ThemeMode } from "@marwes-ui/vue"
import type { ReflectionPortalMountInput } from "reflection-check"
import { type VNode, createApp, h, nextTick } from "vue"
import { Accordion } from "../../packages/vue/src/components/accordion/accordion"
import { InputOtp } from "../../packages/vue/src/components/input/input-otp"
import { Select } from "../../packages/vue/src/components/input/select"
import { Radio } from "../../packages/vue/src/components/radio/radio"
import { SegmentedControl } from "../../packages/vue/src/components/segmented-control/segmented-control"
import { Slider } from "../../packages/vue/src/components/slider/slider"
import { installButtonActivationOutput, recordButtonActivation } from "./support/button-activation"
import { buttonFormKind } from "./support/button-form-events"
import { renderButtonFormVue } from "./support/button-form-vue"

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

function renderInputOtp() {
  return h(InputOtp, {
    id: "reflection-input-otp",
    label: "Verification code",
    helperText: "Enter the 6-digit code sent to your email",
    placeholderCharacter: "·",
  })
}

function renderSelect() {
  return h(Select, {
    ariaLabel: "Option",
    defaultValue: "option",
    options: selectOptions,
    native: false,
  })
}

function renderTextarea() {
  return h("div", { style: { width: "288px" } }, [
    h(TextareaField, {
      id: "reflection-textarea",
      label: "Label",
      helperText: "Hint text",
      counterText: "0/100",
      textarea: { placeholder: "Enter message..." },
    }),
  ])
}

function renderTooltipGroup() {
  return h(TooltipGroup, {
    open: true,
    content: "Tooltip text",
    triggerLabel: "Show tooltip",
  })
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
  "/reflection/button/basic-icon-right/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-left/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/standard-focus-example/light": {
    render: () => h(PrimaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/standard-focus-example/dark": {
    render: () => h(PrimaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/basic/light": {
    render: () => h(PrimaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/secondary-icon-right/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-left/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary/light": {
    render: () =>
      h(SecondaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/text-icon-right/light": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-icon-left/light": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text/light": {
    render: () => h(TextButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/basic-icon-right/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-left/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic/dark": {
    render: () => h(PrimaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/secondary-icon-right/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-left/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary/dark": {
    render: () =>
      h(SecondaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/text-icon-right/dark": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-icon-left/dark": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text/dark": {
    render: () => h(TextButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/basic-icon-right-hover/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-left-hover/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-hover/light": {
    render: () => h(PrimaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/basic-icon-right-pressed/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-left-pressed/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-pressed/light": {
    render: () => h(PrimaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/basic-icon-right-disabled/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-left-disabled/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-disabled/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-right-hover/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-left-hover/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-hover/light": {
    render: () =>
      h(SecondaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/secondary-icon-right-pressed/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-left-pressed/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-pressed/light": {
    render: () =>
      h(SecondaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/secondary-icon-right-disabled/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-left-disabled/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-disabled/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-icon-right-hover/light": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-icon-left-hover/light": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-hover/light": {
    render: () => h(TextButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/text-icon-right-pressed/light": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-icon-left-pressed/light": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-pressed/light": {
    render: () => h(TextButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/text-icon-right-disabled/light": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-icon-left-disabled/light": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-disabled/light": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-right-hover/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-left-hover/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-hover/dark": {
    render: () => h(PrimaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/basic-icon-right-pressed/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-left-pressed/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-pressed/dark": {
    render: () => h(PrimaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/basic-icon-right-disabled/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-left-disabled/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-disabled/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-right-hover/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-left-hover/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-hover/dark": {
    render: () =>
      h(SecondaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/secondary-icon-right-pressed/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-left-pressed/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-pressed/dark": {
    render: () =>
      h(SecondaryButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/secondary-icon-right-disabled/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-left-disabled/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-disabled/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-icon-right-hover/dark": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-icon-left-hover/dark": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-hover/dark": {
    render: () => h(TextButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/text-icon-right-pressed/dark": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-icon-left-pressed/dark": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-pressed/dark": {
    render: () => h(TextButton, { onClick: recordButtonActivation }, { default: () => "Label" }),
  },
  "/reflection/button/text-icon-right-disabled/dark": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-icon-left-disabled/dark": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-disabled/dark": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, disabled: true },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-right-sm/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, size: "sm" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-left-sm/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, size: "sm" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-sm/light": {
    render: () =>
      h(PrimaryButton, { onClick: recordButtonActivation, size: "sm" }, { default: () => "Label" }),
  },
  "/reflection/button/basic-icon-right-lg/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, size: "lg" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-left-lg/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, size: "lg" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-lg/light": {
    render: () =>
      h(PrimaryButton, { onClick: recordButtonActivation, size: "lg" }, { default: () => "Label" }),
  },
  "/reflection/button/secondary-icon-right-sm/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, size: "sm" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-left-sm/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, size: "sm" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-sm/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, size: "sm" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-right-lg/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, size: "lg" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-left-lg/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, size: "lg" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-lg/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, size: "lg" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-right-sm/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, size: "sm" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-left-sm/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, size: "sm" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-sm/dark": {
    render: () =>
      h(PrimaryButton, { onClick: recordButtonActivation, size: "sm" }, { default: () => "Label" }),
  },
  "/reflection/button/basic-icon-right-lg/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, size: "lg" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-icon-left-lg/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, size: "lg" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/basic-lg/dark": {
    render: () =>
      h(PrimaryButton, { onClick: recordButtonActivation, size: "lg" }, { default: () => "Label" }),
  },
  "/reflection/button/secondary-icon-right-sm/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, size: "sm" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-left-sm/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, size: "sm" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-sm/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, size: "sm" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-right-lg/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconRight: IconName.ArrowRight, size: "lg" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-icon-left-lg/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, iconLeft: IconName.ArrowLeft, size: "lg" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-lg/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, size: "lg" },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/destructive/light": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, size: "sm", iconRight: IconName.X },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/success-default/light": {
    render: () =>
      h(SuccessButton, { onClick: recordButtonActivation }, { default: () => "Confirm" }),
  },
  "/reflection/button/success-default/dark": {
    render: () =>
      h(SuccessButton, { onClick: recordButtonActivation }, { default: () => "Confirm" }),
  },
  "/reflection/button/success-hover/light": {
    render: () =>
      h(SuccessButton, { onClick: recordButtonActivation }, { default: () => "Confirm" }),
  },
  "/reflection/button/success-hover/dark": {
    render: () =>
      h(SuccessButton, { onClick: recordButtonActivation }, { default: () => "Confirm" }),
  },
  "/reflection/button/success-pressed/light": {
    render: () =>
      h(SuccessButton, { onClick: recordButtonActivation }, { default: () => "Confirm" }),
  },
  "/reflection/button/success-pressed/dark": {
    render: () =>
      h(SuccessButton, { onClick: recordButtonActivation }, { default: () => "Confirm" }),
  },
  "/reflection/button/success-disabled/light": {
    render: () =>
      h(
        SuccessButton,
        { onClick: recordButtonActivation, disabled: true },
        { default: () => "Confirm" },
      ),
  },
  "/reflection/button/success-disabled/dark": {
    render: () =>
      h(
        SuccessButton,
        { onClick: recordButtonActivation, disabled: true },
        { default: () => "Confirm" },
      ),
  },
  "/reflection/button/success-error/light": {
    render: () =>
      h(
        SuccessButton,
        { onClick: recordButtonActivation, error: true },
        { default: () => "Confirm" },
      ),
  },
  "/reflection/button/success-error/dark": {
    render: () =>
      h(
        SuccessButton,
        { onClick: recordButtonActivation, error: true },
        { default: () => "Confirm" },
      ),
  },
  "/reflection/button/danger-default/light": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, size: "sm" },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/danger-default/dark": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, size: "sm" },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/danger-hover/light": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, size: "sm" },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/danger-hover/dark": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, size: "sm" },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/danger-pressed/light": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, size: "sm" },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/danger-pressed/dark": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, size: "sm" },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/danger-disabled/light": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, size: "sm", disabled: true },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/danger-disabled/dark": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, size: "sm", disabled: true },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/danger-error/light": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, size: "sm", error: true },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/danger-error/dark": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, size: "sm", error: true },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/primary-error/light": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, error: true, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/primary-error/dark": {
    render: () =>
      h(
        PrimaryButton,
        { onClick: recordButtonActivation, error: true, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-error/light": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, error: true, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/secondary-error/dark": {
    render: () =>
      h(
        SecondaryButton,
        { onClick: recordButtonActivation, error: true, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-error/light": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, error: true, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/text-error/dark": {
    render: () =>
      h(
        TextButton,
        { onClick: recordButtonActivation, error: true, iconRight: IconName.ArrowRight },
        { default: () => "Label" },
      ),
  },
  "/reflection/button/purpose-submit/light": {
    render: () => h(SubmitButton, { onClick: recordButtonActivation }, { default: () => "Submit" }),
  },
  "/reflection/button/purpose-save/light": {
    render: () => h(SaveButton, { onClick: recordButtonActivation }, { default: () => "Save" }),
  },
  "/reflection/button/purpose-confirm/light": {
    render: () =>
      h(ConfirmButton, { onClick: recordButtonActivation }, { default: () => "Confirm" }),
  },
  "/reflection/button/purpose-destructive/light": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, size: "sm" },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/purpose-verify/light": {
    render: () => h(VerifyButton, { onClick: recordButtonActivation }, { default: () => "Verify" }),
  },
  "/reflection/button/purpose-create/light": {
    render: () => h(CreateButton, { onClick: recordButtonActivation }, { default: () => "Create" }),
  },
  "/reflection/button/purpose-edit/light": {
    render: () => h(EditButton, { onClick: recordButtonActivation }, { default: () => "Edit" }),
  },
  "/reflection/button/purpose-upload/light": {
    render: () => h(UploadButton, { onClick: recordButtonActivation }, { default: () => "Upload" }),
  },
  "/reflection/button/purpose-download/light": {
    render: () =>
      h(DownloadButton, { onClick: recordButtonActivation }, { default: () => "Download" }),
  },
  "/reflection/button/purpose-search/light": {
    render: () => h(SearchButton, { onClick: recordButtonActivation }, { default: () => "Search" }),
  },
  "/reflection/button/purpose-dropdown/light": {
    render: () =>
      h(DropdownButton, { onClick: recordButtonActivation }, { default: () => "Options" }),
  },
  "/reflection/button/purpose-navigation/light": {
    render: () =>
      h(
        LinkButton,
        { onClick: recordButtonActivation, href: "#governance-target" },
        { default: () => "Link" },
      ),
  },
  "/reflection/button/purpose-submit/dark": {
    render: () => h(SubmitButton, { onClick: recordButtonActivation }, { default: () => "Submit" }),
  },
  "/reflection/button/purpose-save/dark": {
    render: () => h(SaveButton, { onClick: recordButtonActivation }, { default: () => "Save" }),
  },
  "/reflection/button/purpose-confirm/dark": {
    render: () =>
      h(ConfirmButton, { onClick: recordButtonActivation }, { default: () => "Confirm" }),
  },
  "/reflection/button/purpose-destructive/dark": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, size: "sm" },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/purpose-verify/dark": {
    render: () => h(VerifyButton, { onClick: recordButtonActivation }, { default: () => "Verify" }),
  },
  "/reflection/button/purpose-create/dark": {
    render: () => h(CreateButton, { onClick: recordButtonActivation }, { default: () => "Create" }),
  },
  "/reflection/button/purpose-edit/dark": {
    render: () => h(EditButton, { onClick: recordButtonActivation }, { default: () => "Edit" }),
  },
  "/reflection/button/purpose-upload/dark": {
    render: () => h(UploadButton, { onClick: recordButtonActivation }, { default: () => "Upload" }),
  },
  "/reflection/button/purpose-download/dark": {
    render: () =>
      h(DownloadButton, { onClick: recordButtonActivation }, { default: () => "Download" }),
  },
  "/reflection/button/purpose-search/dark": {
    render: () => h(SearchButton, { onClick: recordButtonActivation }, { default: () => "Search" }),
  },
  "/reflection/button/purpose-dropdown/dark": {
    render: () =>
      h(DropdownButton, { onClick: recordButtonActivation }, { default: () => "Options" }),
  },
  "/reflection/button/purpose-navigation/dark": {
    render: () =>
      h(
        LinkButton,
        { onClick: recordButtonActivation, href: "#governance-target" },
        { default: () => "Link" },
      ),
  },
  "/reflection/button/secondary-loading/light": {
    render: () =>
      h(
        SecondaryButton,
        {
          onClick: recordButtonActivation,
          loading: { isLoading: true, loadingLabel: "Please wait" },
        },
        { default: () => "Please wait" },
      ),
  },
  "/reflection/button/secondary-loading/dark": {
    render: () =>
      h(
        SecondaryButton,
        {
          onClick: recordButtonActivation,
          loading: { isLoading: true, loadingLabel: "Please wait" },
        },
        { default: () => "Please wait" },
      ),
  },
  "/reflection/button/neutral-default/light": {
    render: () =>
      h(
        Button,
        { onClick: recordButtonActivation, variant: "neutral" },
        { default: () => "Cancel" },
      ),
  },
  "/reflection/button/neutral-hover/light": {
    render: () =>
      h(
        Button,
        { onClick: recordButtonActivation, variant: "neutral" },
        { default: () => "Cancel" },
      ),
  },
  "/reflection/button/neutral-pressed/light": {
    render: () =>
      h(
        Button,
        { onClick: recordButtonActivation, variant: "neutral" },
        { default: () => "Cancel" },
      ),
  },
  "/reflection/button/neutral-disabled/light": {
    render: () =>
      h(
        Button,
        { onClick: recordButtonActivation, variant: "neutral", disabled: true },
        { default: () => "Cancel" },
      ),
  },
  "/reflection/button/neutral-error/light": {
    render: () =>
      h(
        Button,
        { onClick: recordButtonActivation, variant: "neutral", error: true },
        { default: () => "Cancel" },
      ),
  },
  "/reflection/button/neutral-default/dark": {
    render: () =>
      h(
        Button,
        { onClick: recordButtonActivation, variant: "neutral" },
        { default: () => "Cancel" },
      ),
  },
  "/reflection/button/neutral-hover/dark": {
    render: () =>
      h(
        Button,
        { onClick: recordButtonActivation, variant: "neutral" },
        { default: () => "Cancel" },
      ),
  },
  "/reflection/button/neutral-pressed/dark": {
    render: () =>
      h(
        Button,
        { onClick: recordButtonActivation, variant: "neutral" },
        { default: () => "Cancel" },
      ),
  },
  "/reflection/button/neutral-disabled/dark": {
    render: () =>
      h(
        Button,
        { onClick: recordButtonActivation, variant: "neutral", disabled: true },
        { default: () => "Cancel" },
      ),
  },
  "/reflection/button/neutral-error/dark": {
    render: () =>
      h(
        Button,
        { onClick: recordButtonActivation, variant: "neutral", error: true },
        { default: () => "Cancel" },
      ),
  },
  "/reflection/button/neutral-icon-left-default/light": {
    render: () =>
      h(RefreshButton, { onClick: recordButtonActivation }, { default: () => "Refresh" }),
  },
  "/reflection/button/neutral-icon-left-hover/light": {
    render: () =>
      h(RefreshButton, { onClick: recordButtonActivation }, { default: () => "Refresh" }),
  },
  "/reflection/button/neutral-icon-left-pressed/light": {
    render: () =>
      h(RefreshButton, { onClick: recordButtonActivation }, { default: () => "Refresh" }),
  },
  "/reflection/button/neutral-icon-left-disabled/light": {
    render: () =>
      h(
        RefreshButton,
        { onClick: recordButtonActivation, disabled: true },
        { default: () => "Refresh" },
      ),
  },
  "/reflection/button/neutral-icon-left-error/light": {
    render: () =>
      h(
        RefreshButton,
        { onClick: recordButtonActivation, error: true },
        { default: () => "Refresh" },
      ),
  },
  "/reflection/button/neutral-icon-left-default/dark": {
    render: () =>
      h(RefreshButton, { onClick: recordButtonActivation }, { default: () => "Refresh" }),
  },
  "/reflection/button/neutral-icon-left-hover/dark": {
    render: () =>
      h(RefreshButton, { onClick: recordButtonActivation }, { default: () => "Refresh" }),
  },
  "/reflection/button/neutral-icon-left-pressed/dark": {
    render: () =>
      h(RefreshButton, { onClick: recordButtonActivation }, { default: () => "Refresh" }),
  },
  "/reflection/button/neutral-icon-left-disabled/dark": {
    render: () =>
      h(
        RefreshButton,
        { onClick: recordButtonActivation, disabled: true },
        { default: () => "Refresh" },
      ),
  },
  "/reflection/button/neutral-icon-left-error/dark": {
    render: () =>
      h(
        RefreshButton,
        { onClick: recordButtonActivation, error: true },
        { default: () => "Refresh" },
      ),
  },
  "/reflection/button/purpose-cancel/light": {
    render: () => h(CancelButton, { onClick: recordButtonActivation }, { default: () => "Cancel" }),
  },
  "/reflection/button/purpose-copy/light": {
    render: () => h(CopyButton, { onClick: recordButtonActivation }, { default: () => "Copy" }),
  },
  "/reflection/button/purpose-filter/light": {
    render: () => h(FilterButton, { onClick: recordButtonActivation }, { default: () => "Filter" }),
  },
  "/reflection/button/purpose-sort/light": {
    render: () => h(SortButton, { onClick: recordButtonActivation }, { default: () => "Sort" }),
  },
  "/reflection/button/purpose-close/light": {
    render: () => h(CloseButton, { onClick: recordButtonActivation }, { default: () => "Close" }),
  },
  "/reflection/button/purpose-refresh/light": {
    render: () =>
      h(RefreshButton, { onClick: recordButtonActivation }, { default: () => "Refresh" }),
  },
  "/reflection/button/purpose-cancel/dark": {
    render: () => h(CancelButton, { onClick: recordButtonActivation }, { default: () => "Cancel" }),
  },
  "/reflection/button/purpose-copy/dark": {
    render: () => h(CopyButton, { onClick: recordButtonActivation }, { default: () => "Copy" }),
  },
  "/reflection/button/purpose-filter/dark": {
    render: () => h(FilterButton, { onClick: recordButtonActivation }, { default: () => "Filter" }),
  },
  "/reflection/button/purpose-sort/dark": {
    render: () => h(SortButton, { onClick: recordButtonActivation }, { default: () => "Sort" }),
  },
  "/reflection/button/purpose-close/dark": {
    render: () => h(CloseButton, { onClick: recordButtonActivation }, { default: () => "Close" }),
  },
  "/reflection/button/purpose-refresh/dark": {
    render: () =>
      h(RefreshButton, { onClick: recordButtonActivation }, { default: () => "Refresh" }),
  },
  "/reflection/button/success-icon-left-default/light": {
    render: () =>
      h(
        SuccessButton,
        { onClick: recordButtonActivation, iconLeft: IconName.Check },
        { default: () => "Success" },
      ),
  },
  "/reflection/button/danger-icon-left-default/light": {
    render: () =>
      h(
        DestructiveButton,
        { onClick: recordButtonActivation, iconLeft: IconName.X, size: "sm" },
        { default: () => "Delete" },
      ),
  },
  "/reflection/button/icon-only-neutral-default/light": {
    render: () =>
      h(IconButton, {
        onClick: recordButtonActivation,
        icon: IconName.X,
        size: "md",
        variant: "neutral",
        ariaLabel: "Close",
      }),
  },
  "/reflection/button/icon-only-neutral-default/dark": {
    render: () =>
      h(IconButton, {
        onClick: recordButtonActivation,
        icon: IconName.X,
        size: "md",
        variant: "neutral",
        ariaLabel: "Close",
      }),
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
    ? { render: () => renderButtonFormVue(formKind) }
    : portalCases[input.path]

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
    app.unmount()
  }
}
import { alignFigmaFrameOrigin } from "../../packages/design-governance/src/runtime/frame-position"
