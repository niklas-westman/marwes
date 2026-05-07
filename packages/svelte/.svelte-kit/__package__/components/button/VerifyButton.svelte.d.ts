import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action" | "as">;
declare const VerifyButton: import("svelte").Component<Props, {}, "">;
type VerifyButton = ReturnType<typeof VerifyButton>;
export default VerifyButton;
