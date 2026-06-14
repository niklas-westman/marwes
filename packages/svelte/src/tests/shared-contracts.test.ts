/**
 * Svelte adapter shared contract enrollment.
 *
 * These tests intentionally call the shared React/Vue contract runners so Svelte
 * cannot drift under separate local-only assertions.
 */
import "@testing-library/jest-dom/vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { createRawSnippet } from "svelte"
import { vi } from "vitest"
import { runAccordionContract } from "../../../../tests/contracts/accordion.contract"
import { runAvatarBadgeContract } from "../../../../tests/contracts/avatar-badge.contract"
import { runAvatarGroupContract } from "../../../../tests/contracts/avatar-group.contract"
import { runAvatarContract } from "../../../../tests/contracts/avatar.contract"
import { runBadgeGroupContract } from "../../../../tests/contracts/badge-group.contract"
import { runBadgeContract } from "../../../../tests/contracts/badge.contract"
import { runBannerContract } from "../../../../tests/contracts/banner.contract"
import { runButtonSemanticsContract } from "../../../../tests/contracts/button-semantics.contract"
import { runButtonContract } from "../../../../tests/contracts/button.contract"
import { runCardContract } from "../../../../tests/contracts/card.contract"
import { runCheckboxFieldContract } from "../../../../tests/contracts/checkbox-field.contract"
import { runCheckboxGroupFieldContract } from "../../../../tests/contracts/checkbox-group-field.contract"
import { runCheckboxContract } from "../../../../tests/contracts/checkbox.contract"
import { runDateOfBirthFieldContract } from "../../../../tests/contracts/date-of-birth-field.contract"
import { runDialogModalContract } from "../../../../tests/contracts/dialog-modal.contract"
import { runDialogContract } from "../../../../tests/contracts/dialog.contract"
import { runDividerContract } from "../../../../tests/contracts/divider.contract"
import { runHeadingContract } from "../../../../tests/contracts/heading.contract"
import { runIconContract } from "../../../../tests/contracts/icon.contract"
import { runInputFieldContract } from "../../../../tests/contracts/input-field.contract"
import { runInputOtpContract } from "../../../../tests/contracts/input-otp.contract"
import { runInputContract } from "../../../../tests/contracts/input.contract"
import { runParagraphContract } from "../../../../tests/contracts/paragraph.contract"
import { runProgressBarContract } from "../../../../tests/contracts/progress-bar.contract"
import { runRadioGroupFieldContract } from "../../../../tests/contracts/radio-group-field.contract"
import { runRadioContract } from "../../../../tests/contracts/radio.contract"
import { runRichTextFieldContract } from "../../../../tests/contracts/rich-text-field.contract"
import { runRichTextContract } from "../../../../tests/contracts/rich-text.contract"
import { runSelectComboboxContract } from "../../../../tests/contracts/select-combobox.contract"
import { runSelectFieldContract } from "../../../../tests/contracts/select-field.contract"
import { runSelectContract } from "../../../../tests/contracts/select.contract"
import { runSkeletonContract } from "../../../../tests/contracts/skeleton.contract"
import { runSliderContract } from "../../../../tests/contracts/slider.contract"
import { runSpacingContract } from "../../../../tests/contracts/spacing.contract"
import { runSpinnerVariantsContract } from "../../../../tests/contracts/spinner-variants.contract"
import { runSpinnerContract } from "../../../../tests/contracts/spinner.contract"
import { runStatTileContract } from "../../../../tests/contracts/stat-tile.contract"
import { runSwitchContract } from "../../../../tests/contracts/switch.contract"
import { runTabContract } from "../../../../tests/contracts/tab.contract"
import { runTextareaFieldContract } from "../../../../tests/contracts/textarea-field.contract"
import { runTextareaContract } from "../../../../tests/contracts/textarea.contract"
import { runToastContract } from "../../../../tests/contracts/toast.contract"
import { runTooltipContract } from "../../../../tests/contracts/tooltip.contract"
import { runZipCodeFieldContract } from "../../../../tests/contracts/zip-code-field.contract"
import Accordion from "../lib/components/accordion/Accordion.svelte"
import Avatar from "../lib/components/avatar/Avatar.svelte"
import AvatarBadge from "../lib/components/avatar/AvatarBadge.svelte"
import AvatarGroup from "../lib/components/avatar/AvatarGroup.svelte"
import Badge from "../lib/components/badge/Badge.svelte"
import NotificationBadge from "../lib/components/badge/NotificationBadge.svelte"
import PriorityBadge from "../lib/components/badge/PriorityBadge.svelte"
import StatusBadge from "../lib/components/badge/StatusBadge.svelte"
import Banner from "../lib/components/banner/Banner.svelte"
import CancelButton from "../lib/components/button/CancelButton.svelte"
import CloseButton from "../lib/components/button/CloseButton.svelte"
import ConfirmButton from "../lib/components/button/ConfirmButton.svelte"
import CopyButton from "../lib/components/button/CopyButton.svelte"
import DestructiveButton from "../lib/components/button/DestructiveButton.svelte"
import DownloadButton from "../lib/components/button/DownloadButton.svelte"
import DropdownButton from "../lib/components/button/DropdownButton.svelte"
import EditButton from "../lib/components/button/EditButton.svelte"
import FilterButton from "../lib/components/button/FilterButton.svelte"
import LinkButton from "../lib/components/button/LinkButton.svelte"
import PrimaryButton from "../lib/components/button/PrimaryButton.svelte"
import RefreshButton from "../lib/components/button/RefreshButton.svelte"
import SaveButton from "../lib/components/button/SaveButton.svelte"
import SearchButton from "../lib/components/button/SearchButton.svelte"
import SortButton from "../lib/components/button/SortButton.svelte"
import UploadButton from "../lib/components/button/UploadButton.svelte"
import VerifyButton from "../lib/components/button/VerifyButton.svelte"
import Card from "../lib/components/card/Card.svelte"
import ProductCard from "../lib/components/card/ProductCard.svelte"
import ProfileCard from "../lib/components/card/ProfileCard.svelte"
import StatCard from "../lib/components/card/StatCard.svelte"
import Checkbox from "../lib/components/checkbox/Checkbox.svelte"
import CheckboxField from "../lib/components/checkbox/CheckboxField.svelte"
import CheckboxGroupField from "../lib/components/checkbox/CheckboxGroupField.svelte"
import ConfirmDialog from "../lib/components/dialog/ConfirmDialog.svelte"
import DestructiveDialog from "../lib/components/dialog/DestructiveDialog.svelte"
import Dialog from "../lib/components/dialog/Dialog.svelte"
import InfoDialog from "../lib/components/dialog/InfoDialog.svelte"
import Divider from "../lib/components/divider/Divider.svelte"
import Icon from "../lib/components/icon/Icon.svelte"
import Input from "../lib/components/input/Input.svelte"
import RichText from "../lib/components/input/RichText.svelte"
import Select from "../lib/components/input/Select.svelte"
import Textarea from "../lib/components/input/Textarea.svelte"
import ProgressBar from "../lib/components/progress-bar/ProgressBar.svelte"
import Radio from "../lib/components/radio/Radio.svelte"
import Skeleton from "../lib/components/skeleton/Skeleton.svelte"
import Slider from "../lib/components/slider/Slider.svelte"
import Spacing from "../lib/components/spacing/Spacing.svelte"
import ButtonSpinner from "../lib/components/spinner/ButtonSpinner.svelte"
import EmptyStateSpinner from "../lib/components/spinner/EmptyStateSpinner.svelte"
import Spinner from "../lib/components/spinner/Spinner.svelte"
import StatTile from "../lib/components/stat-tile/StatTile.svelte"
import Switch from "../lib/components/switch/Switch.svelte"
import ErrorToast from "../lib/components/toast/ErrorToast.svelte"
import InfoToast from "../lib/components/toast/InfoToast.svelte"
import SuccessToast from "../lib/components/toast/SuccessToast.svelte"
import Toast from "../lib/components/toast/Toast.svelte"
import ToastContainer from "../lib/components/toast/ToastContainer.svelte"
import WarningToast from "../lib/components/toast/WarningToast.svelte"
import Tooltip from "../lib/components/tooltip/Tooltip.svelte"
import TooltipGroup from "../lib/components/tooltip/TooltipGroup.svelte"
import AccordionFieldContractFixture from "./type-fixtures/AccordionFieldContractFixture.svelte"
import BadgeGroupContractFixture from "./type-fixtures/BadgeGroupContractFixture.svelte"
import CheckboxFieldContractFixture from "./type-fixtures/CheckboxFieldContractFixture.svelte"
import CheckboxGroupFieldContractFixture from "./type-fixtures/CheckboxGroupFieldContractFixture.svelte"
import DateOfBirthFieldContractFixture from "./type-fixtures/DateOfBirthFieldContractFixture.svelte"
import DialogModalContractOpenFixture from "./type-fixtures/DialogModalContractOpenFixture.svelte"
import DialogModalContractTriggerFixture from "./type-fixtures/DialogModalContractTriggerFixture.svelte"
import InputFieldContractFixture from "./type-fixtures/InputFieldContractFixture.svelte"
import InputOtpContractFixture from "./type-fixtures/InputOtpContractFixture.svelte"
import RadioGroupFieldContractFixture from "./type-fixtures/RadioGroupFieldContractFixture.svelte"
import RichTextFieldContractFixture from "./type-fixtures/RichTextFieldContractFixture.svelte"
import SelectFieldContractFixture from "./type-fixtures/SelectFieldContractFixture.svelte"
import SliderFieldContractFixture from "./type-fixtures/SliderFieldContractFixture.svelte"
import SwitchFieldContractFixture from "./type-fixtures/SwitchFieldContractFixture.svelte"
import TabGroupContractFixture from "./type-fixtures/TabGroupContractFixture.svelte"
import TextareaFieldContractFixture from "./type-fixtures/TextareaFieldContractFixture.svelte"
import ToastProviderContractFixture from "./type-fixtures/ToastProviderContractFixture.svelte"
import TypographyContractFixture from "./type-fixtures/TypographyContractFixture.svelte"
import ZipCodeFieldContractFixture from "./type-fixtures/ZipCodeFieldContractFixture.svelte"

type Props = Record<string, unknown>

function textSnippet(text: string) {
  return createRawSnippet(() => ({
    render: () => `<span>${text}</span>`,
  }))
}

function actionSnippet(text: string) {
  return createRawSnippet(() => ({
    render: () => `<button type="button">${text}</button>`,
  }))
}

function renderWithText(component: unknown, props: Props, text: string): void {
  render(component as never, {
    props: {
      ...props,
      children: textSnippet(text),
    },
  })
}

function optionCheckboxSnippet(args: {
  options: Array<{
    value: string
    label: string
    description?: string
    disabled?: boolean
    indeterminate?: boolean
  }>
  selected: string[]
  disabled?: boolean
  invalid?: boolean
  onChange?: (value: string[]) => void
}) {
  return createRawSnippet(() => ({
    render: () =>
      `<span>${args.options
        .map((option) => {
          const disabled = args.disabled || option.disabled
          const labelId = `checkbox-option-${option.value}-label`
          const descriptionId = `checkbox-option-${option.value}-description`
          const descriptionMarkup = option.description
            ? `<span class="mw-text mw-text--caption mw-checkbox-group-field__option-description" id="${descriptionId}">${option.description}</span>`
            : ""
          return `<label class="mw-checkbox-group-field__option${option.description ? " mw-checkbox-group-field__option--with-description" : ""}"><input type="checkbox" value="${option.value}" aria-labelledby="${labelId}" ${option.description ? `aria-describedby="${descriptionId}"` : ""} ${args.selected.includes(option.value) ? "checked" : ""} ${disabled ? "disabled" : ""} ${args.invalid ? 'aria-invalid="true"' : ""} data-indeterminate="${option.indeterminate ? "true" : "false"}" /> <span class="mw-checkbox-group-field__option-content"><span class="mw-text mw-text--label mw-checkbox-group-field__option-label" id="${labelId}">${option.label}</span>${descriptionMarkup}</span></label>`
        })
        .join("")}</span>`,
    setup: (element) => {
      const inputs = Array.from(element.querySelectorAll<HTMLInputElement>("input"))
      for (const input of inputs) {
        input.indeterminate = input.dataset.indeterminate === "true"
        input.addEventListener("change", () => {
          const next = inputs
            .filter((candidate) => candidate.checked)
            .map((candidate) => candidate.value)
          args.onChange?.(next)
        })
      }
    },
  }))
}

async function typeIntoTextInput(element: HTMLElement, text: string): Promise<void> {
  if (
    (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) &&
    (element.disabled || element.readOnly)
  ) {
    return
  }

  for (const character of text) {
    const input = element as HTMLInputElement | HTMLTextAreaElement
    input.value += character
    await fireEvent.input(input)
  }
}

async function dispatchKeyboard(text: string): Promise<void> {
  const keyByToken: Record<string, string> = {
    "{ArrowDown}": "ArrowDown",
    "{ArrowLeft}": "ArrowLeft",
    "{ArrowRight}": "ArrowRight",
    "{End}": "End",
    "{Enter}": "Enter",
    "{Escape}": "Escape",
    "{Home}": "Home",
  }

  const key = keyByToken[text] ?? text
  await fireEvent.keyDown(document.activeElement ?? document.body, { key })
}

runAccordionContract("svelte", {
  renderAccordion(args = {}) {
    renderWithText(
      Accordion,
      {
        title: args.title ?? "Accordion",
        ...(args.open !== undefined ? { open: args.open } : {}),
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.onToggle !== undefined ? { ontoggle: args.onToggle } : {}),
      },
      "Accordion content",
    )
  },
  renderAccordionField(args) {
    render(AccordionFieldContractFixture, {
      props: {
        label: args.label,
        items: (args.items ?? []).map((item) => ({
          ...item,
          disabled: item.disabled,
        })),
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.description !== undefined ? { description: args.description } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
        ...(args.multiple !== undefined ? { multiple: args.multiple } : {}),
        ...(args.defaultOpenItems !== undefined ? { defaultOpenItems: args.defaultOpenItems } : {}),
        ...(args.openItems !== undefined ? { openItems: args.openItems } : {}),
        ...(args.onOpenItemsChange !== undefined
          ? { onopenitemschange: args.onOpenItemsChange }
          : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getAllByRole(role) {
    return screen.getAllByRole(role)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  async click(element) {
    if (element instanceof HTMLButtonElement && element.disabled) return
    await fireEvent.click(element)
  },
})

runAvatarContract("svelte", {
  renderAvatar(args = {}) {
    render(Avatar, {
      props: {
        ...(args.size !== undefined ? { size: args.size } : {}),
        ...(args.initials !== undefined ? { initials: args.initials } : {}),
        ...(args.src !== undefined ? { src: args.src } : {}),
        ...(args.alt !== undefined ? { alt: args.alt } : {}),
        ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
        ...(args.decorative !== undefined ? { decorative: args.decorative } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryAvatarShell() {
    return document.querySelector(".mw-avatar")
  },
})

runAvatarBadgeContract("svelte", {
  renderAvatarBadge(args = {}) {
    render(AvatarBadge, {
      props: {
        ...(args.size !== undefined ? { size: args.size } : {}),
        ...(args.initials !== undefined ? { initials: args.initials } : {}),
        ...(args.decorative !== undefined ? { decorative: args.decorative } : {}),
        ...(args.statusLabel !== undefined ? { statusLabel: args.statusLabel } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryBadge() {
    return document.querySelector(".mw-avatar-badge")
  },
  queryIndicator() {
    return document.querySelector(".mw-avatar-badge__indicator")
  },
})

runAvatarGroupContract("svelte", {
  renderAvatarGroup(args = {}) {
    render(AvatarGroup, {
      props: {
        ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
        items: [
          { id: "mw", initials: "MW" },
          { id: "nk", initials: "NK" },
          { id: "as", initials: "AS" },
          { id: "guest", type: "icon", ariaLabel: "Guest member" },
        ],
        ...(args.overflowCount !== undefined ? { overflowCount: args.overflowCount } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryGroup() {
    return document.querySelector(".mw-avatar-group")
  },
  queryRenderedAvatars() {
    return document.querySelectorAll(".mw-avatar-group .mw-avatar") as NodeListOf<HTMLElement>
  },
})

runBadgeContract("svelte", {
  renderStatus() {
    renderWithText(StatusBadge, { variant: "success" }, "Active")
  },
  renderPriority() {
    renderWithText(PriorityBadge, { variant: "error" }, "Critical")
  },
  renderNotification() {
    renderWithText(NotificationBadge, { variant: "info" }, "5")
  },
  renderBadgeWithAriaLabel() {
    renderWithText(NotificationBadge, { variant: "info", ariaLabel: "5 unread messages" }, "5")
  },
  getByText(text) {
    return screen.getByText(text).closest(".mw-badge") as HTMLElement
  },
})

runBadgeGroupContract("svelte", {
  renderBadgeGroup(args = {}) {
    render(BadgeGroupContractFixture, {
      props: {
        label: args.label ?? "Tags",
        children: createRawSnippet(() => ({
          render: () =>
            `<span><span class="mw-badge">A</span><span class="mw-badge">B</span></span>`,
        })),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})

runButtonContract("svelte", {
  renderPrimary(args = {}) {
    renderWithText(
      PrimaryButton,
      {
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.loading !== undefined ? { loading: args.loading } : {}),
        ...(args.onClick !== undefined ? { onclick: args.onClick } : {}),
      },
      args.text ?? "Primary",
    )
  },
  renderLink(args) {
    renderWithText(
      LinkButton,
      {
        href: args.href,
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.onClick !== undefined ? { onclick: args.onClick } : {}),
      },
      args.text,
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  async click(element) {
    if (element instanceof HTMLInputElement && element.disabled) return
    await fireEvent.click(element)
  },
})

runButtonSemanticsContract("svelte", {
  renderSaveConfirmVerify() {
    renderWithText(SaveButton, {}, "Save")
    renderWithText(ConfirmButton, {}, "Confirm")
    renderWithText(VerifyButton, {}, "Verify")
  },
  renderLinkButton() {
    renderWithText(LinkButton, { href: "/dashboard" }, "Dashboard")
  },
  renderCancelEditCloseRefreshDestructive() {
    renderWithText(CancelButton, {}, "Cancel")
    renderWithText(EditButton, {}, "Edit")
    renderWithText(CloseButton, {}, "Close")
    renderWithText(RefreshButton, {}, "Refresh")
    renderWithText(DestructiveButton, {}, "Delete")
  },
  renderWave2Utilities() {
    renderWithText(UploadButton, {}, "Upload")
    renderWithText(DownloadButton, {}, "Download")
    renderWithText(CopyButton, {}, "Copy")
    renderWithText(SearchButton, {}, "Search")
    renderWithText(FilterButton, {}, "Filter")
    renderWithText(SortButton, {}, "Sort")
    renderWithText(DropdownButton, {}, "Dropdown")
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})

let bannerDismissHandler = { called: false }

function renderBannerContract(args: Props = {}) {
  bannerDismissHandler = { called: false }
  renderWithText(
    Banner,
    {
      ...args,
      ondismiss: () => {
        bannerDismissHandler.called = true
      },
    },
    "Banner message",
  )
}

runBannerContract("svelte", {
  renderDefault() {
    renderBannerContract()
  },
  renderInfo() {
    renderBannerContract({ variant: "info" })
  },
  renderWarning() {
    renderBannerContract({ variant: "warning" })
  },
  renderError() {
    renderBannerContract({ variant: "error" })
  },
  renderWithoutIcon() {
    renderBannerContract({ showIcon: false })
  },
  renderNonDismissible() {
    renderBannerContract({ dismissible: false })
  },
  renderWithAction() {
    renderBannerContract({ action: actionSnippet("Learn more") })
  },
  renderWithAriaLabel() {
    renderBannerContract({ ariaLabel: "Important notice" })
  },
  async clickDismiss() {
    await fireEvent.click(screen.getByRole("button", { name: /dismiss/i }))
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryByRole(role, options) {
    return screen.queryByRole(role, options)
  },
  getRoot() {
    const root = document.querySelector("[data-component='banner']")

    if (!(root instanceof HTMLElement)) {
      throw new Error("Expected banner root to exist")
    }

    return root
  },
  getDismissHandler() {
    return bannerDismissHandler
  },
})

runCardContract("svelte", {
  renderCard(args = {}) {
    renderWithText(
      Card,
      { ...(args.title !== undefined ? { title: args.title } : {}) },
      args.body ?? "",
    )
  },
  renderProductCard(args = {}) {
    renderWithText(ProductCard, {}, args.body ?? "")
  },
  renderProfileCard(args = {}) {
    renderWithText(ProfileCard, {}, args.body ?? "")
  },
  renderStatCard(args = {}) {
    renderWithText(StatCard, {}, args.body ?? "")
  },
  getCardElement() {
    return document.querySelector("[data-component='card']")
  },
  getByText(text) {
    return screen.getByText(text)
  },
})

runCheckboxContract("svelte", {
  renderCheckbox(args = {}) {
    render(Checkbox, {
      props: {
        ariaLabel: args.ariaLabel ?? "Checkbox",
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.defaultChecked !== undefined ? { defaultChecked: args.defaultChecked } : {}),
        ...(args.indeterminate !== undefined ? { indeterminate: args.indeterminate } : {}),
        ...(args.onCheckedChange !== undefined ? { oncheckedchange: args.onCheckedChange } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLInputElement
  },
  async click(element) {
    if (element instanceof HTMLInputElement && element.disabled) return
    await fireEvent.click(element)
  },
})

runCheckboxFieldContract("svelte", {
  renderCheckboxField(args) {
    render(CheckboxFieldContractFixture, {
      props: {
        label: args.label,
        ...(args.description !== undefined ? { description: args.description } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
        ...(args.checked !== undefined ? { checked: args.checked } : {}),
        ...(args.defaultChecked !== undefined ? { defaultChecked: args.defaultChecked } : {}),
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLInputElement
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryDescriptionRegion() {
    return document.querySelector(".mw-checkbox-field__description")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-checkbox-field__error")
  },
  async click(element) {
    if (element instanceof HTMLInputElement && element.disabled) return
    await fireEvent.click(element)
  },
})

runCheckboxGroupFieldContract("svelte", {
  renderCheckboxGroup(args = {}) {
    const options = args.options ?? [
      { value: "email", label: "Email" },
      { value: "sms", label: "SMS" },
      { value: "push", label: "Push" },
    ]

    render(CheckboxGroupFieldContractFixture, {
      props: {
        label: args.label ?? "Communication preferences",
        ...(args.description !== undefined ? { description: args.description } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        children: optionCheckboxSnippet({
          options,
          selected: args.value ?? args.defaultValue ?? [],
          disabled: args.disabled,
          invalid: args.error !== undefined && args.error.trim().length > 0,
          onChange: args.onChange,
        }),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getAllByRole(role) {
    return screen.getAllByRole(role) as HTMLInputElement[]
  },
  getByText(text) {
    return screen.getByText(text)
  },
  async click(element) {
    if (element instanceof HTMLInputElement && element.disabled) return
    await fireEvent.click(element)
  },
})

runDividerContract("svelte", {
  renderDivider(args = {}) {
    render(Divider, { props: args })
  },
  getByRole(role) {
    return screen.getByRole(role)
  },
})

runDialogContract("svelte", {
  renderConfirm() {
    renderWithText(
      ConfirmDialog,
      {
        open: true,
        title: "Publish update",
        description: "This notifies subscribers immediately.",
      },
      "Review the release notes before confirming.",
    )
  },
  renderDestructive() {
    renderWithText(
      DestructiveDialog,
      {
        open: true,
        title: "Delete workspace",
        description: "This cannot be undone.",
      },
      "All projects and members will be removed.",
    )
  },
  renderInfo() {
    renderWithText(
      InfoDialog,
      {
        open: true,
        title: "Maintenance notice",
        description: "The workspace will be read-only for 10 minutes.",
      },
      "Save your work before the maintenance window begins.",
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})

runDialogModalContract("svelte", {
  renderOpenDialogModal(args = {}) {
    render(DialogModalContractOpenFixture, {
      props: {
        ...(args.title !== undefined ? { title: args.title } : {}),
        ...(args.description !== undefined ? { description: args.description } : {}),
        ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
        ...(args.dismissible !== undefined ? { dismissible: args.dismissible } : {}),
        ...(args.showFooter !== undefined ? { showFooter: args.showFooter } : {}),
        ...(args.closeOnEscape !== undefined ? { closeOnEscape: args.closeOnEscape } : {}),
        ...(args.closeOnScrimClick !== undefined
          ? { closeOnScrimClick: args.closeOnScrimClick }
          : {}),
        ...(args.surfaceWidth !== undefined ? { surfaceWidth: args.surfaceWidth } : {}),
        ...(args.tone !== undefined ? { tone: args.tone } : {}),
        ...(args.divider !== undefined ? { divider: args.divider } : {}),
        ...(args.includeInput !== undefined ? { includeInput: args.includeInput } : {}),
        ...(args.onOpenChange !== undefined ? { onopenchange: args.onOpenChange } : {}),
      },
    })
  },
  renderTriggerDialogModal(args = {}) {
    render(DialogModalContractTriggerFixture, {
      props: {
        ...(args.title !== undefined ? { title: args.title } : {}),
        ...(args.description !== undefined ? { description: args.description } : {}),
        ...(args.restoreFocus !== undefined ? { restoreFocus: args.restoreFocus } : {}),
        ...(args.closeOnScrimClick !== undefined
          ? { closeOnScrimClick: args.closeOnScrimClick }
          : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryByRole(role, options) {
    return screen.queryByRole(role, options)
  },
  getScrim() {
    const scrim = document.querySelector(".mw-dialog-modal__scrim")

    if (!(scrim instanceof HTMLElement)) {
      throw new Error("Expected dialog scrim to exist")
    }

    return scrim
  },
  async click(element) {
    await fireEvent.click(element)
  },
  async tab(options) {
    const dialog = screen.getByRole("dialog")
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      ),
    )
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : dialog
    const allowed = await fireEvent.keyDown(active, {
      key: "Tab",
      shiftKey: options?.shift ?? false,
    })

    if (!allowed || focusable.length === 0) return

    const currentIndex = focusable.indexOf(active)
    const nextIndex = options?.shift
      ? currentIndex <= 0
        ? focusable.length - 1
        : currentIndex - 1
      : currentIndex < 0 || currentIndex === focusable.length - 1
        ? 0
        : currentIndex + 1
    focusable[nextIndex]?.focus()
  },
  async keyboard(text) {
    const key = text === "{Escape}" ? "Escape" : text
    const dialog = screen.queryByRole("dialog")
    const target =
      document.activeElement instanceof HTMLElement && dialog?.contains(document.activeElement)
        ? document.activeElement
        : dialog
    await fireEvent.keyDown(target ?? document.body, { key })
  },
  waitFor(assertion) {
    return waitFor(assertion)
  },
})

runHeadingContract("svelte", {
  renderHeading(args) {
    render(TypographyContractFixture, {
      props: {
        component: args.level === 1 ? "h1" : args.level === 2 ? "h2" : "h3",
        text: args.text,
        ...(args.size !== undefined ? { size: args.size } : {}),
        ...(args.id !== undefined ? { id: args.id } : {}),
        ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})

runIconContract("svelte", {
  renderIcon(args = {}) {
    render(Icon, {
      props: {
        name: "search",
        ...(args.ariaLabel !== undefined ? { "aria-label": args.ariaLabel } : {}),
        ...(args.decorative !== undefined ? { decorative: args.decorative } : {}),
        ...(args.size !== undefined ? { size: args.size } : {}),
        ...(args.strokeWidth !== undefined ? { strokeWidth: args.strokeWidth } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as SVGElement
  },
  queryByRole(role) {
    return screen.queryByRole(role) as SVGElement | null
  },
  querySvg() {
    return document.querySelector("svg")
  },
})

runInputContract("svelte", {
  renderInput(args = {}) {
    render(Input, {
      props: {
        ariaLabel: args.ariaLabel ?? "Input",
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.readOnly !== undefined ? { readOnly: args.readOnly } : {}),
        ...(args.defaultValue !== undefined ? { value: args.defaultValue } : {}),
        ...(args.onValueChange !== undefined
          ? {
              oninput: (event: Event & { currentTarget: HTMLInputElement }) =>
                args.onValueChange?.(event.currentTarget.value),
            }
          : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLInputElement
  },
  async type(element, text) {
    await typeIntoTextInput(element, text)
  },
})

runInputFieldContract("svelte", {
  renderInputField(args) {
    render(InputFieldContractFixture, {
      props: {
        label: args.label,
        input: {},
        ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      },
    })
  },
  getByLabelText(text) {
    return screen.getByLabelText(text) as HTMLInputElement
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryHelperRegion() {
    return document.querySelector(".mw-input-field__helper")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-input-field__error")
  },
})

runDateOfBirthFieldContract("svelte", {
  renderDateOfBirthField(args) {
    render(DateOfBirthFieldContractFixture, {
      props: {
        label: args.label,
        ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      },
    })
  },
  getByLabelText(text) {
    return screen.getByLabelText(text) as HTMLInputElement
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryHelperRegion() {
    return document.querySelector(".mw-input-field__helper")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-input-field__error")
  },
  queryPurposeRegion() {
    return document.querySelector("[data-purpose='date-of-birth']")
  },
})

runInputOtpContract("svelte", {
  renderInputOtp(args = {}) {
    render(InputOtpContractFixture, {
      props: {
        label: args.label ?? "Verification code",
        ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.readOnly !== undefined ? { readOnly: args.readOnly } : {}),
        ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
        ...(args.onValueChange !== undefined ? { onvaluechange: args.onValueChange } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLInputElement
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryHelperRegion() {
    return document.querySelector(".mw-input-otp__helper")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-input-otp__error")
  },
  queryOtpCells() {
    return Array.from(document.querySelectorAll(".mw-input-otp__cell")) as HTMLElement[]
  },
  async type(element, text) {
    await typeIntoTextInput(element, text)
  },
})

runParagraphContract("svelte", {
  renderParagraph(args) {
    render(TypographyContractFixture, {
      props: {
        component: "p",
        text: args.text,
        ...(args.size !== undefined ? { size: args.size } : {}),
        ...(args.id !== undefined ? { id: args.id } : {}),
      },
    })
  },
  getByText(text) {
    return screen.getByText(text)
  },
})

runProgressBarContract("svelte", {
  renderProgressBar(args = {}) {
    render(ProgressBar, { props: args })
  },
  getProgressBarElement() {
    const progressBar = document.querySelector("[data-component='progress-bar']")

    if (!(progressBar instanceof HTMLElement)) {
      throw new Error("Expected progress bar element to exist")
    }

    return progressBar
  },
})

runRadioContract("svelte", {
  renderRadio(args = {}) {
    render(Radio, {
      props: {
        ariaLabel: args.ariaLabel ?? "Radio",
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.defaultChecked !== undefined ? { checked: args.defaultChecked } : {}),
        ...(args.onCheckedChange !== undefined ? { oncheckedchange: args.onCheckedChange } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLInputElement
  },
  async click(element) {
    if (element instanceof HTMLInputElement && element.disabled) return
    await fireEvent.click(element)
  },
})

runRadioGroupFieldContract("svelte", {
  renderRadioGroup(args = {}) {
    render(RadioGroupFieldContractFixture, {
      props: {
        name: args.name ?? "radio-contract",
        label: args.label ?? "Pick one",
        ...(args.description !== undefined ? { description: args.description } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
        ...(args.value !== undefined ? { value: args.value } : {}),
        ...(args.onValueChange !== undefined ? { onchange: args.onValueChange } : {}),
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.required !== undefined ? { required: args.required } : {}),
        ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
        options: args.options ?? [],
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getAllByRole(role) {
    return screen.getAllByRole(role) as HTMLInputElement[]
  },
  getByText(text) {
    return screen.getByText(text)
  },
  async click(element) {
    if (element instanceof HTMLInputElement && element.disabled) return
    await fireEvent.click(element)
  },
})

runRichTextContract("svelte", {
  renderRichText(args = {}) {
    render(RichText, {
      props: {
        ariaLabel: args.ariaLabel ?? "Rich text",
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.readOnly !== undefined ? { readOnly: args.readOnly } : {}),
        ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
        ...(args.onValueChange !== undefined ? { onvaluechange: args.onValueChange } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLDivElement
  },
  async type(element, text) {
    if (element.getAttribute("contenteditable") === "false") return
    element.textContent = `${element.textContent ?? ""}${text}`
    await fireEvent.input(element)
  },
})

runRichTextFieldContract("svelte", {
  renderRichTextField(args) {
    render(RichTextFieldContractFixture, {
      props: {
        label: args.label,
        editor: {},
        ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLDivElement
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryHelperRegion() {
    return document.querySelector(".mw-input-field__helper")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-input-field__error")
  },
})

const defaultSelectOptions = [
  { value: "starter", label: "Starter" },
  { value: "growth", label: "Growth" },
]

runSelectContract("svelte", {
  renderSelect(args = {}) {
    render(Select, {
      props: {
        ariaLabel: args.ariaLabel ?? "Select",
        options: args.options ?? defaultSelectOptions,
        ...(args.defaultValue !== undefined ? { value: args.defaultValue } : {}),
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.required !== undefined ? { required: args.required } : {}),
        ...(args.placeholder !== undefined ? { placeholder: args.placeholder } : {}),
        ...(args.onValueChange !== undefined ? { onvaluechange: args.onValueChange } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLSelectElement
  },
  getByText(text) {
    return screen.getByText(text)
  },
  async selectOptions(element, value) {
    const select = element as HTMLSelectElement
    if (select.disabled) return
    select.value = value
    await fireEvent.change(select)
  },
})

runSelectFieldContract("svelte", {
  renderSelectField(args) {
    render(SelectFieldContractFixture, {
      props: {
        label: args.label,
        select: {
          options: defaultSelectOptions,
          ...(args.select?.native !== undefined ? { native: args.select.native } : {}),
        },
        ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryHelperRegion() {
    return document.querySelector(".mw-input-field__helper")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-input-field__error")
  },
})

runSelectComboboxContract("svelte", {
  renderCustomSelectField(args = {}) {
    render(SelectFieldContractFixture, {
      props: {
        label: args.label ?? "Country",
        select: {
          native: false,
          options: args.options ?? [
            { value: "se", label: "Sweden" },
            { value: "us", label: "United States" },
            { value: "no", label: "Norway" },
          ],
        },
        ...(args.defaultValue !== undefined ? { value: args.defaultValue } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryByRole(role, options) {
    return screen.queryByRole(role, options)
  },
  async keyboard(text) {
    await dispatchKeyboard(text)
  },
})

runSpacingContract("svelte", {
  renderSpacing(args = {}) {
    render(Spacing, { props: args })
  },
  getSpacingElement() {
    return document.querySelector("[data-component='spacing']")
  },
})

runStatTileContract("svelte", {
  renderStatTile(args = {}) {
    render(StatTile, {
      props: {
        label: args.label ?? "Monthly Revenue",
        value: args.value ?? "$48,200",
        subtitle: args.subtitle ?? "vs $42,900 last month",
        ...(args.tone !== undefined ? { tone: args.tone } : {}),
        ...(args.trendValue !== undefined ? { trendValue: args.trendValue } : {}),
        ...(args.trendDirection !== undefined ? { trendDirection: args.trendDirection } : {}),
      },
    })
  },
  getStatTileElement() {
    const tile = document.querySelector("[data-component='stat-tile']")

    if (!(tile instanceof HTMLElement)) {
      throw new Error("Expected stat tile element to exist")
    }

    return tile
  },
  getByText(text) {
    return screen.getByText(text)
  },
})

runSliderContract("svelte", {
  renderSlider(args = {}) {
    const props = {
      ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
      ...(args.min !== undefined ? { min: args.min } : {}),
      ...(args.max !== undefined ? { max: args.max } : {}),
      ...(args.step !== undefined ? { step: args.step } : {}),
      ...(args.value !== undefined ? { value: args.value } : {}),
      ...(args.defaultValue !== undefined ? { value: args.defaultValue } : {}),
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.showTooltip !== undefined ? { showTooltip: args.showTooltip } : {}),
      ...(args.ariaValueText !== undefined ? { ariaValueText: args.ariaValueText } : {}),
    }
    const result = render(Slider, {
      props: {
        ...props,
        ...(args.onValueChange !== undefined
          ? {
              onvaluechange: async (value: number) => {
                args.onValueChange?.(value)
                if (args.value !== undefined) {
                  await result.rerender(props)
                }
              },
            }
          : {}),
      },
    })
  },
  renderSliderField(args) {
    render(SliderFieldContractFixture, {
      props: {
        label: args.label,
        slider: {
          ...(args.min !== undefined ? { min: args.min } : {}),
          ...(args.max !== undefined ? { max: args.max } : {}),
          ...(args.step !== undefined ? { step: args.step } : {}),
          ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
          ...(args.showTooltip !== undefined ? { showTooltip: args.showTooltip } : {}),
          ...(args.ariaValueText !== undefined ? { ariaValueText: args.ariaValueText } : {}),
          ...(args.onValueChange !== undefined ? { onvaluechange: args.onValueChange } : {}),
        },
        ...(args.value !== undefined ? { value: args.value } : {}),
        ...(args.defaultValue !== undefined ? { value: args.defaultValue } : {}),
        ...(args.description !== undefined ? { description: args.description } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryDescriptionRegion() {
    return document.querySelector(".mw-slider-field__description")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-slider-field__error")
  },
  async changeValue(element, nextValue) {
    const slider = element as HTMLInputElement
    if (slider.disabled) return
    slider.value = nextValue
    await fireEvent.input(slider)
  },
})

runSwitchContract("svelte", {
  renderSwitch(args = {}) {
    render(Switch, {
      props: {
        ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
        ...(args.checked !== undefined ? { checked: args.checked } : {}),
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.onCheckedChange !== undefined ? { oncheckedchange: args.onCheckedChange } : {}),
      },
    })
  },
  renderSwitchField(args) {
    render(SwitchFieldContractFixture, {
      props: {
        label: args.label,
        switch: {
          ...(args.checked !== undefined ? { checked: args.checked } : {}),
          ...(args.onCheckedChange !== undefined ? { oncheckedchange: args.onCheckedChange } : {}),
        },
        ...(args.description !== undefined ? { description: args.description } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryDescriptionRegion() {
    return document.querySelector(".mw-switch-field__description")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-switch-field__error")
  },
  async click(element) {
    if (element instanceof HTMLButtonElement && element.disabled) return
    await fireEvent.click(element)
  },
})

runTabContract("svelte", {
  renderTabGroup(args = {}) {
    render(TabGroupContractFixture, {
      props: {
        ...(args.label !== undefined ? { label: args.label } : {}),
        ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
        tabs: args.tabs ?? [
          { value: "overview", label: "Overview", panel: "Overview panel" },
          { value: "analytics", label: "Analytics", panel: "Analytics panel", disabled: true },
          { value: "settings", label: "Settings", panel: "Settings panel" },
        ],
        ...(args.defaultActiveTab !== undefined ? { defaultActiveTab: args.defaultActiveTab } : {}),
        ...(args.activeTab !== undefined ? { activeTab: args.activeTab } : {}),
        ...(args.onActiveTabChange !== undefined
          ? { onactivetabchange: args.onActiveTabChange }
          : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  async click(element) {
    await fireEvent.click(element)
  },
  async keyboard(text) {
    await dispatchKeyboard(text)
  },
})

runTextareaContract("svelte", {
  renderTextarea(args = {}) {
    render(Textarea, {
      props: {
        ariaLabel: args.ariaLabel ?? "Textarea",
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.readOnly !== undefined ? { readOnly: args.readOnly } : {}),
        ...(args.defaultValue !== undefined ? { value: args.defaultValue } : {}),
        ...(args.onValueChange !== undefined
          ? {
              oninput: (event: Event & { currentTarget: HTMLTextAreaElement }) =>
                args.onValueChange?.(event.currentTarget.value),
            }
          : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLTextAreaElement
  },
  async type(element, text) {
    await typeIntoTextInput(element, text)
  },
})

runTextareaFieldContract("svelte", {
  renderTextareaField(args) {
    render(TextareaFieldContractFixture, {
      props: {
        label: args.label,
        textarea: {},
        ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
        ...(args.counterText !== undefined ? { counterText: args.counterText } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      },
    })
  },
  getByLabelText(text) {
    return screen.getByLabelText(text) as HTMLTextAreaElement
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryHelperRegion() {
    return document.querySelector(".mw-input-field__helper")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-input-field__error")
  },
})

runZipCodeFieldContract("svelte", {
  renderZipCodeField(args) {
    render(ZipCodeFieldContractFixture, {
      props: {
        label: args.label,
        input: {},
        ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      },
    })
  },
  getByLabelText(text) {
    return screen.getByLabelText(text) as HTMLInputElement
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryHelperRegion() {
    return document.querySelector(".mw-input-field__helper")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-input-field__error")
  },
  queryPurposeRegion() {
    return document.querySelector("[data-purpose='zip-code']")
  },
})

runToastContract("svelte", {
  renderRawToast(args = {}) {
    renderWithText(
      Toast,
      {
        ...(args.ariaLive !== undefined ? { ariaLive: args.ariaLive } : {}),
        ...(args.dismissible ? { ondismiss: () => {} } : {}),
      },
      args.children ?? "Project saved.",
    )
  },
  renderSuccess() {
    renderWithText(SuccessToast, {}, "Saved successfully.")
  },
  renderError() {
    renderWithText(ErrorToast, {}, "Publishing failed.")
  },
  renderWarning() {
    renderWithText(WarningToast, {}, "Storage is almost full.")
  },
  renderInfo() {
    renderWithText(InfoToast, {}, "New release notes are available.")
  },
  renderContainer(args) {
    render(ToastContainer, {
      props: {
        toasts: args.toasts.map((toast) => ({
          id: toast.id,
          message: toast.children,
          ...(toast.intent !== undefined ? { intent: toast.intent } : {}),
          ...(toast.duration !== undefined ? { duration: toast.duration } : {}),
        })),
        ...(args.maxVisible !== undefined ? { maxVisible: args.maxVisible } : {}),
        ...(args.onDismiss !== undefined ? { ondismiss: args.onDismiss } : {}),
      },
    })
  },
  renderProvider(args) {
    render(ToastProviderContractFixture, {
      props: {
        toast: args.toast,
        ...(args.defaultDuration !== undefined ? { defaultDuration: args.defaultDuration } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryByText(text) {
    return screen.queryByText(text)
  },
  getContainerItemByText(text) {
    const item = screen.getByText(text).closest(".mw-toast-container__item")

    if (!(item instanceof HTMLElement)) {
      throw new Error(`Toast container item not found for text: ${text}`)
    }

    return item
  },
  async click(element) {
    await fireEvent.click(element)
  },
  async hover(element) {
    await fireEvent.mouseEnter(element)
  },
  async unhover(element) {
    await fireEvent.mouseLeave(element)
  },
  async focus(element) {
    element.focus()
    await fireEvent.focusIn(element)
  },
  async blur(element) {
    await fireEvent.focusOut(element, { relatedTarget: document.body })
    document.body.focus()
  },
  advanceTime(ms) {
    vi.advanceTimersByTime(ms)
  },
})

runTooltipContract("svelte", {
  renderTooltip(args = {}) {
    renderWithText(
      Tooltip,
      { ...(args.id !== undefined ? { id: args.id } : {}) },
      args.children ?? "Tooltip",
    )
  },
  renderTooltipGroup(args = {}) {
    render(TooltipGroup, {
      props: {
        content: args.content ?? "Helpful billing context",
        ...(args.triggerLabel !== undefined ? { triggerLabel: args.triggerLabel } : {}),
        ...(args.open !== undefined ? { open: args.open } : {}),
        ...(args.defaultOpen !== undefined ? { defaultOpen: args.defaultOpen } : {}),
        ...(args.onOpenChange !== undefined ? { onopenchange: args.onOpenChange } : {}),
        ...(args.tooltipId !== undefined ? { tooltipId: args.tooltipId } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryByRole(role, options) {
    return screen.queryByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  async hover(element) {
    await fireEvent.mouseEnter(element.closest(".mw-tooltip-group") ?? element)
  },
  async unhover(element) {
    await fireEvent.mouseLeave(element.closest(".mw-tooltip-group") ?? element)
  },
  async click(element) {
    await fireEvent.click(element)
    if (element instanceof HTMLElement) {
      element.focus()
      const group = element.closest(".mw-tooltip-group")
      if (group) {
        await fireEvent.focusIn(group, { relatedTarget: document.body })
      }
    }
  },
  async tab() {
    const active = document.activeElement
    if (active instanceof HTMLElement && active.matches("button")) {
      const group = active.closest(".mw-tooltip-group")
      if (group) {
        await fireEvent.focusOut(group, { relatedTarget: document.body })
      }
      await fireEvent.blur(active, { relatedTarget: document.body })
      document.body.focus()
      return
    }

    const firstButton = document.querySelector<HTMLElement>("button")
    firstButton?.focus()
    if (firstButton) {
      const group = firstButton.closest(".mw-tooltip-group")
      if (group) {
        await fireEvent.focusIn(group, { relatedTarget: document.body })
      }
      await fireEvent.focus(firstButton)
    }
  },
  async keyboard(text) {
    await dispatchKeyboard(text)
  },
})

runSkeletonContract("svelte", {
  renderSkeleton(args = {}) {
    render(Skeleton, { props: args })
  },
  getSkeletonElement() {
    return document.querySelector("[data-component='skeleton']") as HTMLElement
  },
  getByRole(role) {
    return screen.getByRole(role)
  },
})

runSpinnerContract("svelte", {
  renderSpinner(args = {}) {
    render(Spinner, { props: args })
  },
  getSpinnerElement() {
    return document.querySelector("[data-component='spinner']") as HTMLElement
  },
  getByRole(role) {
    return screen.getByRole(role)
  },
})

runSpinnerVariantsContract("svelte", {
  renderButtonSpinner() {
    render(ButtonSpinner, { props: { ariaLabel: "Loading action", decorative: false } })
  },
  renderEmptyStateSpinner() {
    render(EmptyStateSpinner, { props: { ariaLabel: "Loading dashboard", decorative: false } })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})
