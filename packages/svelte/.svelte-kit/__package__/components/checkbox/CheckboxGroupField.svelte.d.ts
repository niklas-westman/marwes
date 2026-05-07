import type { Snippet } from "svelte";
interface CheckboxGroupFieldProps {
    id?: string;
    label: string;
    description?: string;
    error?: string;
    ariaDescribedBy?: string;
    children?: Snippet;
    class?: string;
}
declare const CheckboxGroupField: import("svelte").Component<CheckboxGroupFieldProps, {}, "">;
type CheckboxGroupField = ReturnType<typeof CheckboxGroupField>;
export default CheckboxGroupField;
