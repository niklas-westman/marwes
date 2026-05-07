import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "as">;
declare const PrimaryButton: import("svelte").Component<Props, {}, "">;
type PrimaryButton = ReturnType<typeof PrimaryButton>;
export default PrimaryButton;
