<script lang="ts">
  import WindowManager from './lib/WindowManager.svelte'
</script>

<main>
  <WindowManager/>
</main>

<style lang="sass">
  $content-margin: 16px

  main
    width: calc(100vw - $content-margin * 2)
    height: calc(100vh - $content-margin * 2)
    background: white
    margin: $content-margin auto
    overflow: hidden
    border: 1px solid black
</style>