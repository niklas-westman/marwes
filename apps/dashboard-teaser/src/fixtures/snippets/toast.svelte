<script lang="ts">
  import { ErrorToast, InfoToast, SuccessToast, Toast, WarningToast } from "@marwes-ui/svelte"

  let dismissed = $state<Set<string>>(new Set())
  const dismiss = (id: string) => (dismissed = new Set([...dismissed, id]))
</script>

{#if !dismissed.has("neutral")}
  <Toast variant="subtle" ondismiss={() => dismiss("neutral")}>Neutral message</Toast>
{/if}
{#if !dismissed.has("info")}
  <InfoToast variant="subtle" ondismiss={() => dismiss("info")}>Meeting starts in 10 min</InfoToast>
{/if}
{#if !dismissed.has("success")}
  <SuccessToast variant="subtle" ondismiss={() => dismiss("success")}>Your email is verified</SuccessToast>
{/if}
{#if !dismissed.has("warning")}
  <WarningToast variant="subtle" ondismiss={() => dismiss("warning")}>Connection unstable</WarningToast>
{/if}
{#if !dismissed.has("error")}
  <ErrorToast variant="subtle" ondismiss={() => dismiss("error")}>Something went wrong</ErrorToast>
{/if}
