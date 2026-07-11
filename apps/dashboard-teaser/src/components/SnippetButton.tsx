import { useState } from "react"

import type { Framework } from "../sections/installation-recipes"
import { CodeIconButton } from "./CodeIconButton"
import { CodeSnippetModal } from "./CodeSnippetModal"

type SnippetButtonProps = {
  title: string
  snippets: Record<Framework, string>
}

function SnippetButton({ title, snippets }: SnippetButtonProps): JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <>
      <CodeIconButton ariaLabel={`View ${title} code example`} onClick={() => setOpen(true)} />
      <CodeSnippetModal open={open} onOpenChange={setOpen} title={title} snippets={snippets} />
    </>
  )
}

export { SnippetButton }
export type { SnippetButtonProps }
