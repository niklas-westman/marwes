import type { HeadingSize } from "@marwes-ui/core"
import { type HeadingBaseProps, createHeadingComponent } from "./create-heading"

export type H3Props = HeadingBaseProps & {
  size?: HeadingSize
}

export const H3 = createHeadingComponent(3, "h3")
