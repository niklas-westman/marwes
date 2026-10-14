<script lang="ts">
 import { Dialog, Drawer, ContextMenu, MarwesProvider } from "../../lib/index.js"
 let { name, visible, onAction }: { name: string, visible: boolean, onAction?: () => void } = $props()
</script>
<MarwesProvider>{#if visible}{#if name === "Dialog"}<Dialog title="Actions" onclose={onAction} />{:else if name === "Drawer"}<Drawer title="Actions" onclose={onAction} />{:else}<ContextMenu ariaLabel="Actions" items={[{ value: "edit", label: "Edit" }]} onselect={onAction} />{/if}{/if}</MarwesProvider>
