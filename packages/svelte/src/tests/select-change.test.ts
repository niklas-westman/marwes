import "@testing-library/jest-dom/vitest"
import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import Select from "../lib/components/input/Select.svelte"
import SelectField from "../lib/components/input/SelectField.svelte"
import WithProviderFixture from "./type-fixtures/WithProviderFixture.svelte"

const options = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
]

describe("Select change events", () => {
  it("fires onchange and onvaluechange from the atom", async () => {
    const onchange = vi.fn()
    const onvaluechange = vi.fn()
    render(WithProviderFixture, {
      props: {
        Component: Select,
        props: { options, "aria-label": "Pick", onchange, onvaluechange },
      },
    })

    await fireEvent.change(screen.getByRole("combobox"), { target: { value: "b" } })

    expect(onchange).toHaveBeenCalledOnce()
    expect(onvaluechange).toHaveBeenCalledWith("b")
  })

  it("forwards native onchange through SelectField", async () => {
    const onchange = vi.fn()
    const onvaluechange = vi.fn()
    render(WithProviderFixture, {
      props: {
        Component: SelectField,
        props: { label: "Pick", select: { options, native: true, onchange, onvaluechange } },
      },
    })

    await fireEvent.change(screen.getByRole("combobox"), { target: { value: "b" } })

    expect(onchange).toHaveBeenCalledOnce()
    expect(onvaluechange).toHaveBeenCalledWith("b")
  })
})
