import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action">;
declare const SaveButton: import("svelte").Component<Props, {}, "">;
type SaveButton = ReturnType<typeof SaveButton>;
export default SaveButton;
