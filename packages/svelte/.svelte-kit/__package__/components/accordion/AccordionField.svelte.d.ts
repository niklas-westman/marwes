interface AccordionFieldItem {
    value: string;
    title: string;
    content: string;
    disabled?: boolean;
}
interface AccordionFieldProps {
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
declare const AccordionField: import("svelte").Component<AccordionFieldProps, {}, "">;
type AccordionField = ReturnType<typeof AccordionField>;
export default AccordionField;
