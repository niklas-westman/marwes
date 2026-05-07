import type { CheckboxProps } from "./types.js";
interface CheckboxFieldProps {
    id?: string;
    label: string;
    description?: string;
    error?: string;
    checkbox?: CheckboxProps;
    ariaDescribedBy?: string;
    checked?: boolean;
    class?: string;
}
declare const CheckboxField: import("svelte").Component<CheckboxFieldProps, {}, "checked">;
type CheckboxField = ReturnType<typeof CheckboxField>;
export default CheckboxField;
