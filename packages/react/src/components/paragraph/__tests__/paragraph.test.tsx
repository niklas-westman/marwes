import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { Paragraph } from ".."
import { runParagraphContract } from "../../../../../../tests/contracts/paragraph.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runParagraphContract("react", {
  async renderParagraph(args) {
    const paragraphProps = {
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.id !== undefined ? { id: args.id } : {}),
    }

    renderWithProvider(<Paragraph {...paragraphProps}>{args.text}</Paragraph>)
  },
  getByText(text) {
    return screen.getByText(text)
  },
})
