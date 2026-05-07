import type { HeadingSize, ParagraphSize } from "@marwes-ui/core";
import type { Snippet } from "svelte";
export interface H1Props {
    size?: HeadingSize;
    id?: string;
    ariaLabel?: string;
    children?: Snippet;
    class?: string;
    style?: string | undefined;
}
export interface H2Props {
    size?: HeadingSize;
    id?: string;
    ariaLabel?: string;
    children?: Snippet;
    class?: string;
    style?: string | undefined;
}
export interface H3Props {
    size?: HeadingSize;
    id?: string;
    ariaLabel?: string;
    children?: Snippet;
    class?: string;
    style?: string | undefined;
}
export interface ParagraphProps {
    size?: ParagraphSize;
    id?: string;
    children?: Snippet;
    class?: string;
    style?: string | undefined;
}
