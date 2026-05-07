import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action" | "as">;
declare const SubmitButton: import("svelte").Component<Props, {}, "">;
type SubmitButton = ReturnType<typeof SubmitButton>;
export default SubmitButton;
