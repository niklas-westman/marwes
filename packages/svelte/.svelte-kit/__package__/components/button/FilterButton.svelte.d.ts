import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action">;
declare const FilterButton: import("svelte").Component<Props, {}, "">;
type FilterButton = ReturnType<typeof FilterButton>;
export default FilterButton;
