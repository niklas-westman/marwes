import type { MwTheme } from "@marwes-ui/react"

declare module "styled-components" {
  export interface DefaultTheme extends MwTheme {}
}
