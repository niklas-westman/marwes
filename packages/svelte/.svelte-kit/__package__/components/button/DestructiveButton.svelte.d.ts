import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action" | "as">;
declare const DestructiveButton: import("svelte").Component<Props, {}, "">;
type DestructiveButton = ReturnType<typeof DestructiveButton>;
export default DestructiveButton;
