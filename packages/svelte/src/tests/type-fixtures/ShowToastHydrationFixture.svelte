<script lang="ts">
 import { useToast } from "../../lib/components/toast/ToastProvider.svelte"
 let { duration, onDismiss }: { duration: number | null, onDismiss?: () => void } = $props()
 const controller = useToast()
</script>
<button type="button" onclick={() => controller.show({ message: "Saved project", duration, ondismiss: onDismiss })}>Save project</button>
