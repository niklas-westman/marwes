import type { SliderProps } from "./types.js";
interface SliderFieldProps {
    id?: string;
    label: string;
    helperText?: string;
    error?: string;
    slider?: Omit<SliderProps, "value">;
    ariaDescribedBy?: string;
    value?: number;
    class?: string;
}
declare const SliderField: import("svelte").Component<SliderFieldProps, {}, "value">;
type SliderField = ReturnType<typeof SliderField>;
export default SliderField;
