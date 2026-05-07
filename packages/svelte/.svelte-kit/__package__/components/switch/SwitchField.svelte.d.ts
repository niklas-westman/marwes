import type { SwitchProps } from "./types.js";
interface SwitchFieldProps {
    id?: string;
    label: string;
    description?: string;
    error?: string;
    switch?: Omit<SwitchProps, "children">;
    ariaDescribedBy?: string;
    class?: string;
}
declare const SwitchField: import("svelte").Component<SwitchFieldProps, {}, "">;
type SwitchField = ReturnType<typeof SwitchField>;
export default SwitchField;
