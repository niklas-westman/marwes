<script lang="ts">
  import ToastProvider from "../../lib/components/toast/ToastProvider.svelte";
  import ToastProviderContractShowFixture from "./ToastProviderContractShowFixture.svelte";

  let {
    toast,
    defaultDuration,
  }: {
    toast: {
      children: string;
      intent?: "neutral" | "info" | "success" | "warning" | "error" | "brand";
      duration?: number | null;
    };
    defaultDuration?: number | null;
  } = $props();
</script>

<ToastProvider {defaultDuration}>
  <ToastProviderContractShowFixture {toast} />
</ToastProvider>
