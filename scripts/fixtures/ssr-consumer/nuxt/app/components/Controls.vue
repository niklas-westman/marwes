<script setup lang="ts">
import { InputField, CheckboxGroupField, TabGroup, DialogModal, RichTextField, useToast } from "@marwes-ui/vue"
const props = defineProps<{ initialOpen: boolean }>()
const contact = ref("Server contact"), changes = ref(0), open = ref(props.initialOpen), rich = ref("<p>Server notes</p>"), richChanges = ref(0), ready = ref(false)
const toast = useToast()
onMounted(() => { ready.value = true })
</script>
<template><span data-testid="hydrated">{{ ready ? 'ready' : 'server' }}</span><InputField label="Contact" :input="{ value: contact, onValueChange: value => { contact = value; changes += 1 } }" /><output data-testid="changes">{{ changes }}</output><RichTextField label="Notes" :editor="{ value: rich, onValueChange: value => { rich = value; richChanges += 1 } }" /><output data-testid="rich-changes">{{ richChanges }}</output><CheckboxGroupField label="Channels" :options="[{ value: 'email', label: 'Email' }, { value: 'sms', label: 'SMS' }]" :default-value="['sms']" /><TabGroup aria-label="Sections" :tabs="[{ value: 'one', label: 'First', panel: 'First panel' }, { value: 'two', label: 'Second', panel: 'Second panel' }]" default-active-tab="two" /><button type="button" @click="open = true">Open modal</button><DialogModal :open="open" @open-change="open = $event" title="SSR modal" :dismissible="false" portal-target="#teleports"><input aria-label="Modal input" /><button type="button">Done</button></DialogModal><button type="button" @click="toast.show({ children: 'Saved project', duration: null })">Show toast</button></template>
