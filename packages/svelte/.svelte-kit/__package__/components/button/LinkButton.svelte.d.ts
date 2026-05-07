import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action" | "as">;
declare const LinkButton: import("svelte").Component<Props, {}, "">;
type LinkButton = ReturnType<typeof LinkButton>;
export default LinkButton;
