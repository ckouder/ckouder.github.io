<script lang="ts">
  import Window from "./Window.svelte";

  enum WindowMode {
    NORMAL,
    SELECT
  };

  let resizeController: HTMLDivElement;
  let shouldReposition: boolean;
  let windows = [1, 2, 3];
  let windowComps = [];
  let selectDirection: string;
  let mode: WindowMode = WindowMode.NORMAL;
  let focusWindowIdx: number;

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

  export function enterWindowSelectMode(dir: string, idx: number = undefined) {
    let candidateWindows = windowComps.filter((v, i) => i !== idx);
    candidateWindows.forEach((v) => {
      v.scale(0.7, 0.7);
    });
    mode = WindowMode.SELECT;
    selectDirection = dir;
  }

  export function exitWindowSelectMode(idx: number = undefined) {
    windowComps.forEach((v, i) => {
      let domV = v.getDOMElement();
      domV.style.transition = `all 0.5s`;
      domV.style.transform = ``;
      if (i === idx) {
        let size = v.getWindowSize();
        let deltaX = 0, deltaY = 0;
        let newSize = { 
          top: v.fullWindowMargin, 
          left: v.fullWindowMargin, 
          right: v.fullWindowMargin, 
          bottom: v.fullWindowMargin 
        };
        if (selectDirection.includes('left')) {
          newSize.left = window.innerWidth / 2 - 1;
          deltaX = -newSize.left + window.innerWidth / 2 - 1;
        }
        if (selectDirection.includes('right')) {
          newSize.right = window.innerWidth / 2 - 1;
          deltaX = -newSize.left + v.fullWindowMargin;
        }
        if (selectDirection.includes('top')) {
          newSize.top = window.innerHeight / 2 - 1;
          if (selectDirection.includes('left') || selectDirection.includes('right'))
            deltaY = -newSize.top + v.fullWindowMargin;
          else
            deltaY = -newSize.top + window.innerHeight / 2 - 1;
        }
        if (selectDirection.includes('bottom')) {
          newSize.bottom = window.innerHeight / 2 - 1;
          if (selectDirection.includes('left') || selectDirection.includes('right'))
            deltaY = -newSize.top + window.innerHeight / 2 - 1;
          else
            deltaY = -newSize.top + v.fullWindowMargin;
        }
        v.resize(newSize, true, false);
        v.reposition(deltaX, deltaY, false);
      }
      setTimeout(() => {
        domV.style.transition = ``;
      }, 1000);
    });
    mode = WindowMode.NORMAL;
    selectDirection = '';
  }

  function onWindowResize(dimension) {
    console.log("resize received: ", dimension);
  }

  function onWindowFocus(event: CustomEvent, idx: number) {
    if (mode === WindowMode.SELECT) {
      exitWindowSelectMode(idx);
    } else {
      focusWindowIdx = idx;
    }
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
    let newSize = {
      top: target.fullWindowMargin,
      bottom: target.fullWindowMargin,
      right: target.fullWindowMargin,
      left: target.fullWindowMargin
    };
    let verticalMode = containTop ? "top" : containBottom ? "bottom" : "",
      horizontalMode = containLeft ? "left" : containRight ? "right" : "",
      mode = verticalMode
        ? horizontalMode
          ? `${verticalMode}-${horizontalMode}`
          : verticalMode
        : horizontalMode
        ? horizontalMode
        : "";
    if (containRight) {
      newSize.left = window.innerWidth / 2 - 1;
    }
    if (containLeft) {
      newSize.right = window.innerWidth / 2 - 1;
    }
    if (containBottom) {
      newSize.top = window.innerHeight / 2 - 1;
    }
    if (containTop) {
      newSize.bottom = window.innerHeight / 2 - 1;
    }

    target.resize(newSize, true, false);
    enterWindowSelectMode(mode, idx);
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
      focus={focusWindowIdx === i}
      bind:this={windowComps[i]}
      on:repositionStart={(e) => onWindowRepositionStart(e, i)}
      on:repositionEnd={(e) => onWindowRepositionEnd(e, i)}
      on:reposition={(e) => onWindowRepositioning(e, i)}
      on:focus={(e) => onWindowFocus(e, i)}
    />
  {/each}
  <div class="resize-controller" bind:this={resizeController}>
    <div data-tag="left" class="ctrl" />
    <div data-tag="top" class="ctrl" />
    <div data-tag="right" class="ctrl" />
    <div data-tag="bottom" class="ctrl" />
  </div>
  <div class="resizer-container">
    <div class="resizer" data-tag="top" />
    <div class="resizer" data-tag="bottom" />
    <div class="resizer" data-tag="left" />
    <div class="resizer" data-tag="right" />
    <div class="resizer" data-tag="top-bottom" />
    <div class="resizer" data-tag="left-right" />
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
