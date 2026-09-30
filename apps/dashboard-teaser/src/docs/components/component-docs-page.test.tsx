// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"
import { ThemeMode } from "@marwes-ui/react"
import { cleanup, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import badgePageSource from "../generated/badge-page.json"
import bannerPageSource from "../generated/banner-page.json"
import buttonPageSource from "../generated/button-page.json"
import inputPageSource from "../generated/input-page.json"
import progressBarPageSource from "../generated/progress-bar-page.json"
import skeletonPageSource from "../generated/skeleton-page.json"
import spinnerPageSource from "../generated/spinner-page.json"
import {
  ComponentDocsApp,
  getInitialThemeMode,
  parseComponentDocsPageModel,
  readEmbeddedComponentDocsPageModel,
} from "./component-docs-app"
import { getFamilyShowcase } from "./family-showcases"
import BadgeShowcase from "./showcases/badge-showcase"
import BannerShowcase from "./showcases/banner-showcase"
import ButtonShowcase from "./showcases/button-showcase"
import ProgressBarShowcase from "./showcases/progress-bar-showcase"
import SkeletonShowcase from "./showcases/skeleton-showcase"
import SpinnerShowcase from "./showcases/spinner-showcase"

const inputDocsModel = parseComponentDocsPageModel(inputPageSource)
const buttonDocsModel = parseComponentDocsPageModel(buttonPageSource)
const badgeDocsModel = parseComponentDocsPageModel(badgePageSource)
const bannerDocsModel = parseComponentDocsPageModel(bannerPageSource)
const progressBarDocsModel = parseComponentDocsPageModel(progressBarPageSource)
const skeletonDocsModel = parseComponentDocsPageModel(skeletonPageSource)
const spinnerDocsModel = parseComponentDocsPageModel(spinnerPageSource)

function InputDocsApp(): JSX.Element {
  return <ComponentDocsApp model={inputDocsModel} />
}

describe("InputDocsApp", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn(() => 1),
    )
    vi.stubGlobal("cancelAnimationFrame", vi.fn())
    window.history.replaceState(null, "", "/docs/components/input/")
  })

  afterEach(() => {
    cleanup()
    Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView")
    vi.unstubAllGlobals()
  })

  it("renders the generated model and exposes one active page location", () => {
    render(<InputDocsApp />)

    expect(screen.getByRole("heading", { level: 1, name: "Input" })).toBeVisible()
    expect(screen.getByRole("link", { name: "Input", current: "page" })).toBeVisible()
    expect(
      within(screen.getByRole("navigation", { name: "On this page" })).getByRole("link", {
        current: "location",
      }),
    ).toHaveTextContent("What this family solves")
    expect(
      within(screen.getByLabelText("On this page (compact)")).getByRole("link", {
        current: "location",
        hidden: true,
      }),
    ).toHaveTextContent("What this family solves")
    expect(screen.getByRole("heading", { name: "Recommended public components" })).toBeVisible()
    const publicApi = screen.getByLabelText("Selected framework public API inventory")
    const reactExports = inputDocsModel.frameworks[0]?.exports ?? []
    expect(publicApi).toHaveTextContent(
      reactExports
        .filter((entry) => entry.kind === "component")
        .map((entry) => entry.name)
        .join(", "),
    )
    expect(publicApi).toHaveTextContent("@marwes-ui/react")
  })

  it("places compact page navigation after the intro without a disclosure toggle", () => {
    render(<InputDocsApp />)
    const navigation = screen.getByLabelText("On this page (compact)")
    const hero = screen.getByRole("heading", { level: 1, name: "Input" }).closest("header")
    expect(navigation.parentElement).toBe(hero)
    expect(navigation.previousElementSibling?.tagName).toBe("P")
    expect(navigation.closest("details")).toBeNull()
    expect(within(navigation).getAllByRole("link", { hidden: true })).toHaveLength(
      inputDocsModel.sections.length,
    )
  })

  it("updates the scroll indicator immediately when a page link is selected", async () => {
    const user = userEvent.setup()
    render(<InputDocsApp />)

    const pageNavigation = screen.getByRole("navigation", { name: "On this page" })
    await user.click(within(pageNavigation).getByRole("link", { name: "Accessibility" }))

    expect(
      within(pageNavigation).getByRole("link", { name: "Accessibility", current: "location" }),
    ).toHaveAttribute("href", "#accessibility")
    expect(window.location.hash).toBe("#accessibility")
  })

  it("supports mouse and keyboard framework tab selection", async () => {
    const user = userEvent.setup()
    render(<InputDocsApp />)

    const vueTab = screen.getByRole("tab", { name: "Vue" })
    await user.click(vueTab)
    expect(vueTab).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("@marwes-ui/vue")
    expect(screen.getByLabelText("Selected framework public API inventory")).toHaveTextContent(
      "@marwes-ui/vue",
    )

    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "Svelte" })).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("@marwes-ui/svelte")
  })

  it("provides a native Browse docs disclosure with every component family", async () => {
    const user = userEvent.setup()
    render(<InputDocsApp />)

    const summary = screen.getByText("Browse docs")
    const disclosure = summary.closest("details")
    expect(disclosure).not.toHaveAttribute("open")
    await user.click(summary)
    expect(disclosure).toHaveAttribute("open")
    const navigation = screen.getByLabelText("Browse documentation")
    expect(
      within(navigation).getByRole("link", { name: "Progress bar", hidden: true }),
    ).toHaveAttribute("href", "/docs/components/progress-bar/")
    expect(
      within(navigation).getByRole("link", { name: "AI and agents", hidden: true }),
    ).toBeInTheDocument()
    expect(within(navigation).getAllByRole("link", { hidden: true })).toHaveLength(40)
    expect(screen.queryByTitle("Open documentation menu")).not.toBeInTheDocument()
  })

  it("uses the prepaint theme as the first provider mode", () => {
    document.documentElement.dataset.marwesMode = "dark"
    document.documentElement.classList.add("dark")
    expect(getInitialThemeMode()).toBe(ThemeMode.dark)

    document.documentElement.dataset.marwesMode = "light"
    document.documentElement.classList.remove("dark")
    expect(getInitialThemeMode()).toBe(ThemeMode.light)
  })

  it("keeps the static fallback until the first React commit", () => {
    const root = document.createElement("div")
    root.id = "root"
    root.dataset.staticDocs = ""
    document.body.append(root)

    const view = render(<InputDocsApp />, { container: root })

    expect(root).not.toHaveAttribute("data-static-docs")
    view.unmount()
    root.remove()
  })

  it("restores a valid initial hash after React replaces the static fallback", () => {
    const scrollIntoView = vi.fn()
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    })
    window.history.replaceState(null, "", "/docs/components/input/#public-imports")

    render(<InputDocsApp />)

    expect(scrollIntoView).toHaveBeenCalledOnce()
  })

  it("copies the currently selected framework example and reports clipboard failure", async () => {
    const user = userEvent.setup()
    const writeText = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("no"))
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })
    render(<InputDocsApp />)

    const copy = screen.getByRole("button", { name: "Copy react input example" })
    await user.click(copy)
    expect(await screen.findByRole("button", { name: "Copied react input example" })).toBeEnabled()

    await user.click(screen.getByRole("button", { name: "Copied react input example" }))
    expect(
      await screen.findByText("Could not copy automatically. Select and copy the text manually."),
    ).toBeVisible()
  })

  it("reads and validates an embedded component model", () => {
    const source = document.createElement("script")
    source.id = "component-docs-model"
    source.type = "application/json"
    source.textContent = JSON.stringify(inputPageSource)
    document.body.append(source)

    expect(readEmbeddedComponentDocsPageModel()).toEqual(inputDocsModel)

    source.remove()
  })

  it("renders the Button showcase with enum exports and a named icon button", () => {
    render(<ComponentDocsApp model={buttonDocsModel} Showcase={ButtonShowcase} />)

    expect(screen.getByRole("heading", { level: 1, name: "Button" })).toBeVisible()
    expect(screen.getByRole("button", { name: "Create item" })).toBeVisible()
    const publicApi = screen.getByLabelText("Selected framework public API inventory")
    expect(publicApi).toHaveTextContent("Enums")
    expect(publicApi).toHaveTextContent("ButtonAction")
  })

  it("renders truthful Badge examples with a named numeric notification", async () => {
    render(<ComponentDocsApp model={badgeDocsModel} Showcase={BadgeShowcase} />)

    expect(await screen.findByLabelText("3 unread messages")).toBeVisible()
    expect(screen.getByRole("group", { name: "Deployment status" })).toBeVisible()
  })

  it("renders a working Banner dismiss action", async () => {
    const user = userEvent.setup()
    render(<ComponentDocsApp model={bannerDocsModel} Showcase={BannerShowcase} />)

    await user.click(await screen.findByRole("button", { name: /dismiss/i }))
    expect(screen.getByText("Banner dismissed.")).toBeVisible()
  })

  it("renders one named standalone Skeleton loading status", async () => {
    render(<ComponentDocsApp model={skeletonDocsModel} Showcase={SkeletonShowcase} />)

    expect(await screen.findByRole("status", { name: "Loading profile summary" })).toBeVisible()
  })

  it("renders Spinner context and standalone loading states", async () => {
    render(<ComponentDocsApp model={spinnerDocsModel} Showcase={SpinnerShowcase} />)

    expect(await screen.findByRole("status", { name: "Loading account activity" })).toBeVisible()
    expect(screen.getByRole("button", { name: "Saving" })).toHaveAttribute("aria-busy", "true")
  })

  it("renders named determinate Progress Bar examples", async () => {
    render(<ComponentDocsApp model={progressBarDocsModel} Showcase={ProgressBarShowcase} />)

    expect(await screen.findByRole("progressbar", { name: "Workspace setup" })).toBeVisible()
    expect(screen.getByRole("progressbar", { name: "Data import progress" })).toHaveAttribute(
      "aria-valuenow",
      "82",
    )
  })

  it("marks a multi-word component family as the current rail page", () => {
    render(<ComponentDocsApp model={progressBarDocsModel} Showcase={ProgressBarShowcase} />)

    expect(screen.getByRole("link", { name: "Progress bar", current: "page" })).toBeVisible()
  })

  it("maps only families with useful custom showcases", () => {
    for (const family of [
      "badge",
      "banner",
      "button",
      "input",
      "progress-bar",
      "skeleton",
      "spinner",
    ]) {
      expect(getFamilyShowcase(family), family).toBeDefined()
    }
    expect(getFamilyShowcase("card")).toBeUndefined()
    expect(getFamilyShowcase("divider")).toBeUndefined()
  })
})
