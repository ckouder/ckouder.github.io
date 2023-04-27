<script lang="ts">
    import DeckItem from "./Deck/DeckItem.svelte";
    import Finder from "./Finder.svelte";

    const apps = [
      {iconSrc: "assets/images/finder.png", component: Finder, props: null},
      {iconSrc: "assets/images/launchpad.png", component: null, props: null},
      {iconSrc: "assets/images/safari.png", component: null, props: null},
      {iconSrc: "assets/images/system-preferences.png", component: null, props: null},
    ];
</script>

<div class="deck">
  {#each apps as app}
    <DeckItem iconSrc={app.iconSrc} component={app.component} props={app.props}/>
  {/each}
</div>

<style lang="scss">
  .deck {
    box-sizing: border-box;
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px 4px;
    height: 68px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 18px;
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
</style>
