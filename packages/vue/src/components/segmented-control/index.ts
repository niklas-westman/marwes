// `SegmentedControl` atom intentionally NOT re-exported here.
// Use `SegmentedControlField` instead. Internal consumers can deep-import
// from "./segmented-control" directly.
export type { SegmentedControlItemVue as SegmentedControlItem } from "./segmented-control"
export { SegmentedControlField } from "./segmented-control-field"
export type { SegmentedControlFieldProps } from "./segmented-control-field"
