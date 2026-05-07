export function cleanAttrs(attrs) {
    if (!attrs)
        return {};
    return Object.fromEntries(Object.entries(attrs).filter(([, value]) => value !== undefined));
}
