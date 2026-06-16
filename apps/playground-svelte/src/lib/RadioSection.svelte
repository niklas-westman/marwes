<script lang="ts">
  import { RadioGroupField } from "@marwes-ui/svelte";
  // Atom is no longer publicly exported; deep-import for playground demo.
  import Radio from "../../../../packages/svelte/src/lib/components/radio/Radio.svelte";

  let selected = $state("svelte");
</script>

<section>
  <h2 class="section-title">Radio</h2>

  <RadioGroupField label="Favorite framework">
    <div class="radio-options">
      <label class="radio-option">
        <Radio name="framework" value="react" checked={selected === "react"} oncheckedchange={() => selected = "react"} />
        <span>React</span>
      </label>
      <label class="radio-option">
        <Radio name="framework" value="vue" checked={selected === "vue"} oncheckedchange={() => selected = "vue"} />
        <span>Vue</span>
      </label>
      <label class="radio-option">
        <Radio name="framework" value="svelte" checked={selected === "svelte"} oncheckedchange={() => selected = "svelte"} />
        <span>Svelte</span>
      </label>
    </div>
  </RadioGroupField>

  <p class="debug">selected: {selected}</p>
</section>

<style>
  .section-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; opacity: 0.8; }
  .radio-options { display: flex; flex-direction: column; gap: 10px; }
  .radio-option { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .debug { margin-top: 12px; font-size: 12px; font-family: monospace; opacity: 0.5; padding: 8px 12px; background: rgba(128,128,128,0.05); border-radius: 4px; }
</style>
