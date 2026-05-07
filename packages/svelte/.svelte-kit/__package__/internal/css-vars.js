export function cssVarsToStyle(vars) {
    if (!vars)
        return undefined;
    const declarations = Object.entries(vars)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([property, value]) => `${property}: ${String(value)}`);
    return declarations.length > 0 ? declarations.join("; ") : undefined;
}
export function styleObjectToString(style) {
    if (!style)
        return undefined;
    const declarations = Object.entries(style)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([property, value]) => `${property}: ${String(value)}`);
    return declarations.length > 0 ? declarations.join("; ") : undefined;
}
export function mergeStyle(...parts) {
    const style = parts.filter(Boolean).join("; ");
    return style.length > 0 ? style : undefined;
}
