import type { IconColor, IconSize, IconStrokeWidth } from "@marwes-ui/core";
import type { iconRegistry } from "@marwes-ui/core";
export type IconName = keyof typeof iconRegistry;
export interface IconProps {
    name: IconName;
    size?: IconSize | number;
    strokeWidth?: IconStrokeWidth | number;
    color?: IconColor;
    class?: string;
    "aria-label"?: string;
    decorative?: boolean;
}
