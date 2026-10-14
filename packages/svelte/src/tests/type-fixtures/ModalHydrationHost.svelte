<script lang="ts">
 import type { Component } from "svelte"
 import { DialogModal, ConfirmDialog, DestructiveDialog, InfoDialog, MarwesProvider } from "../../lib/index.js"
 let { open, title, onOpenChange, name = "DialogModal" }: { open: boolean, title: string, onOpenChange?: (open: boolean) => void, name?: string } = $props()
 const modals = { DialogModal, ConfirmDialog, DestructiveDialog, InfoDialog }
 const Modal = $derived(modals[name as keyof typeof modals] as unknown as Component<Record<string, unknown>>)
</script>
<MarwesProvider><button type="button">Launch</button><Modal {open} {title} dismissible={false} onopenchange={onOpenChange}><input aria-label="Project name" /><button type="button">Done</button></Modal></MarwesProvider>
