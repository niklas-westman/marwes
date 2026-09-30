<script setup lang="ts">
import { ref } from "vue"
import { Button, DialogModal, Drawer, Paragraph } from "@marwes-ui/vue"

const dialogOpen = ref(false)
const drawerOpen = ref(false)
</script>

<template>
  <Button variant="primary" @click="dialogOpen = true">Open dialog →</Button>
  <Button variant="secondary" @click="drawerOpen = true">Open drawer →</Button>

  <DialogModal
    v-model:open="dialogOpen"
    title="Dialog title"
    description="This is a dialog component."
  >
    <Paragraph>Dialog content goes here.</Paragraph>
    <template #footer>
      <Button variant="primary" @click="dialogOpen = false">Close</Button>
    </template>
  </DialogModal>

  <Drawer
    v-if="drawerOpen"
    modal
    title="Drawer"
    size="medium"
    placement="right"
    @close="drawerOpen = false"
  >
    <p>Drawer content goes here.</p>
    <template #footer>
      <Button variant="secondary" @click="drawerOpen = false">Close drawer</Button>
    </template>
  </Drawer>
</template>
