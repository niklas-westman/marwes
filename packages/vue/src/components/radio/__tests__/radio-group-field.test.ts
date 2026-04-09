import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { RadioGroupField, type RadioGroupFieldProps } from "../radio-group-field"

function renderWithProvider(props: RadioGroupFieldProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(RadioGroupField, props) })
      },
    }),
  )
}

const testOptions = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" },
]

describe("RadioGroupField", () => {
  it("renders role=radiogroup with label association", () => {
    renderWithProvider({ name: "test", label: "Pick one", options: testOptions })

    const group = screen.getByRole("radiogroup", { name: /pick one/i })
    expect(group).toBeTruthy()
  })

  it("uncontrolled selection switches options", async () => {
    const user = userEvent.setup()

    renderWithProvider({
      name: "test",
      label: "Pick one",
      options: testOptions,
      defaultValue: "a",
    })

    const alphaRadio = screen.getByRole("radio", { name: /alpha/i })
    const betaRadio = screen.getByRole("radio", { name: /beta/i })

    expect(alphaRadio).toBeChecked()
    expect(betaRadio).not.toBeChecked()

    await user.click(betaRadio)

    expect(betaRadio).toBeChecked()
    expect(alphaRadio).not.toBeChecked()
  })

  it("controlled mode calls onChange", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderWithProvider({
      name: "test",
      label: "Pick one",
      options: testOptions,
      value: "a",
      onChange,
    })

    await user.click(screen.getByRole("radio", { name: /beta/i }))
    expect(onChange).toHaveBeenCalledWith("b")
  })

  it("keeps description above the options and wires aria-describedby", () => {
    renderWithProvider({
      name: "test",
      label: "Pick one",
      options: testOptions,
      description: "Choose your favorite",
    })

    const group = screen.getByRole("radiogroup")
    const descriptionText = screen.getByText("Choose your favorite")
    const descriptionEl = descriptionText.closest("[id]") as HTMLElement | null
    const describedBy = group.getAttribute("aria-describedby") ?? ""
    const wrapperChildren = Array.from(group.parentElement?.children ?? [])

    expect(descriptionEl).not.toBeNull()
    expect(describedBy.split(/\s+/)).toContain(descriptionEl?.id ?? "")
    expect(wrapperChildren.indexOf(descriptionEl as HTMLElement)).toBeLessThan(
      wrapperChildren.indexOf(group),
    )
  })

  it("shows error, marks the group invalid, and propagates invalid state to radios", () => {
    renderWithProvider({
      name: "test",
      label: "Pick one",
      options: testOptions,
      error: "Selection required",
    })

    const group = screen.getByRole("radiogroup")
    expect(group.getAttribute("aria-invalid")).toBe("true")

    for (const radio of screen.getAllByRole("radio")) {
      expect(radio.getAttribute("aria-invalid")).toBe("true")
    }

    expect(screen.getByText("Selection required").closest('[aria-live="polite"]')).not.toBeNull()
  })
})
