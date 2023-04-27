<script lang="ts">
  import Finder from "./lib/apps/Finder.svelte";
  import Deck from "./lib/apps/Deck.svelte";
  import Toolbar from "./lib/Toolbar.svelte";
  import About from "./lib/apps/About.svelte";
  import { onMount, type ComponentType } from "svelte";
  import { appNameMap, tryOpenNewApp } from "./lib/stores/windows";
  import { ABOUT_APP, FINDER_APP } from "./lib/utils/constants";

  let apps: ComponentType[] = [Finder, About];
  
  appNameMap.set(About, ABOUT_APP);
  appNameMap.set(Finder, FINDER_APP);

  onMount(() => {
    apps.forEach((app) => tryOpenNewApp(app, null));
  });
</script>

<main id="root">
  <div class="toolbar-container">
    <Toolbar />
  </div>
  <div class="deck-container">
    <Deck />
  </div>
</main>

<style lang="scss">
  main {
    width: calc(100vw);
    height: calc(100vh);
    background: url("/assets/images/wallpaper.jpg");
    background-size: cover;
    overflow: hidden;
  }

  .toolbar-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }

  .deck-container {
    position: fixed;
    bottom: 5px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
</style>
