<script lang="ts">
  import Window from "./Window.svelte";

  let resizeController: HTMLDivElement;
  let shouldReposition: boolean;
  let windows = [1, 2, 3];
  let windowComps = [];

  let AABB = {
    collide: function (el1, el2) {
      let rect1 = el1.getBoundingClientRect();
      let rect2 = el2.getBoundingClientRect();

      return !(
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right
      );
    },

    inside: function (el1, el2) {
      let rect1 = el1.getBoundingClientRect();
      let rect2 = el2.getBoundingClientRect();

      return (
        rect2.top <= rect1.top &&
        rect1.top <= rect2.bottom &&
        rect2.top <= rect1.bottom &&
        rect1.bottom <= rect2.bottom &&
        rect2.left <= rect1.left &&
        rect1.left <= rect2.right &&
        rect2.left <= rect1.right &&
        rect1.right <= rect2.right
      );
    },

    pointInside: function (x, y, el) {
      let rect = el.getBoundingClientRect();
      return (
        y >= rect.top && y <= rect.bottom && x >= rect.left && x <= rect.right
      );
    },
  };

  export function enterWindowSelectMode(mode: string, idx: number = undefined) {
    let candidateWindows = windowComps.filter((v, i) => i !== idx);
    candidateWindows.forEach((v) => {
      let windowSize = v.getWindowSize();
      windowSize.left /= 10;
      windowSize.top /= 10;
      windowSize.bottom = window.innerHeight - ((window.innerHeight - windowSize.bottom - windowSize.top) / 5 + windowSize.top);
      windowSize.right = window.innerWidth - ((window.innerWidth - windowSize.right - windowSize.left) / 5 + windowSize.left)
      v.resize(windowSize, true);
    });
  }

  function onWindowResize(dimension) {
    console.log("resize received: ", dimension);
  }

  function onWindowRepositionStart(event: CustomEvent, idx: number) {
    shouldReposition = true;
  }

  function onWindowRepositionEnd(event: CustomEvent, idx: number) {
    let children = [...resizeController.children];
    let eventTargets = [];
    children.forEach((child: HTMLElement) => {
      if (AABB.collide(event.detail.target, child)) {
        eventTargets.push(child);
      }
      child.style.background = "";
    });

    if (eventTargets.length > 2 || eventTargets.length === 0) {
      return;
    }

    let containRight =
        eventTargets.filter((e) => e.dataset.tag.includes("right")).length > 0,
      containLeft =
        eventTargets.filter((e) => e.dataset.tag.includes("left")).length > 0,
      containTop =
        eventTargets.filter((e) => e.dataset.tag.includes("top")).length > 0,
      containBottom =
        eventTargets.filter((e) => e.dataset.tag.includes("bottom")).length > 0;
    let target = windowComps[idx];
    let size = {
      top:
        eventTargets.length === 2
          ? containTop
            ? target.fullWindowMargin
            : containBottom 
              ? window.innerHeight / 2 - 1
              : target.fullWindowMargin
          : target.fullWindowMargin,
      bottom:
        eventTargets.length === 2
          ? containBottom
            ? target.fullWindowMargin
            : window.innerHeight / 2 - 1
          : target.fullWindowMargin,
      left: containRight ? window.innerWidth / 2 - 1 : target.fullWindowMargin,
      right: containLeft ? window.innerWidth / 2 - 1 : target.fullWindowMargin,
    };

    target.resize(size, true);
    enterWindowSelectMode('left', idx);
    shouldReposition = false;
  }

  function onWindowRepositioning(event: CustomEvent, idx: number) {
    let children = [...resizeController.children];
    children.forEach((child: HTMLElement) => {
      if (AABB.collide(child, event.detail.target)) {
        child.style.background = "rgba(0,0,0,0.3)";
      } else {
        child.style.background = "rgba(0,0,0,0.1)";
      }
    });
  }
</script>

<div class="container">
  {#each windows as w, i}
    <Window
      title="Hello World This is Bingji"
      focus={false}
      bind:this={windowComps[i]}
      on:repositionStart={(e) => onWindowRepositionStart(e, i)}
      on:repositionEnd={(e) => onWindowRepositionEnd(e, i)}
      on:reposition={(e) => onWindowRepositioning(e, i)}
    />
  {/each}
  {#if shouldReposition}
    <div class="resize-controller" bind:this={resizeController}>
      <div data-tag="left" class="ctrl" />
      <div data-tag="top" class="ctrl" />
      <div data-tag="right" class="ctrl" />
      <div data-tag="bottom" class="ctrl" />
    </div>
  {/if}
  <div class="resizer-container">
    <div class="resizer" data-tag="top"/>
    <div class="resizer" data-tag="bottom"/>
    <div class="resizer" data-tag="left"/>
    <div class="resizer" data-tag="right"/>
    <div class="resizer" data-tag="top-bottom"/>
    <div class="resizer" data-tag="left-right"/>
  </div>
</div>

<style lang="sass">
  $ctrl-short: 5%
  $ctrl-long: calc(100% - $ctrl-short * 2)
  $ctrl-offset: $ctrl-short
  $resizer-short: 14px
  $resizer-long: 60px

  @mixin resizer-style
    box-sizing: border-box
    display: block
    position: absolute
    border-radius: $resizer-short
    background: white
    border: 2px solid black
    cursor: grab
    content: ""

  *
    box-sizing: border-box

  .container
    overflow: hidden

  .resize-controller
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    pointer-events: none

    .ctrl
      position: absolute
      padding: 0
      margin: 0
      pointer-events: none
      transform-style: preserve-3d
      cursor: grabbing

      &[data-tag=left]
        left: 0
        top: $ctrl-offset
        height: $ctrl-long
        width: $ctrl-short

      &[data-tag=top]
        top: 0
        left: $ctrl-offset
        width: $ctrl-long
        height: $ctrl-short

      &[data-tag=right]
        right: 0
        top: $ctrl-offset
        width: $ctrl-short
        height: $ctrl-long

      &[data-tag=bottom]
        bottom: 0
        left: $ctrl-offset
        width: $ctrl-long
        height: $ctrl-short

  .resizer-container
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    user-select: none
    pointer-events: none

    .resizer
      position: absolute
      pointer-events: all

      &[data-tag="top-bottom"]
        left: calc(50% - $resizer-short / 2)
        top: 0
        width: $resizer-short
        height: 100%

        &:before
          @include resizer-style
          top: calc(50% - $resizer-long / 2)
          left: 0%
          width: $resizer-short
          height: $resizer-long 

      &[data-tag="left-right"]
        left: 0
        top: calc(50% - $resizer-short / 2)
        width: 100%
        height: $resizer-short

        &:before
          @include resizer-style
          top: calc(50% - $resizer-short / 2)
          left: calc(50% - $resizer-long / 2)
          width: $resizer-long
          height: $resizer-short

      // &[data-tag="left"]
      //   left: 0
      //   top: calc(50% - $resizer-short / 2)
      //   width: 50%
      //   height: $resizer-short

      //   &:before
      //     @include resizer-style
      //     top: calc(50% - $resizer-short / 2)
      //     left: calc(50% - $resizer-long / 2)
      //     width: $resizer-long
      //     height: $resizer-short

      // &[data-tag="right"]
      //   right: 0
      //   top: calc(50% - $resizer-short / 2)
      //   width: 50%
      //   height: $resizer-short

      //   &:before
      //     @include resizer-style
      //     top: calc(50% - $resizer-short / 2)
      //     left: calc(50% - $resizer-long / 2)
      //     width: $resizer-long
      //     height: $resizer-short
</style>
