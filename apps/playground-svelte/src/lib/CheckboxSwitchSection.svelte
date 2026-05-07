<script lang="ts">
  import { Checkbox, CheckboxField, Switch, SwitchField } from "@marwes-ui/svelte";

  let accepted = $state(false);
  let notifications = $state(true);
  let darkMode = $state(false);
</script>

<section>
  <h2 class="section-title">Checkbox & Switch</h2>

  <p class="description">Checkbox</p>
  <div class="row">
    <CheckboxField label="Accept terms" description="Required to continue." bind:checked={accepted} />
    <CheckboxField label="Subscribe to updates" checkbox={{ defaultChecked: true }} />
    <CheckboxField label="With error" error="You must accept." />
  </div>

  <p class="description">Switch</p>
  <div class="row">
    <SwitchField label="Notifications" switch={{ checked: notifications, oncheckedchange: (v) => notifications = v }} />
    <SwitchField label="Dark mode" switch={{ checked: darkMode, oncheckedchange: (v) => darkMode = v }} />
    <SwitchField label="Disabled" switch={{ disabled: true, checked: false }} />
  </div>

  <p class="debug">accepted: {accepted} | notifications: {notifications} | darkMode: {darkMode}</p>
</section>

<style>
  .section-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; opacity: 0.8; }
  .description { font-size: 13px; opacity: 0.6; margin: 0 0 8px; }
  .row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px; }
  .debug { margin-top: 12px; font-size: 12px; font-family: monospace; opacity: 0.5; padding: 8px 12px; background: rgba(128,128,128,0.05); border-radius: 4px; }
</style>
