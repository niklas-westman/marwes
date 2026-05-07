import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action" | "as">;
declare const ConfirmButton: import("svelte").Component<Props, {}, "">;
type ConfirmButton = ReturnType<typeof ConfirmButton>;
export default ConfirmButton;
