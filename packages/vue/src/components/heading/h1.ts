import type { HeadingSize } from "@marwes-ui/core"
import { type HeadingBaseProps, createHeadingComponent } from "./create-heading"

export type H1Props = HeadingBaseProps & {
  size?: HeadingSize
}

export const H1 = createHeadingComponent(1, "h1")
