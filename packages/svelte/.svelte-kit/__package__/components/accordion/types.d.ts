import type { Snippet } from "svelte";
export interface AccordionProps {
    id?: string;
    open?: boolean;
    disabled?: boolean;
    title: string;
    children?: Snippet;
    class?: string;
    ontoggle?: () => void;
}
