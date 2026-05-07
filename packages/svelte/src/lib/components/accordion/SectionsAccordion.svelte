<script lang="ts">
  import AccordionField from "./AccordionField.svelte";

  interface SectionsAccordionProps {
    id?: string;
    label: string;
    description?: string;
    error?: string;
    items: Array<{ value: string; title: string; content: string; disabled?: boolean }>;
    openItems?: string[];
    defaultOpenItems?: string[];
    onopenitemschange?: (items: string[]) => void;
    multiple?: boolean;
    ariaDescribedBy?: string;
    class?: string;
  }

  let props: SectionsAccordionProps = $props();
</script>
<div data-purpose="sections">
  <AccordionField {...props} />
</div>
