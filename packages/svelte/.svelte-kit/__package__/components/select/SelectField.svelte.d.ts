import type { SelectProps } from "./types.js";
interface SelectFieldProps {
    id?: string;
    label: string;
    helperText?: string;
    error?: string;
    select?: Omit<SelectProps, "value">;
    ariaDescribedBy?: string;
    value?: string;
    class?: string;
}
declare const SelectField: import("svelte").Component<SelectFieldProps, {}, "value">;
type SelectField = ReturnType<typeof SelectField>;
export default SelectField;
