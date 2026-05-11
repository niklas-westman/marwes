/**
 * Vue adapter: Tests the Rich Text component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { type Component, defineComponent, h } from "vue"
import { runRichTextContract } from "../../../../../../tests/contracts/rich-text.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { RichText } from "../rich-text"

type RichTextCommandDocument = Document & {
  execCommand?: (commandId: string) => boolean
  queryCommandState?: (commandId: string) => boolean
}

function getRichTextCommandDocument(): RichTextCommandDocument {
  return document as unknown as RichTextCommandDocument
}

function renderWithProvider(component: Component, props: Record<string, unknown>) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(component, props) })
      },
    }),
  )
}

runRichTextContract("vue", {
  async renderRichText(args = {}) {
    const props = {
      ariaLabel: args.ariaLabel ?? "Rich text",
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.readOnly !== undefined ? { readOnly: args.readOnly } : {}),
      ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
      ...(args.onValueChange ? { "onUpdate:modelValue": args.onValueChange } : {}),
    }

    renderWithProvider(RichText, props)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLDivElement
  },
  async type(element, text) {
    await userEvent.setup().type(element, text)
  },
})

describe("Vue RichText toolbar", () => {
  it("renders formatting buttons by default", () => {
    renderWithProvider(RichText, { ariaLabel: "Editor" })

    expect(screen.getByRole("button", { name: /bold/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /italic/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /underline/i })).toBeInTheDocument()
  })

  it("invokes document.execCommand for toolbar formatting actions", async () => {
    const execCommandMock = vi.fn()
    getRichTextCommandDocument().execCommand = execCommandMock

    renderWithProvider(RichText, { ariaLabel: "Editor", defaultValue: "Hello world" })

    await userEvent.setup().click(screen.getByRole("button", { name: /bold/i }))

    expect(execCommandMock).toHaveBeenCalledWith("bold")
  })

  it("marks the toolbar button active when formatting is toggled before typing", async () => {
    let boldIsActive = false
    const richTextDocument = getRichTextCommandDocument()

    richTextDocument.execCommand = vi.fn((commandId: string) => {
      if (commandId === "bold") {
        boldIsActive = !boldIsActive
      }
      return true
    })
    richTextDocument.queryCommandState = vi.fn((commandId: string) => {
      if (commandId === "bold") {
        return boldIsActive
      }
      return false
    })

    renderWithProvider(RichText, { ariaLabel: "Editor" })

    const boldButton = screen.getByRole("button", { name: /bold/i })
    await userEvent.setup().click(boldButton)

    expect(boldButton).toHaveAttribute("aria-pressed", "true")
  })

  it("lets a collapsed caret exit bold without selecting a range", async () => {
    renderWithProvider(RichText, { ariaLabel: "Editor", defaultValue: "<strong>Hello</strong>" })

    const editor = screen.getByRole("textbox", { name: /editor/i }) as HTMLDivElement
    const strongTextNode = editor.querySelector("strong")?.firstChild
    const selection = window.getSelection()
    const range = document.createRange()

    if (!strongTextNode || !selection) {
      throw new Error("Expected a bold text node inside the editor")
    }

    editor.focus()
    range.setStart(strongTextNode, strongTextNode.textContent?.length ?? 0)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    document.dispatchEvent(new Event("selectionchange"))

    const boldButton = screen.getByRole("button", { name: /bold/i })
    await userEvent.setup().click(boldButton)

    expect(boldButton).toHaveAttribute("aria-pressed", "false")
  })

  it("keeps italic active when bold is toggled off at a collapsed caret", async () => {
    const commandState: Record<string, boolean> = {
      bold: false,
      italic: false,
      underline: false,
    }
    const richTextDocument = getRichTextCommandDocument()

    richTextDocument.execCommand = vi.fn((commandId: string) => {
      commandState[commandId] = !commandState[commandId]
      return true
    })
    richTextDocument.queryCommandState = vi.fn(
      (commandId: string) => commandState[commandId] ?? false,
    )

    renderWithProvider(RichText, {
      ariaLabel: "Editor",
      defaultValue: "<strong><em>Hello</em></strong>",
    })

    const editor = screen.getByRole("textbox", { name: /editor/i }) as HTMLDivElement
    const textNode = editor.querySelector("em")?.firstChild
    const selection = window.getSelection()
    const range = document.createRange()

    if (!textNode || !selection) {
      throw new Error("Expected nested bold/italic text inside the editor")
    }

    editor.focus()
    range.setStart(textNode, textNode.textContent?.length ?? 0)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    document.dispatchEvent(new Event("selectionchange"))

    const boldButton = screen.getByRole("button", { name: /bold/i })
    const italicButton = screen.getByRole("button", { name: /italic/i })

    await userEvent.setup().click(boldButton)

    expect(boldButton).toHaveAttribute("aria-pressed", "false")
    expect(italicButton).toHaveAttribute("aria-pressed", "true")
  })

  it("hides the toolbar in read-only mode", () => {
    renderWithProvider(RichText, { ariaLabel: "Editor", readOnly: true, defaultValue: "Read only" })

    expect(screen.queryByRole("button", { name: /bold/i })).toBeNull()
  })
})
