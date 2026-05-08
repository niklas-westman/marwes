import type { AvatarOptions } from "@marwes-ui/core";
export interface AvatarProps extends AvatarOptions {
    class?: string;
    style?: string | undefined;
    dataAttributes?: Record<string, string>;
}
