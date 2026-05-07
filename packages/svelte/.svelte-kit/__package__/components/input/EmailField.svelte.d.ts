import type { InputFieldProps } from "./types.js";
type Props = Omit<InputFieldProps, "input"> & {
    input?: Omit<InputFieldProps["input"], "type" | "inputMode" | "autoComplete">;
};
declare const EmailField: import("svelte").Component<Props, {}, "">;
type EmailField = ReturnType<typeof EmailField>;
export default EmailField;
