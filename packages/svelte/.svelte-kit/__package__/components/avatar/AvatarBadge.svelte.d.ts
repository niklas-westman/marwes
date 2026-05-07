import type { AvatarProps } from "./types.js";
interface AvatarBadgeProps extends AvatarProps {
    statusLabel?: string;
}
declare const AvatarBadge: import("svelte").Component<AvatarBadgeProps, {}, "">;
type AvatarBadge = ReturnType<typeof AvatarBadge>;
export default AvatarBadge;
