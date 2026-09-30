import { ErrorToast, InfoToast, SuccessToast, Toast, WarningToast } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const dismiss = (id: string) => setDismissed((prev) => new Set([...prev, id]))

  return (
    <>
      {!dismissed.has("neutral") && (
        <Toast variant="subtle" onDismiss={() => dismiss("neutral")}>
          Neutral message
        </Toast>
      )}
      {!dismissed.has("info") && (
        <InfoToast variant="subtle" onDismiss={() => dismiss("info")}>
          Meeting starts in 10 min
        </InfoToast>
      )}
      {!dismissed.has("success") && (
        <SuccessToast variant="subtle" onDismiss={() => dismiss("success")}>
          Your email is verified
        </SuccessToast>
      )}
      {!dismissed.has("warning") && (
        <WarningToast variant="subtle" onDismiss={() => dismiss("warning")}>
          Connection unstable
        </WarningToast>
      )}
      {!dismissed.has("error") && (
        <ErrorToast variant="subtle" onDismiss={() => dismiss("error")}>
          Something went wrong
        </ErrorToast>
      )}
    </>
  )
}
