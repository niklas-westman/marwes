import type { ButtonOptions } from "@marwes-ui/core";
import type { Snippet } from "svelte";
export interface ButtonProps extends ButtonOptions {
    children?: Snippet;
    onclick?: (e: MouseEvent) => void;
    class?: string;
    style?: string;
}
