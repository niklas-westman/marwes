<script lang="ts">
  import AccordionField from "./AccordionField.svelte";

  interface FAQAccordionProps {
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

  let props: FAQAccordionProps = $props();
</script>
<div data-purpose="faq">
  <AccordionField {...props} multiple={false} />
</div>
