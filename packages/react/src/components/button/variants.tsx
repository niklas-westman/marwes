import { ButtonAction, ButtonVariant, IconName } from "@marwes-ui/core"
import { Button, type ButtonProps } from "./button"

/**
 * Purpose Components — Button
 *
 * Pre-configured button compositions that encode a specific semantic purpose.
 * Each sets `data-purpose` for machine-readable intent while keeping the
 * visual `variant` prop for presentation only.
 */

// ============================================================================
// DANGER BUTTON - Destructive Actions
// ============================================================================

export type DangerButtonProps = Omit<ButtonProps, "variant" | "action"> & {
  /**
   * Override automatic confirmation requirement.
   * Defaults to `true` for destructive actions.
   */
  confirmation?: boolean
}

/**
 * DangerButton - For destructive actions like delete, remove, or irreversible operations.
 *
 * **AI Context:**
 * - Sets `variant="primary"` with error state for visual warning
 * - Sets `action="delete"` to indicate destructive behavior
 * - Enables confirmation by default
 * - Adds `data-destructive="true"` for AI parsing
 *
 * @example
 * ```tsx
 * import { DangerButton } from "@marwes-ui/react";
 *
 * export function Example() {
 *   return <DangerButton onClick={deleteProject}>Delete Project</DangerButton>;
 * }
 * ```
 */
export function DangerButton(props: DangerButtonProps) {
  const { confirmation = true, ...restProps } = props

  return (
    <Button
      {...restProps}
      variant={ButtonVariant.primary}
      action={ButtonAction.delete}
      error
      confirmation={confirmation}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "destructive",
        "data-destructive": "true",
        "data-confirmation-required": confirmation ? "true" : "false",
      }}
    />
  )
}

// ============================================================================
// CREATE BUTTON - Creation Actions
// ============================================================================

export type CreateButtonProps = Omit<ButtonProps, "action">

/**
 * CreateButton - For creation actions like adding new items or entities.
 *
 * **AI Context:**
 * - Sets `action="create"` to indicate creation behavior
 * - Uses primary tone by default
 * - Adds `data-creative="true"` for AI parsing
 *
 * @example
 * ```tsx
 * <CreateButton onClick={createProject}>
 *   New Project
 * </CreateButton>
 * ```
 */
export function CreateButton(props: CreateButtonProps) {
  return (
    <Button
      {...props}
      action="create"
      variant={props.variant ?? "primary"}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "create",
        "data-creative": "true",
      }}
    />
  )
}

// ============================================================================
// SUBMIT BUTTON - Form Submissions
// ============================================================================

export type SubmitButtonProps = Omit<ButtonProps, "action" | "as">

/**
 * SubmitButton - For form submissions.
 *
 * **AI Context:**
 * - Sets `action="submit"` and `type="submit"`
 * - Adds `data-context="form-submit"` for AI parsing
 * - Automatically uses button element (not anchor)
 *
 * @example
 * ```tsx
 * <SubmitButton>Submit</SubmitButton>
 * ```
 */
export function SubmitButton(props: SubmitButtonProps) {
  return (
    <Button
      {...props}
      as="button"
      action="submit"
      dataAttributes={{
        "data-purpose": "submit",
        "data-context": "form-submit",
        ...props.dataAttributes,
      }}
    />
  )
}

// ============================================================================
// CANCEL BUTTON - Cancel/Reset Actions
// ============================================================================

export type CancelButtonProps = Omit<ButtonProps, "action">

/**
 * CancelButton - For cancel or reset actions.
 *
 * **AI Context:**
 * - Sets `action="cancel"` to indicate cancellation
 * - Uses secondary variant by default
 * - Adds `data-cancel="true"` for AI parsing
 *
 * @example
 * ```tsx
 * <CancelButton onClick={handleCancel}>
 *   Cancel
 * </CancelButton>
 * ```
 */
export function CancelButton(props: CancelButtonProps) {
  return (
    <Button
      {...props}
      action="cancel"
      variant={props.variant ?? "neutral"}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "cancel",
        "data-cancel": "true",
      }}
    />
  )
}

// ============================================================================
// LINK BUTTON - Navigation Actions
// ============================================================================

export type LinkButtonProps = Omit<ButtonProps, "action" | "as"> & {
  /**
   * The URL to navigate to. Required for LinkButton.
   */
  href: string
}

/**
 * LinkButton - For navigation actions that look like buttons.
 *
 * **AI Context:**
 * - Sets `action="navigate"` to indicate navigation
 * - Uses anchor element with button styling
 * - Adds `data-navigation="true"` for AI parsing
 *
 * @example
 * ```tsx
 * <LinkButton href="/dashboard">
 *   Go to Dashboard
 * </LinkButton>
 * ```
 */
export function LinkButton(props: LinkButtonProps) {
  return (
    <Button
      {...props}
      as="a"
      action="navigate"
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "navigation",
        "data-navigation": "true",
      }}
    />
  )
}

// ============================================================================
// SAVE BUTTON - Save/Persist Actions
// ============================================================================

export type SaveButtonProps = Omit<ButtonProps, "action">

/**
 * SaveButton - For save or persist actions.
 */
export function SaveButton(props: SaveButtonProps) {
  return (
    <Button
      {...props}
      action={ButtonAction.submit}
      variant={props.variant ?? ButtonVariant.primary}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "save",
        "data-persist": "true",
      }}
    />
  )
}

// ============================================================================
// CONFIRM BUTTON - Positive Confirmation Actions
// ============================================================================

export type ConfirmButtonProps = Omit<ButtonProps, "variant" | "action" | "as">

/**
 * ConfirmButton - For affirmative confirmation actions.
 */
export function ConfirmButton(props: ConfirmButtonProps) {
  return (
    <Button
      {...props}
      variant={ButtonVariant.success}
      as="button"
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "confirm",
        "data-outcome": "positive",
      }}
    />
  )
}

// ============================================================================
// VERIFY BUTTON - Positive Verification Actions
// ============================================================================

export type VerifyButtonProps = Omit<ButtonProps, "variant" | "action" | "as">

/**
 * VerifyButton - For verification or approval actions.
 */
export function VerifyButton(props: VerifyButtonProps) {
  return (
    <Button
      {...props}
      variant={ButtonVariant.secondary}
      as="button"
      iconRight={props.iconRight ?? IconName.CheckCircle}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "verify",
        "data-outcome": "positive",
        "data-verification": "true",
      }}
    />
  )
}

// ============================================================================
// EDIT BUTTON - Edit/Modify Actions
// ============================================================================

export type EditButtonProps = Omit<ButtonProps, "action">

/**
 * EditButton - For edit or update flows.
 */
export function EditButton(props: EditButtonProps) {
  return (
    <Button
      {...props}
      action={ButtonAction.edit}
      variant={props.variant ?? ButtonVariant.secondary}
      iconRight={props.iconRight ?? IconName.Edit}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "edit",
        "data-edit": "true",
      }}
    />
  )
}

// ============================================================================
// CLOSE BUTTON - Close/Dismiss Actions
// ============================================================================

export type CloseButtonProps = Omit<ButtonProps, "action">

/**
 * CloseButton - For close or dismiss actions.
 */
export function CloseButton(props: CloseButtonProps) {
  return (
    <Button
      {...props}
      action={ButtonAction.cancel}
      variant={props.variant ?? ButtonVariant.neutral}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "close",
        "data-close": "true",
      }}
    />
  )
}

// ============================================================================
// REFRESH BUTTON - Refresh/Reload Actions
// ============================================================================

export type RefreshButtonProps = Omit<ButtonProps, "action">

/**
 * RefreshButton - For reload or refresh actions.
 */
export function RefreshButton(props: RefreshButtonProps) {
  return (
    <Button
      {...props}
      variant={props.variant ?? ButtonVariant.neutral}
      iconRight={props.iconRight ?? IconName.RefreshCw}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "refresh",
        "data-refresh": "true",
      }}
    />
  )
}

// ============================================================================
// WAVE 2 UTILITY BUTTONS - Upload/Download/Search Utilities
// ============================================================================

export type UploadButtonProps = Omit<ButtonProps, "action">

/**
 * UploadButton - For upload or import actions.
 */
export function UploadButton(props: UploadButtonProps) {
  return (
    <Button
      {...props}
      variant={props.variant ?? ButtonVariant.secondary}
      iconRight={props.iconRight ?? IconName.Upload}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "upload",
        "data-transfer": "upload",
      }}
    />
  )
}

export type DownloadButtonProps = Omit<ButtonProps, "action">

/**
 * DownloadButton - For export or download actions.
 */
export function DownloadButton(props: DownloadButtonProps) {
  return (
    <Button
      {...props}
      variant={props.variant ?? ButtonVariant.secondary}
      iconRight={props.iconRight ?? IconName.Download}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "download",
        "data-transfer": "download",
      }}
    />
  )
}

export type CopyButtonProps = Omit<ButtonProps, "action">

/**
 * CopyButton - For copy-to-clipboard or duplication flows.
 */
export function CopyButton(props: CopyButtonProps) {
  return (
    <Button
      {...props}
      variant={props.variant ?? ButtonVariant.neutral}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "copy",
        "data-copy": "true",
      }}
    />
  )
}

export type SearchButtonProps = Omit<ButtonProps, "action">

/**
 * SearchButton - For explicit search triggers.
 */
export function SearchButton(props: SearchButtonProps) {
  return (
    <Button
      {...props}
      variant={props.variant ?? ButtonVariant.primary}
      iconRight={props.iconRight ?? IconName.Search}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "search",
        "data-search": "true",
      }}
    />
  )
}

export type FilterButtonProps = Omit<ButtonProps, "action">

/**
 * FilterButton - For filter panels and query refinement.
 */
export function FilterButton(props: FilterButtonProps) {
  return (
    <Button
      {...props}
      variant={props.variant ?? ButtonVariant.neutral}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "filter",
        "data-filter": "true",
      }}
    />
  )
}

export type SortButtonProps = Omit<ButtonProps, "action">

/**
 * SortButton - For sort controls or ordering changes.
 */
export function SortButton(props: SortButtonProps) {
  return (
    <Button
      {...props}
      variant={props.variant ?? ButtonVariant.neutral}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "sort",
        "data-sort": "true",
      }}
    />
  )
}

export type DropdownButtonProps = Omit<ButtonProps, "action">

/**
 * DropdownButton - For disclosure-style action menus.
 */
export function DropdownButton(props: DropdownButtonProps) {
  return (
    <Button
      {...props}
      variant={props.variant ?? ButtonVariant.secondary}
      iconRight={props.iconRight ?? IconName.ChevronDown}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "dropdown",
        "data-dropdown": "true",
      }}
    />
  )
}

// ============================================================================
// PRIMARY BUTTON - General Actions
// ============================================================================

export type PrimaryButtonProps = Omit<ButtonProps, "variant" | "as"> & {}

/**
 * PrimaryButton - For general use when no specific semantic variant fits.
 *
 * @example
 * ```tsx
 * <PrimaryButton onClick={handlePrimaryAction}>
 *   Do something important
 * </PrimaryButton>
 * ```
 */
export function PrimaryButton(props: PrimaryButtonProps) {
  return <Button {...props} variant="primary" as="button" />
}

// ============================================================================
// SECONDARY BUTTON - General Actions
// ============================================================================

export type SecondaryButtonProps = Omit<ButtonProps, "variant" | "as"> & {}

/**
 * SecondaryButton - For general use when no specific semantic variant fits.
 *
 * @example
 * ```tsx
 * <SecondaryButton onClick={handleSecondaryAction}>
 *   Do something important
 * </SecondaryButton>
 * ```
 */
export function SecondaryButton(props: SecondaryButtonProps) {
  return <Button {...props} variant="secondary" as="button" />
}

// ============================================================================
// TEXT BUTTON - General Actions
// ============================================================================

export type TextButtonProps = Omit<ButtonProps, "variant" | "as"> & {}

/**
 * TextButton - For general use when no specific semantic variant fits.
 *
 * @example
 * ```tsx
 * <TextButton onClick={handleTextAction}>
 *   Do something important
 * </TextButton>
 * ```
 */
export function TextButton(props: TextButtonProps) {
  return <Button {...props} variant="text" as="button" />
}

// ============================================================================
// SUCCESS BUTTON - Positive Confirmation Actions
// ============================================================================

export type SuccessButtonProps = Omit<ButtonProps, "variant" | "as"> & {}

/**
 * SuccessButton - For positive confirmation actions like approve, confirm, or complete.
 *
 * **AI Context:**
 * - Sets `variant="success"` for green visual treatment
 * - Adds `data-outcome="positive"` for AI parsing
 *
 * @example
 * ```tsx
 * <SuccessButton onClick={handleApprove}>
 *   Approve
 * </SuccessButton>
 * ```
 */
export function SuccessButton(props: SuccessButtonProps) {
  return (
    <Button
      {...props}
      variant="success"
      as="button"
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "success",
        "data-outcome": "positive",
      }}
    />
  )
}
