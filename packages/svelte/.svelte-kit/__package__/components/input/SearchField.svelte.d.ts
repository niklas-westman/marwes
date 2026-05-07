import type { InputFieldProps } from "./types.js";
type Props = Omit<InputFieldProps, "input"> & {
    input?: Omit<InputFieldProps["input"], "type" | "inputMode">;
};
declare const SearchField: import("svelte").Component<Props, {}, "">;
type SearchField = ReturnType<typeof SearchField>;
export default SearchField;
