import { Button, SubmitButton } from "@marwes-ui/react"
import {
  type ButtonFormKind,
  recordFormButtonCallback,
  recordNativeReset,
  recordNativeSubmit,
} from "./button-form-events"

export function ButtonFormReact({ kind }: { kind: ButtonFormKind }) {
  const props = {
    onClick: recordFormButtonCallback,
    dataAttributes: { "data-testid": "button-behavior-trigger" },
  }
  return (
    <form
      data-testid="button-behavior-form"
      onSubmit={recordNativeSubmit}
      onReset={recordNativeReset}
    >
      <label>
        Message <input data-testid="button-behavior-input" name="message" defaultValue="original" />
      </label>
      {kind === "submit" ? (
        <SubmitButton {...props}>Submit</SubmitButton>
      ) : (
        <Button {...props} type="reset">
          Reset
        </Button>
      )}
      <output data-testid="button-behavior-callback-count">0</output>
      <output data-testid="button-behavior-submit-count">0</output>
      <output data-testid="button-behavior-reset-count">0</output>
      <output data-testid="button-behavior-submitted-value" />
    </form>
  )
}
