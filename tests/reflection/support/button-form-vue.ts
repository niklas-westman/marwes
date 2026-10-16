import { Button, SubmitButton } from "@marwes-ui/vue"
import { h } from "vue"
import {
  type ButtonFormKind,
  recordFormButtonCallback,
  recordNativeReset,
  recordNativeSubmit,
} from "./button-form-events"

export function renderButtonFormVue(kind: ButtonFormKind) {
  return h(
    "form",
    {
      "data-testid": "button-behavior-form",
      onSubmit: recordNativeSubmit,
      onReset: recordNativeReset,
    },
    [
      h("label", [
        "Message ",
        h("input", {
          "data-testid": "button-behavior-input",
          name: "message",
          defaultValue: "original",
        }),
      ]),
      h(
        kind === "submit" ? SubmitButton : Button,
        {
          ...(kind === "reset" ? { type: "reset" } : {}),
          onClick: recordFormButtonCallback,
          dataAttributes: { "data-testid": "button-behavior-trigger" },
        },
        { default: () => (kind === "submit" ? "Submit" : "Reset") },
      ),
      ...["callback-count", "submit-count", "reset-count"].map((name) =>
        h("output", { "data-testid": `button-behavior-${name}` }, "0"),
      ),
      h("output", { "data-testid": "button-behavior-submitted-value" }),
    ],
  )
}
