/** Match the generated Figma frame's whole-pixel case origin (alignCaseRoot).
 * Only the outer fixture moves: component dimensions and relative geometry stay
 * available to structural validation. Production styles are unaffected.
 */
export function alignFigmaFrameOrigin(root: HTMLElement, align?: string, buttonCase = false) {
  if (align !== "center") return () => undefined
  const provider = buttonCase ? root.querySelector<HTMLElement>("[data-marwes-theme]") : null
  const previousDisplay = provider?.style.display ?? ""
  // An inline button's first child changes its baseline (icon-left versus
  // label-first). Figma frames center the control box, without a parent line box.
  if (provider) provider.style.display = "flex"
  const previous = root.style.translate
  const previousPosition = root.style.position
  const previousLeft = root.style.left
  const previousTop = root.style.top
  const alignOrigin = () => {
    root.style.translate = "none"
    if (buttonCase) {
      root.style.position = "relative"
      root.style.left = "0px"
      root.style.top = "0px"
    }
    const bounds = root.getBoundingClientRect()
    const left = `${Math.round(bounds.x) - bounds.x}px`
    const top = `${Math.round(bounds.y) - bounds.y}px`
    // Fractional CSS translation can rasterize a centered control before moving
    // it to integer bounds. Layout offsets align the Button paint origin too.
    if (buttonCase) {
      root.style.left = left
      root.style.top = top
    } else root.style.translate = `${left} ${top}`
  }
  alignOrigin()
  // A remote font stylesheet can finish after the first fonts.ready promise.
  // Keep the outer origin aligned when the intrinsic text size then changes.
  const observer = new ResizeObserver(alignOrigin)
  observer.observe(root)
  return () => {
    observer.disconnect()
    root.style.translate = previous
    if (buttonCase) {
      root.style.position = previousPosition
      root.style.left = previousLeft
      root.style.top = previousTop
    }
    if (provider) provider.style.display = previousDisplay
  }
}
