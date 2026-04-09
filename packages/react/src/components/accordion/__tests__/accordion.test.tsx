import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Accordion, type AccordionProps } from "../accordion"

function renderAccordion(props: Partial<AccordionProps> = {}) {
  return render(
    <MarwesProvider>
      <Accordion {...props} title={props.title ?? "Test title"}>
        {props.children ?? "Test content"}
      </Accordion>
    </MarwesProvider>,
  )
}

describe("React Accordion atom", () => {
  it("renders trigger button and panel", () => {
    renderAccordion({ id: "acc-1", open: true })

    expect(screen.getByRole("button", { name: /test title/i })).toBeTruthy()
    expect(screen.getByRole("region")).toBeTruthy()
  })

  it("calls onToggle when the trigger is clicked", async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()

    renderAccordion({ id: "acc-2", onToggle })

    await user.click(screen.getByRole("button", { name: /test title/i }))

    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it("marks the trigger as disabled and prevents toggles when disabled", async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()

    renderAccordion({ id: "acc-3", disabled: true, onToggle })

    const trigger = screen.getByRole("button", { name: /test title/i })
    expect(trigger).toBeDisabled()

    await user.click(trigger)

    expect(onToggle).not.toHaveBeenCalled()
  })

  it("generates aria ids when id is omitted", () => {
    renderAccordion({ open: true })

    const trigger = screen.getByRole("button", { name: /test title/i })
    const panel = screen.getByRole("region")

    expect(trigger.id).toMatch(/^r[^-]*-trigger$/)
    expect(panel.id).toMatch(/^r[^-]*-panel$/)
    expect(trigger).toHaveAttribute("aria-controls", panel.id)
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id)
  })

  it("works in a controlled open-state flow", async () => {
    const user = userEvent.setup()

    function ControlledAccordion(): React.ReactElement {
      const [open, setOpen] = React.useState(false)

      return (
        <MarwesProvider>
          <Accordion
            id="acc-4"
            open={open}
            title="Toggle me"
            onToggle={() => {
              setOpen((isOpen) => !isOpen)
            }}
          >
            Panel content
          </Accordion>
        </MarwesProvider>
      )
    }

    render(<ControlledAccordion />)

    const trigger = screen.getByRole("button", { name: /toggle me/i })

    expect(screen.getByText("Panel content").closest("[hidden]")).not.toBeNull()

    await user.click(trigger)
    expect(screen.getByText("Panel content").closest("[hidden]")).toBeNull()

    await user.click(trigger)
    expect(screen.getByText("Panel content").closest("[hidden]")).not.toBeNull()
  })
})
