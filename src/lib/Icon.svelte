<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { DB_CLICK_SPAN } from "./utils/constants";

  export let imageSrc: string;
  export let iconName: string;
  export let focus: boolean;

  const dispatch = createEventDispatcher();

  let clickTimer;
  let numOfClick = 0;

  function onClick(e: MouseEvent) {
    numOfClick += 1;
    if (numOfClick === 1) {
      clickTimer = setTimeout(() => {
        dispatch("click");
        numOfClick = 0;
      }, DB_CLICK_SPAN);
    } else if (numOfClick >= 2) {
      numOfClick = 0;
      clearTimeout(clickTimer);
      dispatch("dbClick");
    }
  }

  function onContextMenu(e: MouseEvent) {
    e.preventDefault();
    dispatch("rightClick");
  }
</script>

<button
  class="icon-container"
  class:focused={focus}
  on:click={onClick}
  on:contextmenu={onContextMenu}
>
  <img alt={iconName} src={imageSrc} />
  <p>{iconName}</p>
</button>

<style lang="scss">
  .icon-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 110px;
    width: 110px;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
    border: 2px solid transparent;
    background: transparent;

    img {
      height: 50px;
      width: 50px;
      background: black;
    }

    p {
      margin: 0.5em 0 0 0;
      user-select: none;
    }

    &.focused,
    &:hover {
      border: 2px solid dodgerblue;
      background: rgba(173, 219, 230, 0.56);
    }

    &:active {
      border: 2px solid #2152d9;
      background: rgba(151, 194, 206, 0.56);
    }
  }
</style>
