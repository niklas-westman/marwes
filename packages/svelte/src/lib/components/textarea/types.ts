import type { TextareaOptions } from "@marwes-ui/core"

export interface TextareaProps extends Omit<TextareaOptions, "describedBy"> {
  value?: string
  oninput?: (e: Event & { currentTarget: HTMLTextAreaElement }) => void
  class?: string
  style?: string | undefined
  describedBy?: string | undefined
}
