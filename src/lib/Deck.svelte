<div class="deck">
    <div class="item" style="background-image: url('src/assets/finder.png');"></div>
    <div class="item" style="background-image: url('src/assets/launchpad.png');"></div>
    <div class="item" style="background-image: url('src/assets/safari.png');"></div>
    <div class="item" style="background-image: url('src/assets/system-preferences.png');"></div>
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
        background: rgba(255,255,255,0.5);
        border-radius: 18px;
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        border: 1px solid rgba(255,255,255,0.1);

        .item {
            height: 60px;
            width: 60px;
            background-repeat: no-repeat;
            background-size: cover;
        }
    }
</style>