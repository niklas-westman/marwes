import type { InputFieldProps } from "./types.js";
type Props = InputFieldProps & {
    currency?: string;
};
declare const CurrencyField: import("svelte").Component<Props, {}, "">;
type CurrencyField = ReturnType<typeof CurrencyField>;
export default CurrencyField;
