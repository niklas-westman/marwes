<script lang="ts">
  import { ToastProvider } from "@marwes-ui/svelte"
  import ToastDemoButtons from "./ToastDemoButtons.svelte"
</script>

<ToastProvider placement="top-right">
  <ToastDemoButtons />
</ToastProvider>
