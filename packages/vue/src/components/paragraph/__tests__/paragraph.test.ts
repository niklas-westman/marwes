/**
 * Vue adapter: Tests the Paragraph component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { Paragraph } from ".."
import { runParagraphContract } from "../../../../../../tests/contracts/paragraph.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(
  component: unknown,
  props: Record<string, unknown> = {},
  text?: string,
) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(component as never, props, {
                default: text ? () => text : undefined,
              }),
          })
      },
    }),
  )
}

runParagraphContract("vue", {
  async renderParagraph(args) {
    const paragraphProps = {
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.id !== undefined ? { id: args.id } : {}),
    }

    renderWithProvider(Paragraph, paragraphProps, args.text)
  },
  getByText(text) {
    return screen.getByText(text)
  },
})
