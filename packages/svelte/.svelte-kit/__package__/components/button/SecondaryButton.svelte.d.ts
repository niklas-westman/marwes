import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "as">;
declare const SecondaryButton: import("svelte").Component<Props, {}, "">;
type SecondaryButton = ReturnType<typeof SecondaryButton>;
export default SecondaryButton;
