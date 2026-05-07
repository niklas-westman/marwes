import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action">;
declare const SortButton: import("svelte").Component<Props, {}, "">;
type SortButton = ReturnType<typeof SortButton>;
export default SortButton;
