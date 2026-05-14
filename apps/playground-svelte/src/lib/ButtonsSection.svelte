<script lang="ts">
  import { Button, PrimaryButton, SecondaryButton, TextButton, SuccessButton, DestructiveButton, SubmitButton, CancelButton, CreateButton, LinkButton, Divider, IconName } from "@marwes-ui/svelte";
</script>

<section>
  <h2 class="section-title">Buttons</h2>

  <div class="row">
    <Button variant="primary" iconLeft={IconName.Check}>Primary</Button>
    <Button variant="secondary" iconLeft={IconName.Plus}>Secondary</Button>
    <Button variant="text">Text</Button>
    <Button variant="primary" action="delete" iconLeft={IconName.Trash}>Delete</Button>
  </div>

  <Divider size="xs" />
  <p class="description">Sizes — xs through lg</p>
  <div class="row" style="align-items: flex-end;">
    <Button size="xs">Extra Small</Button>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>

  <Divider size="xs" />
  <p class="description">States</p>
  <div class="row">
    <Button disabled>Disabled</Button>
    <Button loading ariaLabel="Saving" hasVisibleText={true}>Loading</Button>
    <Button as="a" href="#" variant="text" iconRight={IconName.ArrowRight}>Link button</Button>
  </div>

  <Divider size="xs" />
  <p class="description">Variants</p>
  <div class="row">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="neutral">Neutral</Button>
    <Button variant="success" iconLeft={IconName.Check}>Success</Button>
    <Button variant="text">Text</Button>
  </div>
  <Divider size="xs" />
  <p class="description">Purpose wrappers</p>
  <div class="row">
    <PrimaryButton>Primary</PrimaryButton>
    <SecondaryButton>Secondary</SecondaryButton>
    <TextButton>Text</TextButton>
    <SuccessButton iconLeft={IconName.Check}>Success</SuccessButton>
    <DestructiveButton iconLeft={IconName.Trash}>Delete</DestructiveButton>
    <SubmitButton>Submit</SubmitButton>
    <CancelButton>Cancel</CancelButton>
    <CreateButton iconLeft={IconName.Plus}>Create</CreateButton>
    <LinkButton href="#">Link</LinkButton>
  </div>
</section>

<style>
  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px;
    opacity: 0.8;
  }

  .description {
    font-size: 13px;
    opacity: 0.6;
    margin: 0 0 8px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }
</style>
