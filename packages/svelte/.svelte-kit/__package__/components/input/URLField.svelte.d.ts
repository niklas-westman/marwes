import type { InputFieldProps } from "./types.js";
type Props = Omit<InputFieldProps, "input"> & {
    input?: Omit<InputFieldProps["input"], "type" | "inputMode" | "autoComplete">;
};
declare const URLField: import("svelte").Component<Props, {}, "">;
type URLField = ReturnType<typeof URLField>;
export default URLField;
