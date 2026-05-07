import type { TextareaProps } from "./types.js";
interface TextareaFieldProps {
    id?: string;
    label: string;
    helperText?: string;
    error?: string;
    textarea?: Omit<TextareaProps, "value">;
    ariaDescribedBy?: string;
    value?: string;
    class?: string;
}
declare const TextareaField: import("svelte").Component<TextareaFieldProps, {}, "value">;
type TextareaField = ReturnType<typeof TextareaField>;
export default TextareaField;
