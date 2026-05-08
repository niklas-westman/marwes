import type { SliderOptions } from "@marwes-ui/core";
export interface SliderProps extends Omit<SliderOptions, "ariaDescribedBy"> {
    value?: number;
    oninput?: (e: Event & {
        currentTarget: HTMLInputElement;
    }) => void;
    onvaluechange?: (value: number) => void;
    class?: string;
    style?: string | undefined;
    ariaDescribedBy?: string | undefined;
}
export interface SliderFieldProps {
    id?: string;
    label: string;
    helperText?: string;
    error?: string;
    slider?: Omit<SliderProps, "value">;
    ariaDescribedBy?: string;
    value?: number;
    class?: string;
}
