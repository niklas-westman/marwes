import { ButtonAction, ButtonVariant, IconName } from "@marwes-ui/core"
import { Button, type ButtonProps } from "./button"

/**
 * Semantic Button Variants - AI-Friendly Components
 *
 * These variants encode best practices and automatically set AI-friendly
 * metadata, making it easier for both developers and AI tools to understand
 * the purpose and behavior of each button.
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
      iconRight={IconName.Minus}
      confirmation={confirmation}
      dataAttributes={{
        ...props.dataAttributes,
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
      variant={props.variant ?? "secondary"}
      dataAttributes={{
        ...props.dataAttributes,
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
        "data-navigation": "true",
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
