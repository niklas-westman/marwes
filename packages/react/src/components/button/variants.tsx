import {
  ButtonAction,
  ButtonVariant,
  IconName,
  createPurposeSemanticAttributes,
} from "@marwes-ui/core"
import { Button, type ButtonProps } from "./button"

type PurposeButtonForbiddenProp = "variant" | "action" | "as"
type ButtonPropKey = keyof ButtonProps

function isDevelopmentEnvironment(): boolean {
  const nodeProcess = (
    globalThis as unknown as {
      process?: { env?: Record<string, string | undefined> }
    }
  ).process

  const nodeEnv = nodeProcess?.env?.NODE_ENV
  if (nodeEnv) {
    return nodeEnv !== "production"
  }

  const meta = import.meta as unknown as {
    env?: { MODE?: string; PROD?: boolean }
  }

  if (typeof meta.env?.PROD === "boolean") {
    return !meta.env.PROD
  }

  if (meta.env?.MODE) {
    return meta.env.MODE !== "production"
  }

  return true
}

function warnForForbiddenPurposeProps(
  componentName: string,
  rawProps: Partial<ButtonProps>,
  forbiddenProps: readonly PurposeButtonForbiddenProp[],
): void {
  if (!isDevelopmentEnvironment()) {
    return
  }

  const warningByProp: Record<PurposeButtonForbiddenProp, string> = {
    variant: "Use Button if you need a custom visual treatment.",
    action: "Use Button if you need a custom semantic action.",
    as: "Use Button if you need a custom element mode.",
  }

  for (const forbiddenProp of forbiddenProps) {
    if (!Object.prototype.hasOwnProperty.call(rawProps, forbiddenProp)) {
      continue
    }

    console.warn(
      `[marwes] ${componentName} does not support \`${forbiddenProp}\`. ${warningByProp[forbiddenProp]}`,
    )
  }
}

function omitButtonProps(
  rawProps: Partial<ButtonProps>,
  omittedKeys: readonly ButtonPropKey[],
): ButtonProps {
  const forwardedProps: Partial<ButtonProps> = { ...rawProps }

  for (const omittedKey of omittedKeys) {
    delete forwardedProps[omittedKey]
  }

  return forwardedProps as ButtonProps
}

function createPurposeButtonDataAttributes(
  purpose: Parameters<typeof createPurposeSemanticAttributes>[0],
  existingDataAttributes: ButtonProps["dataAttributes"],
  localDataAttributes: ButtonProps["dataAttributes"] = {},
): Record<string, string | boolean | undefined> {
  return {
    ...existingDataAttributes,
    ...createPurposeSemanticAttributes(purpose),
    ...localDataAttributes,
  }
}

/**
 * Purpose Components — Button
 *
 * Pre-configured button compositions that encode a specific semantic purpose.
 * Purpose buttons lock semantic intent and canonical visual treatment.
 */

// ============================================================================
// DESTRUCTIVE BUTTON - Destructive Actions
// ============================================================================

export type DestructiveButtonProps = Omit<ButtonProps, "variant" | "action" | "as" | "href"> & {
  /**
   * Override automatic confirmation requirement.
   * Defaults to `true` for destructive actions.
   */
  confirmation?: boolean
}

export function DestructiveButton(props: DestructiveButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("DestructiveButton", rawProps, ["variant", "action", "as"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action", "as", "href"])
  const confirmation = props.confirmation ?? true

  return (
    <Button
      {...forwardedProps}
      as="button"
      variant={ButtonVariant.primary}
      action={ButtonAction.delete}
      error
      confirmation={confirmation}
      dataAttributes={createPurposeButtonDataAttributes(
        "destructive",
        forwardedProps.dataAttributes,
        {
          "data-confirmation-required": confirmation ? "true" : "false",
        },
      )}
    />
  )
}

// ============================================================================
// CREATE BUTTON - Creation Actions
// ============================================================================

export type CreateButtonProps = Omit<ButtonProps, "variant" | "action">

export function CreateButton(props: CreateButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("CreateButton", rawProps, ["variant", "action"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action"])

  return (
    <Button
      {...forwardedProps}
      action={ButtonAction.create}
      variant={ButtonVariant.primary}
      dataAttributes={createPurposeButtonDataAttributes("create", forwardedProps.dataAttributes, {
        "data-creative": "true",
      })}
    />
  )
}

// ============================================================================
// SUBMIT BUTTON - Form Submissions
// ============================================================================

export type SubmitButtonProps = Omit<ButtonProps, "variant" | "action" | "as" | "href">

export function SubmitButton(props: SubmitButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("SubmitButton", rawProps, ["variant", "action", "as"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action", "as", "href"])

  return (
    <Button
      {...forwardedProps}
      as="button"
      action={ButtonAction.submit}
      variant={ButtonVariant.primary}
      dataAttributes={createPurposeButtonDataAttributes("submit", forwardedProps.dataAttributes)}
    />
  )
}

// ============================================================================
// CANCEL BUTTON - Cancel/Reset Actions
// ============================================================================

export type CancelButtonProps = Omit<ButtonProps, "variant" | "action">

export function CancelButton(props: CancelButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("CancelButton", rawProps, ["variant", "action"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action"])

  return (
    <Button
      {...forwardedProps}
      action={ButtonAction.cancel}
      variant={ButtonVariant.neutral}
      dataAttributes={createPurposeButtonDataAttributes("cancel", forwardedProps.dataAttributes, {
        "data-cancel": "true",
      })}
    />
  )
}

// ============================================================================
// LINK BUTTON - Navigation Actions
// ============================================================================

export type LinkButtonProps = Omit<ButtonProps, "variant" | "action" | "as"> & {
  href: string
}

export function LinkButton(props: LinkButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("LinkButton", rawProps, ["variant", "action", "as"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action", "as"])

  return (
    <Button
      {...forwardedProps}
      as="a"
      action={ButtonAction.navigate}
      variant={ButtonVariant.text}
      dataAttributes={createPurposeButtonDataAttributes(
        "navigation",
        forwardedProps.dataAttributes,
        {
          "data-navigation": "true",
        },
      )}
    />
  )
}

// ============================================================================
// SAVE BUTTON - Save/Persist Actions
// ============================================================================

export type SaveButtonProps = Omit<ButtonProps, "variant" | "action">

export function SaveButton(props: SaveButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("SaveButton", rawProps, ["variant", "action"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action"])

  return (
    <Button
      {...forwardedProps}
      action={ButtonAction.submit}
      variant={ButtonVariant.primary}
      dataAttributes={createPurposeButtonDataAttributes("save", forwardedProps.dataAttributes, {
        "data-persist": "true",
      })}
    />
  )
}

// ============================================================================
// CONFIRM BUTTON - Positive Confirmation Actions
// ============================================================================

export type ConfirmButtonProps = Omit<ButtonProps, "variant" | "action" | "as" | "href">

export function ConfirmButton(props: ConfirmButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("ConfirmButton", rawProps, ["variant", "action", "as"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action", "as", "href"])

  return (
    <Button
      {...forwardedProps}
      as="button"
      action={ButtonAction.button}
      variant={ButtonVariant.success}
      dataAttributes={createPurposeButtonDataAttributes("confirm", forwardedProps.dataAttributes)}
    />
  )
}

// ============================================================================
// VERIFY BUTTON - Positive Verification Actions
// ============================================================================

export type VerifyButtonProps = Omit<ButtonProps, "variant" | "action" | "as" | "href">

export function VerifyButton(props: VerifyButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("VerifyButton", rawProps, ["variant", "action", "as"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action", "as", "href"])

  return (
    <Button
      {...forwardedProps}
      as="button"
      action={ButtonAction.button}
      variant={ButtonVariant.secondary}
      iconRight={forwardedProps.iconRight ?? IconName.CheckCircle}
      dataAttributes={createPurposeButtonDataAttributes("verify", forwardedProps.dataAttributes, {
        "data-verification": "true",
      })}
    />
  )
}

// ============================================================================
// EDIT BUTTON - Edit/Modify Actions
// ============================================================================

export type EditButtonProps = Omit<ButtonProps, "variant" | "action">

export function EditButton(props: EditButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("EditButton", rawProps, ["variant", "action"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action"])

  return (
    <Button
      {...forwardedProps}
      action={ButtonAction.edit}
      variant={ButtonVariant.secondary}
      iconRight={forwardedProps.iconRight ?? IconName.Edit}
      dataAttributes={createPurposeButtonDataAttributes("edit", forwardedProps.dataAttributes, {
        "data-edit": "true",
      })}
    />
  )
}

// ============================================================================
// CLOSE BUTTON - Close/Dismiss Actions
// ============================================================================

export type CloseButtonProps = Omit<ButtonProps, "variant" | "action">

export function CloseButton(props: CloseButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("CloseButton", rawProps, ["variant", "action"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action"])

  return (
    <Button
      {...forwardedProps}
      action={ButtonAction.cancel}
      variant={ButtonVariant.neutral}
      dataAttributes={createPurposeButtonDataAttributes("close", forwardedProps.dataAttributes, {
        "data-close": "true",
      })}
    />
  )
}

// ============================================================================
// REFRESH BUTTON - Refresh/Reload Actions
// ============================================================================

export type RefreshButtonProps = Omit<ButtonProps, "variant" | "action">

export function RefreshButton(props: RefreshButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("RefreshButton", rawProps, ["variant", "action"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action"])

  return (
    <Button
      {...forwardedProps}
      action={ButtonAction.button}
      variant={ButtonVariant.neutral}
      iconRight={forwardedProps.iconRight ?? IconName.RefreshCw}
      dataAttributes={createPurposeButtonDataAttributes("refresh", forwardedProps.dataAttributes, {
        "data-refresh": "true",
      })}
    />
  )
}

// ============================================================================
// WAVE 2 UTILITY BUTTONS - Upload/Download/Search Utilities
// ============================================================================

export type UploadButtonProps = Omit<ButtonProps, "variant" | "action">

export function UploadButton(props: UploadButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("UploadButton", rawProps, ["variant", "action"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action"])

  return (
    <Button
      {...forwardedProps}
      action={ButtonAction.button}
      variant={ButtonVariant.secondary}
      iconRight={forwardedProps.iconRight ?? IconName.Upload}
      dataAttributes={createPurposeButtonDataAttributes("upload", forwardedProps.dataAttributes, {
        "data-transfer": "upload",
      })}
    />
  )
}

export type DownloadButtonProps = Omit<ButtonProps, "variant" | "action">

export function DownloadButton(props: DownloadButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("DownloadButton", rawProps, ["variant", "action"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action"])

  return (
    <Button
      {...forwardedProps}
      action={ButtonAction.button}
      variant={ButtonVariant.secondary}
      iconRight={forwardedProps.iconRight ?? IconName.Download}
      dataAttributes={createPurposeButtonDataAttributes("download", forwardedProps.dataAttributes, {
        "data-transfer": "download",
      })}
    />
  )
}

export type CopyButtonProps = Omit<ButtonProps, "variant" | "action">

export function CopyButton(props: CopyButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("CopyButton", rawProps, ["variant", "action"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action"])

  return (
    <Button
      {...forwardedProps}
      action={ButtonAction.button}
      variant={ButtonVariant.neutral}
      dataAttributes={createPurposeButtonDataAttributes("copy", forwardedProps.dataAttributes, {
        "data-copy": "true",
      })}
    />
  )
}

export type SearchButtonProps = Omit<ButtonProps, "variant" | "action">

export function SearchButton(props: SearchButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("SearchButton", rawProps, ["variant", "action"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action"])

  return (
    <Button
      {...forwardedProps}
      action={ButtonAction.button}
      variant={ButtonVariant.primary}
      iconRight={forwardedProps.iconRight ?? IconName.Search}
      dataAttributes={createPurposeButtonDataAttributes("search", forwardedProps.dataAttributes, {
        "data-search": "true",
      })}
    />
  )
}

export type FilterButtonProps = Omit<ButtonProps, "variant" | "action">

export function FilterButton(props: FilterButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("FilterButton", rawProps, ["variant", "action"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action"])

  return (
    <Button
      {...forwardedProps}
      action={ButtonAction.button}
      variant={ButtonVariant.neutral}
      dataAttributes={createPurposeButtonDataAttributes("filter", forwardedProps.dataAttributes, {
        "data-filter": "true",
      })}
    />
  )
}

export type SortButtonProps = Omit<ButtonProps, "variant" | "action">

export function SortButton(props: SortButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("SortButton", rawProps, ["variant", "action"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action"])

  return (
    <Button
      {...forwardedProps}
      action={ButtonAction.button}
      variant={ButtonVariant.neutral}
      dataAttributes={createPurposeButtonDataAttributes("sort", forwardedProps.dataAttributes, {
        "data-sort": "true",
      })}
    />
  )
}

export type DropdownButtonProps = Omit<ButtonProps, "variant" | "action">

export function DropdownButton(props: DropdownButtonProps) {
  const rawProps = props as ButtonProps

  warnForForbiddenPurposeProps("DropdownButton", rawProps, ["variant", "action"])

  const forwardedProps = omitButtonProps(rawProps, ["variant", "action"])

  return (
    <Button
      {...forwardedProps}
      action={ButtonAction.button}
      variant={ButtonVariant.secondary}
      iconRight={forwardedProps.iconRight ?? IconName.ChevronDown}
      dataAttributes={createPurposeButtonDataAttributes("dropdown", forwardedProps.dataAttributes, {
        "data-dropdown": "true",
      })}
    />
  )
}

// ============================================================================
// PRIMARY BUTTON - General Actions
// ============================================================================

export type PrimaryButtonProps = Omit<ButtonProps, "variant" | "as"> & {}

export function PrimaryButton(props: PrimaryButtonProps) {
  return <Button {...props} variant="primary" as="button" />
}

// ============================================================================
// SECONDARY BUTTON - General Actions
// ============================================================================

export type SecondaryButtonProps = Omit<ButtonProps, "variant" | "as"> & {}

export function SecondaryButton(props: SecondaryButtonProps) {
  return <Button {...props} variant="secondary" as="button" />
}

// ============================================================================
// TEXT BUTTON - General Actions
// ============================================================================

export type TextButtonProps = Omit<ButtonProps, "variant" | "as"> & {}

export function TextButton(props: TextButtonProps) {
  return <Button {...props} variant="text" as="button" />
}

// ============================================================================
// SUCCESS BUTTON - Positive Confirmation Actions
// ============================================================================

export type SuccessButtonProps = Omit<ButtonProps, "variant" | "as"> & {}

export function SuccessButton(props: SuccessButtonProps) {
  return (
    <Button
      {...props}
      variant="success"
      as="button"
      dataAttributes={createPurposeButtonDataAttributes("success", props.dataAttributes)}
    />
  )
}
