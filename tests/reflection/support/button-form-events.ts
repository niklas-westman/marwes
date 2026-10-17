/** Observable effects of real public button callbacks and native form events. */
export type ButtonFormKind = "submit" | "reset"

export function buttonFormKind(path: string): ButtonFormKind | undefined {
  return /^\/reflection\/button\/behavior-(submit|reset)\/(light|dark)$/.exec(path)?.[1] as
    | ButtonFormKind
    | undefined
}

function output(form: HTMLFormElement, name: string) {
  const node = form.querySelector<HTMLOutputElement>(`[data-testid="button-behavior-${name}"]`)
  if (!node) throw Error(`Missing button behavior output: ${name}`)
  return node
}

function increment(form: HTMLFormElement, name: string) {
  const node = output(form, name)
  node.textContent = String(Number(node.textContent) + 1)
}

export function recordFormButtonCallback(event: { currentTarget: EventTarget | null }) {
  const button = event.currentTarget
  if (!(button instanceof HTMLButtonElement) || !button.form)
    throw Error("Behavior button has no native form association")
  increment(button.form, "callback-count")
}

export function recordNativeSubmit(event: {
  currentTarget: EventTarget | null
  preventDefault(): void
}) {
  if (!(event.currentTarget instanceof HTMLFormElement))
    throw Error("Submit did not originate on a form")
  const form = event.currentTarget
  increment(form, "submit-count")
  output(form, "submitted-value").textContent = String(new FormData(form).get("message") ?? "")
  event.preventDefault()
}

export function recordNativeReset(event: { currentTarget: EventTarget | null }) {
  if (!(event.currentTarget instanceof HTMLFormElement))
    throw Error("Reset did not originate on a form")
  increment(event.currentTarget, "reset-count")
  // Leave default handling intact: the browser must restore the input's initial value.
}
