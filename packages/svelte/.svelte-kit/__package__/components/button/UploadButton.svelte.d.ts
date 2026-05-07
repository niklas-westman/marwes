import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action">;
declare const UploadButton: import("svelte").Component<Props, {}, "">;
type UploadButton = ReturnType<typeof UploadButton>;
export default UploadButton;
