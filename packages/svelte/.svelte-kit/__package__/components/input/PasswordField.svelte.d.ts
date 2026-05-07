import type { InputFieldProps } from "./types.js";
type Props = Omit<InputFieldProps, "input"> & {
    input?: Omit<InputFieldProps["input"], "type">;
};
declare const PasswordField: import("svelte").Component<Props, {}, "">;
type PasswordField = ReturnType<typeof PasswordField>;
export default PasswordField;
