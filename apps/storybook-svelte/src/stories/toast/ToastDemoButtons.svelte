<script lang="ts">
  import { Button, ButtonVariant, useToast } from "@marwes-ui/svelte"

  const toast = useToast()

  function showSuccess(): void {
    toast.show({ message: "Project saved.", intent: "success" })
  }
</script>

<div style="padding: 24px;">
  <Button variant={ButtonVariant.primary} onclick={showSuccess}>
    Show success toast
  </Button>
</div>
