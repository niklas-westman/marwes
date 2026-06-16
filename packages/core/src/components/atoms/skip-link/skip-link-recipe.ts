import type { SkipLinkOptions, SkipLinkRenderKit } from "./skip-link-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function createSkipLinkRecipe(opts: SkipLinkOptions): SkipLinkRenderKit {
  return {
    tag: "a",
    className: cx("mw-skip-link", opts.className),
  }
}
