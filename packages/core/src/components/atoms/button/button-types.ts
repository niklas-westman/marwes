import type { CssVars } from "../../../shared/css-vars"
import type { IconName } from "../icon/icon-types"

/**
 * Button size options.
 * Use `ButtonSize.md` for type-safe access.
 */
export const ButtonSize = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
} as const
export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize]

/**
 * Button visual variant.
 * Use `ButtonVariant.primary` for type-safe access.
 *
 * @property primary - High-emphasis buttons for primary actions (e.g., "Save", "Submit", "Create").
 *                    Use sparingly - typically one primary action per view.
 * @property secondary - Medium-emphasis buttons for secondary actions (e.g., "Cancel", "Back").
 *                      Good for actions that complement the primary action.
 * @property text - Low-emphasis buttons for tertiary actions or inline text-like buttons.
 *                 Minimal visual weight, ideal for less important actions.
 *
 * @example
 * ```tsx
 * import { ButtonVariant } from "@marwes-ui/core"
 *
 * <Button variant={ButtonVariant.primary}>Save</Button>
 * <Button variant={ButtonVariant.secondary}>Cancel</Button>
 * ```
 */
export const ButtonVariant = {
  primary: "primary",
  secondary: "secondary",
  text: "text",
} as const
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant]

/**
 * Button semantic action for AI-friendly context.
 * Prefer using semantic components (CancelButton, SubmitButton, etc.) which set this automatically.
 * Use `ButtonAction.submit` directly only for advanced/dynamic cases.
 *
 * These values are used to:
 * - Set appropriate `data-action` attributes for AI parsing
 * - Provide semantic context for accessibility tools
 * - Enable smart defaults in semantic button variants
 *
 * @property submit - Form submissions. Automatically sets `type="submit"`. Recommended icon: `IconName.Check`
 * @property reset - Form resets. Recommended icon: `IconName.RotateLeft`
 * @property button - Generic button action (default for `<button>` elements)
 * @property navigate - Navigation/routing actions. Used with `<a>` elements. Recommended icon: `IconName.ArrowRight`
 * @property delete - Destructive operations (delete, remove). Should trigger confirmation. Recommended icon: `IconName.Trash` or `IconName.Minus`
 * @property create - Creation actions (add, new). Recommended icon: `IconName.Plus`
 * @property edit - Edit/modify actions. Recommended icon: `IconName.Edit`
 * @property cancel - Cancel/dismiss actions. Recommended icon: `IconName.X`
 *
 * @example
 * ```tsx
 * import { ButtonAction, IconName } from "@marwes-ui/core"
 *
 * // For advanced/dynamic use cases:
 * <Button action={ButtonAction.delete} iconRight={IconName.Trash}>Delete</Button>
 *
 * // Prefer semantic variants when possible:
 * <DangerButton>Delete Project</DangerButton>  // Sets action="delete" automatically
 * ```
 */
export const ButtonAction = {
  submit: "submit",
  reset: "reset",
  button: "button",
  navigate: "navigate",
  delete: "delete",
  create: "create",
  edit: "edit",
  cancel: "cancel",
} as const
export type ButtonAction = (typeof ButtonAction)[keyof typeof ButtonAction]

export type ButtonOptions = {
  as?: "button" | "a"
  href?: string

  size?: ButtonSize
  variant?: ButtonVariant

  disabled?: boolean
  loading?: boolean
  error?: boolean

  toggle?: boolean
  pressed?: boolean

  ariaLabel?: string
  hasVisibleText?: boolean

  ariaExpanded?: boolean
  ariaControls?: string

  // Icon support
  iconLeft?: IconName
  iconRight?: IconName
  iconOnly?: boolean

  // AI-Friendly attributes (Level 3)
  action?: ButtonAction
  tooltip?: string
  confirmation?: boolean

  // Custom data attributes for semantic variants
  dataAttributes?: Record<string, string | boolean | undefined>
}

export type ButtonA11yProps = {
  ariaLabel?: string
  ariaBusy?: boolean
  ariaDisabled?: boolean
  ariaPressed?: boolean
  ariaExpanded?: boolean
  ariaControls?: string
  title?: string | undefined

  // <button>
  disabled?: boolean
  type?: "button"

  // <a>
  href?: string
  role?: "button"
  tabIndex?: 0 | -1
}

export type ButtonRenderKit = {
  tag: "button" | "a"
  className: string
  vars: CssVars
  a11y: ButtonA11yProps
  blockClick: boolean
  dataAttributes?: Record<string, string | boolean | undefined>
}
