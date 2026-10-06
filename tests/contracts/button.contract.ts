/**
 * Shared contract for the Button atom's cross-adapter behavior.
 *
 * Tests the fundamental button interactions that must work identically in
 * React, Vue, and Svelte: click handling, loading/busy/disabled state,
 * loading options (loadingLabel, disableWhileLoading), custom data attributes,
 * anchor link rendering, and click suppression for disabled/loading controls.
 */
import type { ButtonOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export type ButtonContractLoading =
  | boolean
  | { isLoading: boolean; disableWhileLoading?: boolean; loadingLabel?: string }

export type ButtonContractDataAttributes = Record<string, string | boolean | undefined>

export type ButtonContractHarness = {
  renderPrimary(args?: {
    text?: string
    type?: "button" | "submit" | "reset"
    ariaLabelledBy?: string
    disabled?: boolean
    loading?: ButtonContractLoading
    dataAttributes?: ButtonContractDataAttributes
    onClick?: () => void
  }): Promise<void> | void
  renderLink(args: {
    text: string
    href: string
    disabled?: boolean
    loading?: ButtonContractLoading
    dataAttributes?: ButtonContractDataAttributes
    onClick?: () => void
  }): Promise<void> | void
  /** Renders the base Button with raw core options, bypassing variant wrappers. */
  renderButton(options: ButtonOptions, text?: string): Promise<void> | void
  getButtonElement(): HTMLElement
  getByRole(role: "button" | "link", options: { name: RegExp }): HTMLElement
  click(element: HTMLElement): Promise<void>
}

type ButtonOptionCase = {
  options: ButtonOptions
  text?: string
  /** Why the option has no observable DOM effect; the case then only asserts it renders. */
  noDomEffect?: string
  expectRendered?: (button: HTMLElement) => void
}

// Exhaustive on purpose: a new core ButtonOptions field fails to compile here until every
// adapter's handling of it is described by a case, so no adapter can silently ignore it.
const buttonOptionCases: Record<keyof ButtonOptions, ButtonOptionCase> = {
  as: {
    options: { as: "a" },
    expectRendered: (button) => expect(button.tagName).toBe("A"),
  },
  href: {
    options: { href: "/docs" },
    expectRendered: (button) => {
      expect(button.tagName).toBe("A")
      expect(button).toHaveAttribute("href", "/docs")
    },
  },
  type: {
    options: { type: "reset" },
    expectRendered: (button) => expect(button).toHaveAttribute("type", "reset"),
  },
  size: {
    options: { size: "lg" },
    expectRendered: (button) => {
      expect(button).toHaveClass("mw-btn--lg")
      expect(button).toHaveAttribute("data-size", "lg")
    },
  },
  variant: {
    options: { variant: "danger" },
    expectRendered: (button) => {
      expect(button).toHaveClass("mw-btn--danger")
      expect(button).toHaveAttribute("data-variant", "danger")
    },
  },
  disabled: {
    options: { disabled: true },
    expectRendered: (button) => {
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute("aria-disabled", "true")
    },
  },
  loading: {
    options: { loading: true },
    expectRendered: (button) => expect(button).toHaveAttribute("aria-busy", "true"),
  },
  error: {
    options: { error: true },
    expectRendered: (button) => {
      expect(button).toHaveClass("mw-btn--error")
      expect(button).toHaveAttribute("data-error", "true")
    },
  },
  toggle: {
    options: { toggle: true },
    expectRendered: (button) => expect(button).toHaveAttribute("aria-pressed", "false"),
  },
  pressed: {
    options: { toggle: true, pressed: true },
    expectRendered: (button) => expect(button).toHaveAttribute("aria-pressed", "true"),
  },
  ariaLabel: {
    options: { ariaLabel: "Save draft" },
    expectRendered: (button) => expect(button).toHaveAttribute("aria-label", "Save draft"),
  },
  ariaLabelledBy: {
    options: { ariaLabelledBy: "external-label" },
    expectRendered: (button) => expect(button).toHaveAttribute("aria-labelledby", "external-label"),
  },
  label: {
    options: { label: "Save draft" },
    expectRendered: (button) => expect(button).toHaveAttribute("aria-label", "Save draft"),
  },
  hasVisibleText: {
    options: { hasVisibleText: false, ariaLabel: "Close" },
    noDomEffect: "only drives a development warning for missing accessible names",
  },
  ariaExpanded: {
    options: { ariaExpanded: true },
    expectRendered: (button) => expect(button).toHaveAttribute("aria-expanded", "true"),
  },
  ariaControls: {
    options: { ariaControls: "panel-1" },
    expectRendered: (button) => expect(button).toHaveAttribute("aria-controls", "panel-1"),
  },
  iconLeft: {
    options: { iconLeft: "plus" },
    text: "Add",
    expectRendered: (button) => {
      expect(button.querySelector(":scope > svg")).not.toBeNull()
      expect(button).toHaveAttribute("data-has-affordance", "true")
    },
  },
  iconRight: {
    options: { iconRight: "checkCircle" },
    text: "Done",
    expectRendered: (button) => {
      expect(button.querySelector(":scope > svg")).not.toBeNull()
      expect(button).toHaveAttribute("data-has-affordance", "true")
    },
  },
  iconOnly: {
    options: { iconOnly: true, iconLeft: "plus", label: "Add" },
    text: "",
    expectRendered: (button) => expect(button).toHaveAttribute("data-icon-only", "true"),
  },
  action: {
    options: { action: "submit" },
    expectRendered: (button) => {
      expect(button).toHaveAttribute("data-action", "submit")
      expect(button).toHaveAttribute("type", "submit")
    },
  },
  tooltip: {
    options: { tooltip: "Saves the draft" },
    expectRendered: (button) => expect(button).toHaveAttribute("title", "Saves the draft"),
  },
  confirmation: {
    options: { confirmation: true },
    noDomEffect: "accepted by ButtonOptions but not read by the recipe today",
  },
  dataAttributes: {
    options: { dataAttributes: { "data-track-id": "case" } },
    expectRendered: (button) => expect(button).toHaveAttribute("data-track-id", "case"),
  },
}

// Dispatches a native cancelable click so we can observe whether the adapter
// called preventDefault, which the harness `click` helper cannot report.
function dispatchCancelableClick(element: HTMLElement): MouseEvent {
  const event = new MouseEvent("click", { bubbles: true, cancelable: true })
  element.dispatchEvent(event)
  return event
}

function getLabelText(button: HTMLElement): string {
  return button.querySelector(".mw-btn__label")?.textContent ?? ""
}

export function runButtonContract(adapterName: string, h: ButtonContractHarness): void {
  describe(`Button contract: ${adapterName}`, () => {
    it("PrimaryButton renders a button and calls onClick", async () => {
      let clicks = 0

      await h.renderPrimary({
        text: "Save",
        onClick: () => {
          clicks += 1
        },
      })

      const button = h.getByRole("button", { name: /save/i })
      expect(button).toHaveAttribute("type", "button")
      await h.click(button)

      expect(clicks).toBe(1)
    })

    it.each(["submit", "reset"] as const)("PrimaryButton supports native type=%s", async (type) => {
      await h.renderPrimary({ text: "Form action", type })

      const button = h.getByRole("button", { name: /form action/i })
      expect(button).toHaveAttribute("type", type)
      expect(button).toHaveAttribute("data-action", type)
    })

    it("forwards ariaLabelledBy through the variant wrapper", async () => {
      await h.renderPrimary({ text: "Continue", ariaLabelledBy: "external-label" })

      const button = h.getByRole("button", { name: /continue/i })
      expect(button).toHaveAttribute("aria-labelledby", "external-label")
    })

    it("renders visible text inside the button label slot", async () => {
      await h.renderPrimary({
        text: "Save",
      })

      const button = h.getByRole("button", { name: /save/i })
      const label = button.querySelector(".mw-btn__label")

      expect(label).not.toBeNull()
      expect(label).toHaveTextContent("Save")
    })

    it("loading PrimaryButton is busy and disabled", async () => {
      await h.renderPrimary({
        text: "Saving",
        loading: true,
      })

      const button = h.getByRole("button", { name: /saving/i })
      expect(button).toHaveAttribute("aria-busy", "true")
      expect(button).toHaveAttribute("aria-disabled", "true")
      expect(button).toBeDisabled()
    })

    it("LinkButton renders a navigation link element backed by an anchor href", async () => {
      await h.renderLink({
        text: "Dashboard",
        href: "/dashboard",
      })

      const linkButton = h.getByRole("link", { name: /dashboard/i })
      expect(linkButton.tagName).toBe("A")
      expect(linkButton).toHaveAttribute("href", "/dashboard")
      expect(linkButton).not.toHaveAttribute("role")
    })

    it("disabled LinkButton keeps link intent through aria-disabled and blocks click handler", async () => {
      let clicks = 0

      await h.renderLink({
        text: "Disabled link",
        href: "/dashboard",
        disabled: true,
        onClick: () => {
          clicks += 1
        },
      })

      const linkButton = h.getByRole("link", { name: /disabled link/i })
      expect(linkButton).toHaveAttribute("aria-disabled", "true")
      expect(linkButton).toHaveAttribute("role", "link")
      expect(linkButton).toHaveAttribute("tabindex", "-1")
      expect(linkButton).not.toHaveAttribute("href")

      await h.click(linkButton)
      expect(clicks).toBe(0)
    })

    describe("loading options", () => {
      it("loadingLabel replaces the visible children while loading", async () => {
        await h.renderPrimary({
          text: "Create order",
          loading: { isLoading: true, loadingLabel: "Working…" },
        })

        const button = h.getByRole("button", { name: /working/i })
        expect(getLabelText(button)).toBe("Working…")
        expect(button).not.toHaveTextContent("Create order")
      })

      it("an empty loadingLabel still replaces the children instead of falling back to them", async () => {
        await h.renderPrimary({
          text: "Create order",
          loading: { isLoading: true, loadingLabel: "" },
        })

        const button = h.getByRole("button", { name: /.*/ })
        expect(button).toHaveAttribute("aria-busy", "true")
        expect(button).not.toHaveTextContent("Create order")
        expect(getLabelText(button)).toBe("")
      })

      it("ignores loadingLabel when not loading", async () => {
        await h.renderPrimary({
          text: "Create order",
          loading: { isLoading: false, loadingLabel: "Working…" },
        })

        const button = h.getByRole("button", { name: /create order/i })
        expect(getLabelText(button)).toBe("Create order")
        expect(button).not.toHaveAttribute("aria-busy")
        expect(button).not.toHaveAttribute("data-has-affordance")
        expect(button.querySelector('[data-component="spinner"]')).toBeNull()
      })

      it("renders a spinner and marks the affordance while loading", async () => {
        await h.renderPrimary({ text: "Saving", loading: { isLoading: true } })

        const button = h.getByRole("button", { name: /saving/i })
        expect(button.querySelector('[data-component="spinner"]')).not.toBeNull()
        expect(button).toHaveAttribute("data-has-affordance", "true")
      })

      it("object-form loading disables the button by default", async () => {
        await h.renderPrimary({ text: "Saving", loading: { isLoading: true } })

        const button = h.getByRole("button", { name: /saving/i })
        expect(button).toHaveAttribute("aria-busy", "true")
        expect(button).toHaveAttribute("aria-disabled", "true")
        expect(button).toBeDisabled()
      })

      it("disableWhileLoading=false keeps the button busy but interactive", async () => {
        let clicks = 0

        await h.renderPrimary({
          text: "Refresh",
          loading: { isLoading: true, disableWhileLoading: false },
          onClick: () => {
            clicks += 1
          },
        })

        const button = h.getByRole("button", { name: /refresh/i })
        expect(button).toHaveAttribute("aria-busy", "true")
        expect(button).not.toHaveAttribute("aria-disabled")
        expect(button).not.toBeDisabled()

        await h.click(button)
        expect(clicks).toBe(1)
      })
    })

    describe("custom data attributes", () => {
      it("forwards custom data attributes to the button and keeps the recipe attributes", async () => {
        await h.renderPrimary({
          text: "Track me",
          dataAttributes: { "data-track-id": "save-primary", "data-flag": true },
        })

        const button = h.getByRole("button", { name: /track me/i })
        expect(button).toHaveAttribute("data-track-id", "save-primary")
        expect(button).toHaveAttribute("data-flag", "true")
        expect(button).toHaveAttribute("data-action", "button")
      })

      it("omits custom data attributes whose value is undefined", async () => {
        await h.renderPrimary({
          text: "Track me",
          dataAttributes: { "data-track-id": undefined },
        })

        const button = h.getByRole("button", { name: /track me/i })
        expect(button).not.toHaveAttribute("data-track-id")
      })

      it("forwards custom data attributes to LinkButton and keeps navigation semantics", async () => {
        await h.renderLink({
          text: "Dashboard",
          href: "/dashboard",
          dataAttributes: { "data-track-id": "nav-dashboard" },
        })

        const linkButton = h.getByRole("link", { name: /dashboard/i })
        expect(linkButton).toHaveAttribute("data-track-id", "nav-dashboard")
        expect(linkButton).toHaveAttribute("data-action", "navigate")
      })
    })

    describe("click suppression", () => {
      it("disabled PrimaryButton does not call onClick", async () => {
        let clicks = 0

        await h.renderPrimary({
          text: "Disabled",
          disabled: true,
          onClick: () => {
            clicks += 1
          },
        })

        await h.click(h.getByRole("button", { name: /disabled/i }))
        expect(clicks).toBe(0)
      })

      it("loading PrimaryButton does not call onClick", async () => {
        let clicks = 0

        await h.renderPrimary({
          text: "Saving",
          loading: true,
          onClick: () => {
            clicks += 1
          },
        })

        await h.click(h.getByRole("button", { name: /saving/i }))
        expect(clicks).toBe(0)
      })

      it("disabled LinkButton prevents the default navigation", async () => {
        await h.renderLink({ text: "Disabled link", href: "/dashboard", disabled: true })

        const linkButton = h.getByRole("link", { name: /disabled link/i })
        expect(dispatchCancelableClick(linkButton).defaultPrevented).toBe(true)
      })

      it("loading LinkButton is inert: no href, no onClick, default prevented", async () => {
        let clicks = 0

        await h.renderLink({
          text: "View docs",
          href: "/docs",
          loading: true,
          onClick: () => {
            clicks += 1
          },
        })

        const linkButton = h.getByRole("link", { name: /view docs/i })
        expect(linkButton).toHaveAttribute("aria-busy", "true")
        expect(linkButton).toHaveAttribute("aria-disabled", "true")
        expect(linkButton).toHaveAttribute("tabindex", "-1")
        expect(linkButton).not.toHaveAttribute("href")

        await h.click(linkButton)
        expect(clicks).toBe(0)
        expect(dispatchCancelableClick(linkButton).defaultPrevented).toBe(true)
      })

      it("loading LinkButton with disableWhileLoading=false stays navigable", async () => {
        let clicks = 0

        await h.renderLink({
          text: "View docs",
          href: "/docs",
          loading: { isLoading: true, disableWhileLoading: false },
          onClick: () => {
            clicks += 1
          },
        })

        const linkButton = h.getByRole("link", { name: /view docs/i })
        expect(linkButton).toHaveAttribute("aria-busy", "true")
        expect(linkButton).not.toHaveAttribute("aria-disabled")
        expect(linkButton).toHaveAttribute("href", "/docs")

        // jsdom does not implement navigation; cancel it after the adapter handlers ran
        const cancelNavigation = (event: Event): void => event.preventDefault()
        document.addEventListener("click", cancelNavigation)
        try {
          await h.click(linkButton)
        } finally {
          document.removeEventListener("click", cancelNavigation)
        }
        expect(clicks).toBe(1)
      })
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(buttonOptionCases))("%s", async (_optionName, optionCase) => {
        await h.renderButton(optionCase.options, optionCase.text ?? "Case")

        const button = h.getButtonElement()
        expect(button).toBeInTheDocument()
        optionCase.expectRendered?.(button)
      })
    })
  })
}
