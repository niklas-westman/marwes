<script lang="ts">
import { onMount } from "svelte"
import { InputField, CheckboxGroupField, CheckboxField, TabGroup, DialogModal, RichTextField, useToast } from "@marwes-ui/svelte"
let { initialOpen } = $props()
function initialModal(): boolean { return initialOpen }
let contact = $state("Server contact"), changes = $state(0), open = $state(initialModal()), rich = $state("<p>Server notes</p>"), richChanges = $state(0), ready = $state(false)
const toast = useToast()
onMount(() => { ready = true })
</script>
<span data-testid="hydrated">{ready ? "ready" : "server"}</span><InputField label="Contact" value={contact} input={{ oninput: (event) => { contact = event.currentTarget.value; changes += 1 } }} /><output data-testid="changes">{changes}</output><RichTextField label="Notes" editor={{ value: rich, onvaluechange: value => { rich = value; richChanges += 1 } }} /><output data-testid="rich-changes">{richChanges}</output><CheckboxGroupField label="Channels"><CheckboxField label="Email" /><CheckboxField label="SMS" checked /></CheckboxGroupField><TabGroup ariaLabel="Sections" tabs={[{ value: "one", label: "First", panel: "First panel" }, { value: "two", label: "Second", panel: "Second panel" }]} defaultActiveTab="two" /><button type="button" onclick={() => { open = true }}>Open modal</button><DialogModal {open} onopenchange={(value) => { open = value }} title="SSR modal" dismissible={false}><input aria-label="Modal input" /><button type="button">Done</button></DialogModal><button type="button" onclick={() => toast.show({ message: "Saved project", duration: null })}>Show toast</button>
