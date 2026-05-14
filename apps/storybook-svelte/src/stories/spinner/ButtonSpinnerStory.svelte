<script lang="ts">
  import { Button, ButtonSpinner } from "@marwes-ui/svelte"
  import type { ButtonSpinnerProps } from "@marwes-ui/svelte"
  import type { ButtonVariant } from "@marwes-ui/core"

  interface Props extends ButtonSpinnerProps {
    buttonVariant?: ButtonVariant
    label?: string
  }

  let {
    buttonVariant = "secondary",
    label = "Please wait",
    ...spinnerProps
  }: Props = $props()
</script>

<div style="display: inline-flex; align-items: center; justify-content: center; min-width: 120px; min-height: 120px; padding: 1.5rem; border-radius: 16px; background: rgba(248, 250, 252, 0.88);">
  <Button variant={buttonVariant} disabled>
    <ButtonSpinner {...spinnerProps} />
    {label}
  </Button>
</div>
