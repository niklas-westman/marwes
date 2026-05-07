import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action">;
declare const EditButton: import("svelte").Component<Props, {}, "">;
type EditButton = ReturnType<typeof EditButton>;
export default EditButton;
