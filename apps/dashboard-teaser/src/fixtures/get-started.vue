<script setup lang="ts">
import { ref } from "vue"
import {
  Button,
  ButtonVariant,
  CheckboxField,
  EmailField,
  MarwesProvider,
  SubmitButton,
} from "@marwes-ui/vue"

const email = ref("")
const subscribed = ref(false)
</script>

<template>
  <MarwesProvider>
    <EmailField
      v-model="email"
      label="Email"
      :input="{ placeholder: 'you@example.com' }"
    />
    <CheckboxField
      v-model="subscribed"
      label="Send me product updates"
      :checkbox="{}"
    />
    <Button :variant="ButtonVariant.secondary">Preview</Button>
    <SubmitButton>Save</SubmitButton>
  </MarwesProvider>
</template>
