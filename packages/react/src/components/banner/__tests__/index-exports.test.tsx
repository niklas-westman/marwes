/**
 * React adapter: Verifies that the Banner barrel re-exports all public symbols.
 */
import { BannerVariant } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"
import * as bannerComponents from ".."
import * as publicApi from "../../../index"

describe("banner barrel exports", () => {
  it("exports BannerVariant from the banner domain barrel", () => {
    expect(bannerComponents.BannerVariant).toBe(BannerVariant)
    expect(bannerComponents.BannerVariant.info).toBe("info")
  })

  it("re-exports BannerVariant from the package root", () => {
    expect(publicApi.BannerVariant).toBe(BannerVariant)
    expect(publicApi.BannerVariant.info).toBe("info")
  })

  it("exports Banner component from the package root", () => {
    expect(publicApi.Banner).toBeDefined()
    expect(typeof publicApi.Banner).toBe("function")
  })
})
