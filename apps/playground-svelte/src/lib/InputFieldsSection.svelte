<script lang="ts">
  import { Input, InputField } from "@marwes-ui/svelte";

  let name = $state("");
  let email = $state("");
  let password = $state("");
</script>

<section>
  <h2 class="section-title">Input Fields</h2>

  <div class="grid">
    <InputField
      label="Full name"
      helperText="As it appears on your ID"
      input={{ placeholder: "Jane Doe" }}
      bind:value={name}
    />
    <InputField
      label="Email"
      input={{ type: "email", placeholder: "jane@example.com" }}
      bind:value={email}
    />
    <InputField
      label="Password"
      input={{ type: "password", placeholder: "Enter password" }}
      bind:value={password}
    />
    <InputField
      label="With error"
      error="This field is required"
      input={{ placeholder: "Required" }}
    />
    <InputField
      label="Disabled"
      input={{ placeholder: "Cannot edit", disabled: true }}
    />
    <InputField
      label="With leading symbol"
      leadingSymbol="$"
      input={{ placeholder: "0.00", inputMode: "decimal" }}
    />
  </div>

  <p class="debug">
    Live values — name: "{name}" | email: "{email}" | password: "{password}"
  </p>
</section>

<style>
  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px;
    opacity: 0.8;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
  }

  .grid :global(.mw-input) {
    width: 100%;
  }

  .debug {
    margin-top: 16px;
    font-size: 12px;
    font-family: monospace;
    opacity: 0.5;
    padding: 8px 12px;
    background: currentColor;
    background: rgba(128, 128, 128, 0.05);
    border-radius: 4px;
  }
</style>
