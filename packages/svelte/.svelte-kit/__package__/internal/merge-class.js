export function mergeClass(...parts) {
    const className = parts.filter(Boolean).join(" ");
    return className.length > 0 ? className : undefined;
}
