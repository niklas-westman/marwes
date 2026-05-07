import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "as">;
declare const TextButton: import("svelte").Component<Props, {}, "">;
type TextButton = ReturnType<typeof TextButton>;
export default TextButton;
