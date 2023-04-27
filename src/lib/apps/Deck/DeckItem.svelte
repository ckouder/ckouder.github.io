<script lang="ts">
  import type { ComponentProps, ComponentType } from "svelte";
  import { tryOpenNewApp } from "../../stores/windows";

  export let component: ComponentType;
  export let props: ComponentProps<any>;
  export let iconSrc: string;
</script>

<button
  class="item"
  style="background-image: url({iconSrc});"
  on:dblclick={() => tryOpenNewApp(component, props)}
/>

<style lang="scss">
  .item {
    height: 60px;
    width: 60px;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: transparent;
    border: none;
    appearance: none;
    -webkit-appearance: none;
  }
</style>
