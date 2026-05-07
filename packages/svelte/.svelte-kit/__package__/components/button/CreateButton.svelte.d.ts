import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action">;
declare const CreateButton: import("svelte").Component<Props, {}, "">;
type CreateButton = ReturnType<typeof CreateButton>;
export default CreateButton;
