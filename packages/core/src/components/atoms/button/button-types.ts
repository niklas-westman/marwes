import type { CssVars } from "../../../shared/css-vars";
import type { IconName } from "../icon/icon-types";

export type ButtonSize = "xs" | "sm" | "md" | "lg";
export type ButtonTone = "primary" | "secondary" | "text";

export type ButtonOptions = {
  as?: "button" | "a";
  href?: string;

  size?: ButtonSize;
  tone?: ButtonTone;

  disabled?: boolean;
  loading?: boolean;
  error?: boolean;

  toggle?: boolean;
  pressed?: boolean;

  ariaLabel?: string;
  hasVisibleText?: boolean;

  ariaExpanded?: boolean;
  ariaControls?: string;

  // Icon support
  iconLeft?: IconName;
  iconRight?: IconName;
  iconOnly?: boolean;

  // AI-Friendly attributes (Level 3)
  action?:
    | "submit"
    | "reset"
    | "button"
    | "navigate"
    | "delete"
    | "create"
    | "edit"
    | "cancel";
  tooltip?: string;
  confirmation?: boolean;

  // Custom data attributes for semantic variants
  dataAttributes?: Record<string, string | boolean | undefined>;
};

export type ButtonA11yProps = {
  ariaLabel?: string;
  ariaBusy?: boolean;
  ariaDisabled?: boolean;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  ariaControls?: string;
  title?: string | undefined;

  // <button>
  disabled?: boolean;
  type?: "button";

  // <a>
  href?: string;
  role?: "button";
  tabIndex?: 0 | -1;
};

export type ButtonRenderKit = {
  tag: "button" | "a";
  className: string;
  vars: CssVars;
  a11y: ButtonA11yProps;
  blockClick: boolean;
  dataAttributes?: Record<string, string | boolean | undefined>;
};
