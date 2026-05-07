import type { SpacingOptions } from "@marwes-ui/core";
export interface SpacingProps extends SpacingOptions {
    class?: string;
    style?: string | undefined;
}
/** Spacer is an alias for Spacing. */
export type SpacerProps = SpacingProps;
