import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import ProgressBar from "../lib/components/progress-bar/ProgressBar.svelte"

describe("ProgressBar", () => {
  it("renders determinate progress semantics", () => {
    const { container } = render(ProgressBar, {
      props: { id: "build-progress", label: "Build", value: 60 },
    })
    const progressBar = container.querySelector('[data-component="progress-bar"]')

    expect(progressBar).not.toBeNull()
    expect(progressBar?.getAttribute("role")).toBe("progressbar")
    expect(progressBar?.getAttribute("aria-valuenow")).toBe("60")
    expect(progressBar?.getAttribute("aria-labelledby")).toBe("build-progress-label")
    expect(progressBar?.textContent).toContain("Build")
    expect(progressBar?.textContent).toContain("60%")
  })

  it("supports small hidden-label usage", () => {
    const { container } = render(ProgressBar, {
      props: {
        value: 42,
        size: "small",
        showLabel: false,
        showPercentage: false,
        ariaLabel: "Sync progress",
      },
    })
    const progressBar = container.querySelector('[data-component="progress-bar"]')

    expect(progressBar?.getAttribute("aria-label")).toBe("Sync progress")
    expect(progressBar?.getAttribute("data-size")).toBe("small")
    expect(progressBar?.className).toContain("mw-progress-bar--small")
    expect(progressBar?.textContent).not.toContain("Progress")
    expect(progressBar?.textContent).not.toContain("42%")
  })
})
