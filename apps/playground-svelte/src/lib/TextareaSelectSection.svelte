<script lang="ts">
  import { Select, Textarea, TextareaField, SelectField } from "@marwes-ui/svelte";

  let textareaValue = $state("");
  let selectValue = $state("");
  let fieldTextarea = $state("");
  let fieldSelect = $state("");

  const options = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "angular", label: "Angular" },
  ];
</script>

<section>
  <h2 class="section-title">Textarea & Select</h2>

  <div class="grid">
    <div>
      <p class="description">Textarea atom</p>
      <Textarea placeholder="Write something..." rows={4} bind:value={textareaValue} />
    </div>
    <div>
      <p class="description">Select atom</p>
      <Select {options} placeholder="Choose a framework" bind:value={selectValue} />
    </div>
    <TextareaField label="Bio" helperText="Tell us about yourself" textarea={{ placeholder: "Your bio...", rows: 3 }} bind:value={fieldTextarea} />
    <SelectField label="Framework" select={{ options, placeholder: "Pick one" }} bind:value={fieldSelect} />
  </div>

  <p class="debug">textarea: "{textareaValue}" | select: "{selectValue}" | fieldTextarea: "{fieldTextarea}" | fieldSelect: "{fieldSelect}"</p>
</section>

<style>
  .section-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; opacity: 0.8; }
  .description { font-size: 13px; opacity: 0.6; margin: 0 0 8px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .debug { margin-top: 12px; font-size: 12px; font-family: monospace; opacity: 0.5; padding: 8px 12px; background: rgba(128,128,128,0.05); border-radius: 4px; }
</style>
