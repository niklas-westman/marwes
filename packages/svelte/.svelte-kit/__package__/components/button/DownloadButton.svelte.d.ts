import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action">;
declare const DownloadButton: import("svelte").Component<Props, {}, "">;
type DownloadButton = ReturnType<typeof DownloadButton>;
export default DownloadButton;
