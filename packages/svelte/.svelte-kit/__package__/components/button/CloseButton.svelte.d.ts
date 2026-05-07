import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action">;
declare const CloseButton: import("svelte").Component<Props, {}, "">;
type CloseButton = ReturnType<typeof CloseButton>;
export default CloseButton;
