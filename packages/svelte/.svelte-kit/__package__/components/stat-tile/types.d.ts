import type { StatTileOptions } from "@marwes-ui/core";
export interface StatTileProps extends StatTileOptions {
    /** The main label (e.g. "Revenue") */
    label: string;
    /** The primary value (e.g. "$12,345") */
    value: string;
    /** Optional subtitle below value */
    subtitle?: string;
    /** Optional trend value (e.g. "+12%") */
    trendValue?: string;
    class?: string;
}
