import type { BadgeOptions } from "@marwes-ui/core";
import type { Snippet } from "svelte";
export interface BadgeProps extends BadgeOptions {
    children?: Snippet;
    class?: string;
    id?: string;
    dataAttributes?: Record<string, string>;
}
export interface BadgeGroupProps {
    /** Visible label for the badge group. */
    label: string;
    children?: Snippet;
    class?: string;
    id?: string;
}
