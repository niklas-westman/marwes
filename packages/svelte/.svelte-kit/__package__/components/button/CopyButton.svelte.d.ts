import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action">;
declare const CopyButton: import("svelte").Component<Props, {}, "">;
type CopyButton = ReturnType<typeof CopyButton>;
export default CopyButton;
