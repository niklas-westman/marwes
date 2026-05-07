import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action">;
declare const RefreshButton: import("svelte").Component<Props, {}, "">;
type RefreshButton = ReturnType<typeof RefreshButton>;
export default RefreshButton;
