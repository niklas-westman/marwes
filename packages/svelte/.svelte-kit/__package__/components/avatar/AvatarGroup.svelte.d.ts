import type { AvatarProps } from "./types.js";
interface AvatarGroupItem extends Omit<AvatarProps, "size" | "class" | "style"> {
    id?: string;
}
interface AvatarGroupProps {
    items: AvatarGroupItem[];
    overflowCount?: number;
    overflowLabel?: string;
    ariaLabel?: string;
    dataAttributes?: Record<string, string>;
    class?: string;
}
declare const AvatarGroup: import("svelte").Component<AvatarGroupProps, {}, "">;
type AvatarGroup = ReturnType<typeof AvatarGroup>;
export default AvatarGroup;
