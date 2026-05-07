import type { InputFieldProps } from "./types.js";
type Props = Omit<InputFieldProps, "input"> & {
    input?: Omit<InputFieldProps["input"], "type" | "inputMode" | "autoComplete">;
};
declare const PhoneField: import("svelte").Component<Props, {}, "">;
type PhoneField = ReturnType<typeof PhoneField>;
export default PhoneField;
