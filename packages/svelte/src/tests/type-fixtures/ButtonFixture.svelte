<script lang="ts">
  import { Button, PrimaryButton } from "@marwes-ui/svelte"
</script>

<!-- Basic usage -->
<Button variant="primary" action="button">Click me</Button>

<!-- Link mode -->
<Button variant="text" action="navigate" href="/dashboard" as="a">Go</Button>

<!-- Loading -->
<Button loading>Saving</Button>

<!-- With icons -->
<Button iconLeft="plus" iconRight="check">Create</Button>

<!-- Disabled -->
<Button disabled>Disabled</Button>

<!-- Native form behavior -->
<PrimaryButton type="submit">Submit</PrimaryButton>
<Button type="reset">Reset</Button>
