import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action">;
declare const DropdownButton: import("svelte").Component<Props, {}, "">;
type DropdownButton = ReturnType<typeof DropdownButton>;
export default DropdownButton;
