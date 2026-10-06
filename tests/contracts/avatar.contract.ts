/**
 * Shared contract for the Avatar atom — icon fallback, initials with
 * size variants, image rendering with alt text, and decorative mode.
 */
import type { AvatarOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export type AvatarSize = "small" | "medium" | "large"

export interface AvatarContractHarness {
  renderAvatar(args?: {
    size?: AvatarSize
    initials?: string
    src?: string
    alt?: string
    ariaLabel?: string
    label?: string
    decorative?: boolean
  }): Promise<void> | void
  /** Renders the base Avatar with raw core options. */
  renderAvatarOptions(options: AvatarOptions): Promise<void> | void
  getAvatarElement(): HTMLElement
  getByRole(role: "img", options: { name: RegExp }): HTMLElement
  queryAvatarShell(): HTMLElement | null
}

type AvatarOptionCase = {
  options: AvatarOptions
  expectRendered: (avatar: HTMLElement) => void
}

function getAccessibleLabel(avatar: HTMLElement): string | null | undefined {
  return (
    avatar.getAttribute("aria-label") ??
    avatar.querySelector("[aria-label]")?.getAttribute("aria-label")
  )
}

// Exhaustive on purpose: a new core AvatarOptions field fails to compile until every adapter's
// handling of it is described by a case.
const avatarOptionCases: Record<keyof AvatarOptions, AvatarOptionCase> = {
  size: {
    options: { size: "large" },
    expectRendered: (avatar) => expect(avatar).toHaveAttribute("data-size", "large"),
  },
  type: {
    options: { type: "icon", initials: "am" },
    expectRendered: (avatar) => expect(avatar).toHaveAttribute("data-type", "icon"),
  },
  initials: {
    options: { initials: "am" },
    expectRendered: (avatar) => {
      expect(avatar).toHaveAttribute("data-type", "initials")
      expect(avatar).toHaveTextContent("AM")
    },
  },
  src: {
    options: { src: "/ann.png", alt: "Ann" },
    expectRendered: (avatar) => {
      expect(avatar).toHaveAttribute("data-type", "image")
      expect(avatar.querySelector("img")).toHaveAttribute("src", "/ann.png")
    },
  },
  alt: {
    options: { src: "/ann.png", alt: "Ann Marie" },
    expectRendered: (avatar) =>
      expect(avatar.querySelector("img")).toHaveAttribute("alt", "Ann Marie"),
  },
  iconName: {
    options: { iconName: "plus" },
    expectRendered: (avatar) => {
      expect(avatar).toHaveAttribute("data-type", "icon")
      expect(avatar.querySelector("svg")).not.toBeNull()
    },
  },
  decorative: {
    options: { decorative: true },
    expectRendered: (avatar) => expect(avatar).toHaveAttribute("aria-hidden", "true"),
  },
  ariaLabel: {
    options: { initials: "am", ariaLabel: "Account owner" },
    expectRendered: (avatar) => expect(getAccessibleLabel(avatar)).toBe("Account owner"),
  },
  label: {
    options: { initials: "am", label: "Ann Marie" },
    expectRendered: (avatar) => expect(getAccessibleLabel(avatar)).toBe("Ann Marie"),
  },
}

export function runAvatarContract(adapterName: string, harness: AvatarContractHarness): void {
  describe(`Avatar contract: ${adapterName}`, () => {
    it("renders an icon fallback by default", async () => {
      await harness.renderAvatar()

      const avatarElement = harness.getByRole("img", { name: /avatar/i })
      const avatarShell = harness.queryAvatarShell()

      expect(avatarElement.tagName).toBe("SPAN")
      expect(avatarShell?.className).toContain("mw-avatar")
      expect(avatarShell?.className).toContain("mw-avatar--medium")
      expect(avatarShell).toHaveAttribute("data-type", "icon")
      expect(avatarShell).toHaveAttribute("data-size", "medium")
    })

    it("supports initials content with size variants", async () => {
      await harness.renderAvatar({ initials: " am ", size: "large" })

      const avatarElement = harness.getByRole("img", { name: /am/i })
      const avatarShell = harness.queryAvatarShell()

      expect(avatarElement.textContent).toContain("AM")
      expect(avatarShell?.className).toContain("mw-avatar--large")
      expect(avatarShell).toHaveAttribute("data-type", "initials")
      expect(avatarShell).toHaveAttribute("data-size", "large")
    })

    it("renders image avatars with the provided alt text", async () => {
      await harness.renderAvatar({
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
        alt: "Alex Morgan",
      })

      const imageElement = harness.getByRole("img", { name: /alex morgan/i })
      const avatarShell = harness.queryAvatarShell()

      expect(imageElement.tagName).toBe("IMG")
      expect(avatarShell).toHaveAttribute("data-type", "image")
    })

    it("supports decorative avatars by hiding the shell from assistive technology", async () => {
      await harness.renderAvatar({ initials: "mw", decorative: true })

      const avatarShell = harness.queryAvatarShell()
      expect(avatarShell).toHaveAttribute("aria-hidden", "true")
    })

    it("uses an explicit ariaLabel to name a non-image avatar when provided", async () => {
      await harness.renderAvatar({ ariaLabel: "Alex Morgan" })

      const avatarElement = harness.getByRole("img", { name: /alex morgan/i })
      expect(avatarElement).toBeInTheDocument()
      expect(avatarElement).toHaveAttribute("aria-label", "Alex Morgan")
    })

    it("uses label as the accessible name when ariaLabel is absent", async () => {
      await harness.renderAvatar({ initials: "am", label: "Ann Marie" })

      expect(harness.getByRole("img", { name: /ann marie/i })).toBeInTheDocument()
    })

    it("prefers ariaLabel over label", async () => {
      await harness.renderAvatar({ initials: "am", ariaLabel: "Account owner", label: "Ann Marie" })

      expect(harness.getByRole("img", { name: /account owner/i })).toBeInTheDocument()
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(avatarOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderAvatarOptions(optionCase.options)

        const avatar = harness.getAvatarElement()
        expect(avatar).toBeInTheDocument()
        optionCase.expectRendered(avatar)
      })
    })
  })
}
