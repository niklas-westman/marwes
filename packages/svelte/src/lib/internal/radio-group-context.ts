import { getContext, setContext } from "svelte"

const radioGroupContextKey = Symbol("mw-radio-group")

export interface RadioGroupContext {
  readonly disabled: boolean
}

export function provideRadioGroupContext(context: RadioGroupContext): void {
  setContext(radioGroupContextKey, context)
}

export function useRadioGroupContext(): RadioGroupContext | undefined {
  return getContext<RadioGroupContext | undefined>(radioGroupContextKey)
}
