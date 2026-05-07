import type { SelectOptions } from "@marwes-ui/core";
export type { SelectOption } from "@marwes-ui/core";
export interface SelectProps extends Omit<SelectOptions, "describedBy"> {
    value?: string;
    onchange?: (e: Event & {
        currentTarget: HTMLSelectElement;
    }) => void;
    class?: string;
    style?: string | undefined;
    describedBy?: string | undefined;
}
