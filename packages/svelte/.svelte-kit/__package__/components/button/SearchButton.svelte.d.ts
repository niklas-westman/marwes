import type { ButtonProps } from "./types.js";
type Props = Omit<ButtonProps, "variant" | "action">;
declare const SearchButton: import("svelte").Component<Props, {}, "">;
type SearchButton = ReturnType<typeof SearchButton>;
export default SearchButton;
