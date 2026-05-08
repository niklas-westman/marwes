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
export interface AccordionFieldItem {
    value: string;
    title: string;
    content: string;
    disabled?: boolean;
}
export interface AccordionFieldProps {
    id?: string;
    label: string;
    description?: string;
    error?: string;
    items: AccordionFieldItem[];
    openItems?: string[];
    defaultOpenItems?: string[];
    onopenitemschange?: (items: string[]) => void;
    multiple?: boolean;
    ariaDescribedBy?: string;
    class?: string;
}
