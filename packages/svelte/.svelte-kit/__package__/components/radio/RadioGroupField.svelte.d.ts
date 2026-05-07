import type { Snippet } from "svelte";
interface RadioGroupFieldProps {
    id?: string;
    label: string;
    description?: string;
    error?: string;
    ariaDescribedBy?: string;
    children?: Snippet;
    class?: string;
}
declare const RadioGroupField: import("svelte").Component<RadioGroupFieldProps, {}, "">;
type RadioGroupField = ReturnType<typeof RadioGroupField>;
export default RadioGroupField;
