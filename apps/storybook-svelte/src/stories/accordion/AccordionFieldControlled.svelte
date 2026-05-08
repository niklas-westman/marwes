<script lang="ts">
  import { AccordionField, Paragraph } from "@marwes-ui/svelte"

  const faqItems = [
    { value: "what", title: "What is Marwes?", content: "A design system for scalable, accessible UI." },
    { value: "free", title: "Is it free?", content: "Yes, Marwes is open source." },
    { value: "frameworks", title: "Which frameworks?", content: "React, Vue, and Svelte are supported." },
  ]

  let openItems = $state<string[]>(["what"])
</script>

<div style="display: grid; gap: 12px;">
  <AccordionField
    label="FAQ"
    items={faqItems}
    {openItems}
    onOpenItemsChange={(v) => (openItems = v)}
  />
  <Paragraph size="sm" style="color: #6b7280;">Open: {openItems.join(", ") || "none"}</Paragraph>
</div>
