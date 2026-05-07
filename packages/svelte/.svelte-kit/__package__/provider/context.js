import { getContext, setContext } from "svelte";
const CONTEXT_KEY = Symbol("marwes-context");
export function setMarwesContext(value) {
    setContext(CONTEXT_KEY, value);
}
export function getMarwesContext() {
    const ctx = getContext(CONTEXT_KEY);
    if (!ctx) {
        throw new Error("MarwesProvider is missing. Wrap your app in <MarwesProvider />.");
    }
    return ctx;
}
