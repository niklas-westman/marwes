<script setup lang="ts">
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
