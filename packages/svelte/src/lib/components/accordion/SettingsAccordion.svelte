<script lang="ts">
  import AccordionField from "./AccordionField.svelte";

  interface SettingsAccordionProps {
    id?: string;
    label: string;
    description?: string;
    error?: string;
    items: Array<{ value: string; title: string; content: string; disabled?: boolean }>;
    openItems?: string[];
    defaultOpenItems?: string[];
    onopenitemschange?: (items: string[]) => void;
    ariaDescribedBy?: string;
    class?: string;
  }

  let props: SettingsAccordionProps = $props();
</script>
<div data-purpose="settings">
  <AccordionField {...props} multiple={true} />
</div>
