<script lang="ts">
  import { onMount } from "svelte";
  import { useToast } from "../../lib/components/toast/ToastProvider.svelte";

  let {
    toast,
  }: {
    toast: {
      children: string;
      intent?: "neutral" | "info" | "success" | "warning" | "error" | "brand";
      duration?: number | null;
    };
  } = $props();

  const controller = useToast();

  onMount(() => {
    controller.show({
      message: toast.children,
      ...(toast.intent !== undefined ? { intent: toast.intent } : {}),
      ...(toast.duration !== undefined ? { duration: toast.duration } : {}),
    });
  });
</script>

<div>Toast test harness</div>
