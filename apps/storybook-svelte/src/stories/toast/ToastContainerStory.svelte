<script lang="ts">
  import { ToastContainer } from "@marwes-ui/svelte"
  import type { ManagedToast } from "@marwes-ui/svelte"

  interface Props {
    placement?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
    toasts?: ManagedToast[]
  }

  let {
    placement = "top-right",
    toasts = [],
  }: Props = $props()
</script>

<div style="position: relative; min-height: 300px; width: 100%;">
  <ToastContainer {placement} {toasts} />
</div>
