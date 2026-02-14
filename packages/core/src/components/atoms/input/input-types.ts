import type { CssVars } from "../../../shared/css-vars";

export type InputTone = "default" | "danger" | "success";

export type InputOptions = {
  id?: string;
  name?: string;

  value?: string;
  defaultValue?: string;

  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;

  inputMode?:
    | "text"
    | "email"
    | "numeric"
    | "tel"
    | "url"
    | "search"
    | "decimal";
  type?: "text" | "email" | "password" | "search" | "tel" | "url";

  autoComplete?: string;

  // validation + messaging (simple v1)
  tone?: InputTone;
  invalid?: boolean;
  describedBy?: string;

  ariaLabel?: string;
};

export type InputA11yProps = {
  id?: string;
  name?: string;

  disabled?: true;
  readOnly?: true;
  required?: true;

  type?: InputOptions["type"];
  inputMode?: InputOptions["inputMode"];
  autoComplete?: string;
  placeholder?: string;

  ariaLabel?: string;
  ariaInvalid?: true;
  ariaDescribedBy?: string;
};

export type InputRenderKit = {
  tag: "input";
  className: string;
  vars: CssVars;
  a11y: InputA11yProps;
};
