<script lang="ts">
    import WindowManager from "./lib/WindowManager.svelte";
    import MyComputer from "./lib/apps/MyComputer.svelte";
    import Deck from "./lib/Deck.svelte";
    import Toolbar from "./lib/Toolbar.svelte";
    import About from "./lib/apps/About.svelte";

    let apps = [
        MyComputer,
        About,
    ];
</script>

<main>
    <div class="toolbar-container">
        <Toolbar/>
    </div>
    <WindowManager windows={apps} />
    <div class="deck-container">
        <Deck />
    </div>
</main>

<style lang="scss">
    main {
        width: calc(100vw);
        height: calc(100vh);
        background: url('src/assets/IMG_4614.jpeg');
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
