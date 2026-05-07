import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "action">;
declare const CancelButton: import("svelte").Component<Props, {}, "">;
type CancelButton = ReturnType<typeof CancelButton>;
export default CancelButton;
