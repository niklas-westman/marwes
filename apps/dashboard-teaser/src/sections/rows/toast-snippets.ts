import type { Framework } from "../installation-recipes"

const react = `import { ErrorToast, InfoToast, SuccessToast, Toast, WarningToast } from "@marwes-ui/react"
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
`

const vue = `<script setup lang="ts">
import { ref } from "vue"
import { ErrorToast, InfoToast, SuccessToast, Toast, WarningToast } from "@marwes-ui/vue"

const dismissed = ref<Set<string>>(new Set())
const dismiss = (id: string) => (dismissed.value = new Set([...dismissed.value, id]))
</script>

<template>
  <Toast v-if="!dismissed.has('neutral')" variant="subtle" @dismiss="dismiss('neutral')">
    Neutral message
  </Toast>
  <InfoToast v-if="!dismissed.has('info')" variant="subtle" @dismiss="dismiss('info')">
    Meeting starts in 10 min
  </InfoToast>
  <SuccessToast v-if="!dismissed.has('success')" variant="subtle" @dismiss="dismiss('success')">
    Your email is verified
  </SuccessToast>
  <WarningToast v-if="!dismissed.has('warning')" variant="subtle" @dismiss="dismiss('warning')">
    Connection unstable
  </WarningToast>
  <ErrorToast v-if="!dismissed.has('error')" variant="subtle" @dismiss="dismiss('error')">
    Something went wrong
  </ErrorToast>
</template>
`

const svelte = `<script lang="ts">
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
`

const toastSnippets: Record<Framework, string> = { react, vue, svelte }

export { toastSnippets }
