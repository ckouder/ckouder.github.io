<script lang="ts">
    export let title: string;
    export let active: boolean = false;

    function onItemClicked() {
        active = true;
    }
</script>

<div class="item-container">
    <div class="item" class:active="{active}" on:mousedown={onItemClicked}>
        <div class="icon">
            <slot name="icon"></slot>
        </div>
        <div class="name">{ title }</div>
    </div>
</div>

<style lang="sass">
    .item-container
        width: 100px
        height: 120px
        position: relative

    .item
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        padding: 5px 10px
        
        &.active
            .icon
                background: rgba(0, 0, 0, 0.1)
            .name
                background: rgb(57, 100, 221)
                color: white

        .icon
            width: 72px
            height: 72px
            margin-bottom: 2px
            border-radius: 5px
            display: flex
            align-items: center
            justify-content: center

        .name
            font-size: 13px
            padding: 0.5px 5px
            border-radius: 3px
</style>