import type { SwitchOptions } from "@marwes-ui/core";
import type { Snippet } from "svelte";
export interface SwitchProps extends Omit<SwitchOptions, "ariaDescribedBy" | "ariaLabel"> {
    children?: Snippet;
    class?: string;
    id?: string;
    oncheckedchange?: (checked: boolean) => void;
    onclick?: (e: MouseEvent) => void;
    ariaDescribedBy?: string | undefined;
    ariaLabel?: string | undefined;
}
