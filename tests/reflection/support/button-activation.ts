/** Observe the public adapter callback without changing the visible design fixture. */
export function recordButtonActivation(event: { currentTarget: EventTarget | null }) {
  const target = event.currentTarget
  if (!(target instanceof Element)) throw Error("Button activation has no current target")
  const output = target
    .closest("[data-governance-button-fixture]")
    ?.querySelector("[data-governance-button-activations]")
  if (!output) throw Error("Missing Button activation evidence output")
  output.textContent = String(Number(output.textContent) + 1)
}

export function installButtonActivationOutput(root: HTMLElement): () => void {
  root.setAttribute("data-governance-button-fixture", "")
  const output = document.createElement("output")
  output.hidden = true
  output.setAttribute("data-governance-button-activations", "")
  output.textContent = "0"
  root.append(output)
  return () => {
    output.remove()
    root.removeAttribute("data-governance-button-fixture")
  }
}
