"use client"
import { useEffect, useState } from "react"
const Link = ({ href, children }) => <a href={href}>{children}</a>
import {
  CheckboxGroupField,
  DialogModal,
  InputField,
  MarwesProvider,
  RichTextField,
  TabGroup,
  ToastProvider,
  useToast,
} from "@marwes-ui/react"

function Controls({ initialOpen }) {
  const [contact, setContact] = useState("Server contact")
  const [changes, setChanges] = useState(0)
  const [open, setOpen] = useState(initialOpen)
  const [rich, setRich] = useState("<p>Server notes</p>")
  const [richChanges, setRichChanges] = useState(0)
  const [ready, setReady] = useState(false)
  const toast = useToast()
  useEffect(() => setReady(true), [])
  return (
    <>
      <span data-testid="hydrated">{ready ? "ready" : "server"}</span>
      <InputField
        label="Contact"
        input={{
          value: contact,
          onValueChange: (value) => {
            setContact(value)
            setChanges((count) => count + 1)
          },
        }}
      />
      <output data-testid="changes">{changes}</output>
      <RichTextField
        label="Notes"
        editor={{
          value: rich,
          onValueChange: (value) => {
            setRich(value)
            setRichChanges((count) => count + 1)
          },
        }}
      />
      <output data-testid="rich-changes">{richChanges}</output>
      <CheckboxGroupField
        label="Channels"
        options={[
          { value: "email", label: "Email" },
          { value: "sms", label: "SMS" },
        ]}
        defaultValue={["sms"]}
      />
      <TabGroup
        ariaLabel="Sections"
        tabs={[
          { value: "one", label: "First", panel: "First panel" },
          { value: "two", label: "Second", panel: "Second panel" },
        ]}
        defaultActiveTab="two"
      />
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>
      <DialogModal open={open} onOpenChange={setOpen} title="SSR modal" dismissible={false}>
        <input aria-label="Modal input" />
        <button type="button">Done</button>
      </DialogModal>
      <button
        type="button"
        onClick={() => toast.show({ children: "Saved project", duration: null })}
      >
        Show toast
      </button>
    </>
  )
}
export default function App(props) {
  return (
    <MarwesProvider
      defaultPreference={props.preference}
      storageKey="marwes-ssr-theme"
      variableStrategy={props.strategy}
    >
      <ToastProvider>
        <h1>{props.secondPage ? "Second page" : "SSR fixture"}</h1>
        <div
          data-testid="theme-sample"
          style={{
            backgroundColor: "var(--mw-color-background)",
            color: "var(--mw-color-text)",
            padding: "1rem",
          }}
        >
          Theme sample
        </div>
        <Controls initialOpen={props.initialOpen} />
        <Link href={`/${props.preference}/${props.strategy}?view=next`}>Next page</Link>
      </ToastProvider>
    </MarwesProvider>
  )
}
