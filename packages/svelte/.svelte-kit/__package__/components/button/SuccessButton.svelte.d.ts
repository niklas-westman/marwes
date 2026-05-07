import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action" | "as">;
declare const SuccessButton: import("svelte").Component<Props, {}, "">;
type SuccessButton = ReturnType<typeof SuccessButton>;
export default SuccessButton;
