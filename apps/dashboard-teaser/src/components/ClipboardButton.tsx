import { Button, ButtonVariant, IconName } from "@marwes-ui/react"
import { useEffect, useState } from "react"
import styled from "styled-components"

type CopyPhase = "idle" | "pending" | "success" | "error"

type CopyState = {
  status: CopyPhase
  value: string | null
}

const CopyControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sp4};
  flex-shrink: 0;
`

const CopyStatus = styled.output<{ $error: boolean }>`
  max-width: 12rem;
  color: ${({ theme, $error }) => ($error ? theme.color.status.error.text : theme.color.textMuted)};
  font-size: 0.75rem;
  line-height: 1.4;
  text-align: right;
`

const StyledButton = styled(Button)`
  && {
    width: ${({ theme }) => `calc(${theme.spacing.sp16} + ${theme.spacing.sp4})`};
    height: ${({ theme }) => `calc(${theme.spacing.sp16} + ${theme.spacing.sp4})`};
    flex-shrink: 0;
    padding: 0;
  }
`

type ClipboardButtonProps = {
  value: string
  label: string
  className?: string
}

function ClipboardButton({ value, label, className }: ClipboardButtonProps): JSX.Element {
  const [copyState, setCopyState] = useState<CopyState>({ status: "idle", value: null })
  const state = copyState.value === value ? copyState.status : "idle"

  useEffect(() => {
    if (state !== "success") return undefined

    const timeout = window.setTimeout(() => setCopyState({ status: "idle", value }), 2_000)
    return () => window.clearTimeout(timeout)
  }, [state, value])

  const copy = async (): Promise<void> => {
    setCopyState({ status: "pending", value })

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable")
      }

      await navigator.clipboard.writeText(value)
      setCopyState({ status: "success", value })
    } catch {
      setCopyState({ status: "error", value })
    }
  }

  const accessibleLabel =
    state === "pending"
      ? `Copying ${label}`
      : state === "success"
        ? `Copied ${label}`
        : `Copy ${label}`

  return (
    <CopyControl className={className}>
      <StyledButton
        variant={ButtonVariant.text}
        iconOnly
        iconRight={state === "success" ? IconName.Check : IconName.Copy}
        ariaLabel={accessibleLabel}
        disabled={state === "pending"}
        loading={state === "pending"}
        onClick={() => void copy()}
      />
      <CopyStatus $error={state === "error"} aria-live="polite">
        {state === "success"
          ? "Copied"
          : state === "error"
            ? "Could not copy automatically. Select and copy the text manually."
            : ""}
      </CopyStatus>
    </CopyControl>
  )
}

export { ClipboardButton }
export type { ClipboardButtonProps }
