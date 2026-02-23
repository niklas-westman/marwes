import type { HeadingSize } from "@marwes-ui/core"
import { type HeadingBaseProps, createHeadingComponent } from "./create-heading"

export type H2Props = HeadingBaseProps & {
  size?: HeadingSize
}

export const H2 = createHeadingComponent(2, "h2")
