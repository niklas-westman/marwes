<script lang="ts">
 import { MarwesProvider, CheckboxGroupField } from "../../lib/index.js"
 import Checkbox from "../../lib/components/checkbox/Checkbox.svelte"
 let { value, defaultValue, disabled, onValueChange }: { value?: string[], defaultValue?: string[], disabled?: boolean, onValueChange?: (values: string[]) => void } = $props()
 function initialValues(): string[] { return defaultValue ?? [] }
 let internalValue = $state(initialValues())
 const selected = $derived(value ?? internalValue)
 const options = [{ value: "email", label: "Email" }, { value: "sms", label: "SMS" }, { value: "disabled", label: "Disabled option", disabled: true }]
 function toggle(next: string): void { const values = options.map(option => option.value).filter(item => item === next ? !selected.includes(item) : selected.includes(item)); if (value === undefined) internalValue = values; onValueChange?.(values) }
</script>
<MarwesProvider><CheckboxGroupField label="Contact" {disabled}>{#each options as option}<label><Checkbox ariaLabel={option.label} checked={selected.includes(option.value)} disabled={option.disabled} oncheckedchange={() => toggle(option.value)} />{option.label}</label>{/each}</CheckboxGroupField></MarwesProvider>
