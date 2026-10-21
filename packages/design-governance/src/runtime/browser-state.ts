import type { Page } from "playwright"
import type { BrowserState } from "../source/types.js"

/** Exercise native pseudo states; never copy expected design styles into the fixture. */
export async function applyBrowserState(page: Page, state?: BrowserState): Promise<void> {
  if (!state) return
  if (state.animationStabilization.disableAnimations) {
    await page.addStyleTag({
      content:
        "*, *::before, *::after { animation: none !important; transition: none !important; }",
    })
  }
  const target = page.locator(state.selector)
  if ((await target.count()) !== 1)
    throw Error(`Browser state selector must match exactly one element: ${state.selector}`)
  if (state.kind === "focus") await target.focus()
  else {
    await target.hover()
    // The page is closed after measurement. Keep the genuine pointer held for :active evidence.
    if (state.kind === "pressed") await page.mouse.down()
  }
  if (state.animationStabilization.waitMs)
    await page.waitForTimeout(state.animationStabilization.waitMs)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
}
