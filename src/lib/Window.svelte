<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  export const minSize = 200;
  export const dbclickSpan = 300;
  export const transition = 0.5;
  export const fullWindowMargin = 20;
  const dispatch = createEventDispatcher();

  export let title: string = "Window";
  export let focus: boolean = false;

  interface WindowSize {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }

  let numberOfClick = 0,
    clickTimer;
  let w: HTMLDivElement;
  let resizeEl: HTMLElement;
  let repositionShouldTrigger: boolean;
  let windowSize: WindowSize = {
    left: 200,
    right: 200,
    top: 100,
    bottom: 100,
  };
  let previousWindowSize: WindowSize = {} as WindowSize;

  onMount(() => {
    saveCurrentWindowSize();
    windowSize = { ...previousWindowSize };
  })

  export function getDOMElement() {
    return w;
  }

  export function getWindowSize() {
    return { ...windowSize };
  }

  export function resize(size: WindowSize, withAnimation: boolean = false, triggerEvent: boolean = true) {
    if (withAnimation) {
      w.style.transition = `all ${transition}s`;
    }
    w.style.top = `${size.top}px`;
    w.style.right = `${size.right}px`;
    w.style.bottom = `${size.bottom}px`;
    w.style.left = `${size.left}px`;
    if (withAnimation) {
      setTimeout(() => {
        w.style.transition = "";
      }, transition * 1000);
    }
    windowSize = { ...size };

    if (triggerEvent) {
      dispatch("resize", {
        target: w,
        data: size,
      });
    }
  }

  export function scale(x, y, withAnimation: boolean = true) {
    if (withAnimation) {
      w.style.transition = `all ${transition}s`;
    }
    w.style.transform = `scale(${x}, ${y})`;
    if (withAnimation) {
      setTimeout(() => {
        w.style.transition = ``;
      }, transition * 1000);
    }
  }

  export function reposition(deltaX: number, deltaY: number, triggerEvent: boolean = true) {
    windowSize.top += deltaY;
    windowSize.left += deltaX;
    windowSize.right -= deltaX;
    windowSize.bottom -= deltaY;

    if (windowSize.bottom >= 0 && windowSize.top >= 0) {
      w.style.top = `${windowSize.top}px`;
      w.style.bottom = `${windowSize.bottom}px`;
    }
    if (windowSize.right >= 0 && windowSize.left >= 0) {
      w.style.left = `${windowSize.left}px`;
      w.style.right = `${windowSize.right}px`;
    }

    if (triggerEvent) {
      dispatch("reposition", {
        target: w,
        data: { deltaX, deltaY },
      });
    }
  }

  export function saveCurrentWindowSize() {
    previousWindowSize.top = w.getBoundingClientRect().top;
    previousWindowSize.left = w.getBoundingClientRect().left;
    previousWindowSize.bottom = window.innerHeight - w.getBoundingClientRect().bottom;
    previousWindowSize.right = window.innerWidth - w.getBoundingClientRect().right;
  }

  function onWindowClicked(e: MouseEvent) {
    dispatch("focus", {
      target: w,
      DOMEvent: e,
    });
  }

  function onMinBtnClicked(event: Event) {
    resize(
      {
        top: windowSize.top,
        bottom: window.innerHeight - windowSize.top - 30,
        left: windowSize.left,
        right: window.innerWidth - windowSize.left - 200,
      },
      true
    );
  }

  function onMaxBtnClicked(event: Event) {
    resize(
      {
        top: fullWindowMargin,
        left: fullWindowMargin,
        right: fullWindowMargin,
        bottom: fullWindowMargin,
      },
      true
    );
  }

  let resizeHandlers = {
    start: (e: MouseEvent) => {
      resizeEl = e.target as HTMLElement;
      resizeEl.style.transform = `scale(100, 100) translateZ(100px)`;
      saveCurrentWindowSize();
      dispatch("resizeStart", {
        target: w,
        DOMEvent: e,
      });
    },

    tick: (e: MouseEvent) => {
      if (resizeEl === undefined) return;
      let r = window.innerWidth - e.clientX,
        b = window.innerHeight - e.clientY;

      let size = {
        top: resizeEl.dataset["tag"].includes("top") ? e.clientY : windowSize.top,
        left: resizeEl.dataset["tag"].includes("left")
          ? e.clientX
          : windowSize.left,
        right: resizeEl.dataset["tag"].includes("right") ? r : windowSize.right,
        bottom: resizeEl.dataset["tag"].includes("bottom")
          ? b
          : windowSize.bottom,
      };

      if (window.innerWidth - size.right - size.left < minSize) {
        if (resizeEl.dataset["tag"].includes("right")) {
          size.right = windowSize.right;
        } else {
          size.left = windowSize.left;
        }
      }

      if (window.innerHeight - size.bottom - size.top < minSize) {
        if (resizeEl.dataset["tag"].includes("top")) {
          size.top = windowSize.top;
        } else {
          size.bottom = windowSize.bottom;
        }
      }

      resize(size);
    },

    end: (e: MouseEvent) => {
      if (resizeEl !== undefined) {
        resizeEl.style.transform = `scale(1, 1) translateZ(0px)`;
      }
      resizeEl = undefined;
      dispatch("resizeEnd", {
        target: w,
        DOMEvent: e,
      });
    }
  }

  let repositionHandlers = {
    start: (e: MouseEvent) => {
      numberOfClick += 1;
      if (numberOfClick === 1) {
        repositionShouldTrigger = true;
        clickTimer = setTimeout(() => {
          if (!repositionShouldTrigger) {
            numberOfClick = 0;
            return;
          }
          (e.target as HTMLElement).style.transform = "scale(100, 100)";
          (e.target as HTMLElement).style.zIndex = "10";
          console.log('single click triggered');
          numberOfClick = 0;
          dispatch("repositionStart", {
            target: w,
            DOMEvent: e,
          });
        }, dbclickSpan);
      } else if (numberOfClick >= 2) {
        clearTimeout(clickTimer);
        console.log('double click triggered');
        resize(previousWindowSize, true);
        numberOfClick = 0;
      }
    },

    tick: (e: MouseEvent) => {
      if (!repositionShouldTrigger) return;
      reposition(e.movementX, e.movementY);
    },

    end: (e: MouseEvent) => {
      (e.target as HTMLElement).style.transform = "scale(1, 1)";
      (e.target as HTMLElement).style.zIndex = "0";
      repositionShouldTrigger = false;
      dispatch("repositionEnd", {
        target: w,
        DOMEvent: e,
      });
    }
  }
</script>

<div
  class:focused={focus}
  class="window"
  bind:this={w}
  on:mousedown={onWindowClicked}
>
  <div class="resize-controller">
    <div
      data-tag="left"
      class="ctrl ctrl-left"
      on:mousedown={resizeHandlers.start}
      on:mousemove={resizeHandlers.tick}
      on:mouseup={resizeHandlers.end}
    />
    <div
      data-tag="top"
      class="ctrl ctrl-top"
      on:mousedown={resizeHandlers.start}
      on:mousemove={resizeHandlers.tick}
      on:mouseup={resizeHandlers.end}
    />
    <div
      data-tag="right"
      class="ctrl ctrl-right"
      on:mousedown={resizeHandlers.start}
      on:mousemove={resizeHandlers.tick}
      on:mouseup={resizeHandlers.end}
    />
    <div
      data-tag="bottom"
      class="ctrl ctrl-bottom"
      on:mousedown={resizeHandlers.start}
      on:mousemove={resizeHandlers.tick}
      on:mouseup={resizeHandlers.end}
    />
    <div
      data-tag="top-left"
      class="ctrl ctrl-square ctrl-top-left"
      on:mousedown={resizeHandlers.start}
      on:mousemove={resizeHandlers.tick}
      on:mouseup={resizeHandlers.end}
    />
    <div
      data-tag="top-right"
      class="ctrl ctrl-square ctrl-top-right"
      on:mousedown={resizeHandlers.start}
      on:mousemove={resizeHandlers.tick}
      on:mouseup={resizeHandlers.end}
    />
    <div
      data-tag="bottom-left"
      class="ctrl ctrl-square ctrl-bottom-left"
      on:mousedown={resizeHandlers.start}
      on:mousemove={resizeHandlers.tick}
      on:mouseup={resizeHandlers.end}
    />
    <div
      data-tag="bottom-right"
      class="ctrl ctrl-square ctrl-bottom-right"
      on:mousedown={resizeHandlers.start}
      on:mousemove={resizeHandlers.tick}
      on:mouseup={resizeHandlers.end}
    />
  </div>
  <div class="toolbar">
    <div class="title">
      {title}
    </div>
    <div
      class="inflator"
      on:mousedown={repositionHandlers.start}
      on:mousemove={repositionHandlers.tick}
      on:mouseup={repositionHandlers.end}
    />
    <div class="btn-container">
      <div class="btn btn-max" on:mouseup={onMaxBtnClicked}><span>◻︎</span></div>
      <div class="btn btn-min" on:mouseup={onMinBtnClicked}><span>-</span></div>
    </div>
  </div>
  <hr />
  <div class="content-container">
    <div class="content">
      <slot />
    </div>
  </div>
  <div class="statusbar">
    <!-- empty -->
  </div>
</div>

<style lang="sass">
  $window-border: 2px
  $window-shadow: calc(3 * $window-border)
  $window-shadow-stripe: 0.8px
  $toolbar-height: 26px
  $toolbar-color: #fafafa
  $content-margin: 5px
  $ctrl-short: 10px
  $ctrl-long: calc(100% - $ctrl-short * 2)
  $ctrl-offset: calc(1px - $window-border + $ctrl-short)

  .window
    position: absolute
    top: 40vh
    left: 40vw
    bottom: 40vh
    right: 40vw
    border: solid $window-border #000
    background-color: white

    .content-container
      position: relative
      height: calc(100% - $toolbar-height)
      width: calc(100% + 2px)
      margin-top: -1px
      margin-left: -1px
      overflow: auto
      .content
        padding: 5px

    .content-container::-webkit-scrollbar
      border: 1px solid #000
      background: repeating-linear-gradient(90deg, #000 0px, #000 0.3px, #fff 0.3px, #fff 3px)

    .content-container::-webkit-scrollbar-thumb
      border: 1px solid #000
      box-shadow: 0px 1px #000
      cursor: pointer
      background: $toolbar-color

    .toolbar
      position: relative
      height: $toolbar-height
      background: $toolbar-color
      .title
        position: relative
        top: 0
        left: 0
        width: 60%
        height: 100%
        float: right
        line-height: 150%
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
        user-select: none
      .inflator
        position: absolute
        top: 0
        left: 0
        height: $toolbar-height
        width: 100%
        z-index: 0
        cursor: grab
      .btn-container
        position: relative
        display: flex
        height: 100%
        align-items: center
        float: left
        padding: 0px 2px
      .btn
        display: inline-block
        border: solid 1px #333
        text-align: center
        margin: 3px
        user-select: none
      .btn:hover
        border: solid 0.5px #f00
        cursor: pointer
        background: #eee
      .btn-max, .btn-min
        line-height: 100%
        height: 15px
        width: 15px
      + hr
        padding: 0px
        margin: 0px
        border: 1px solid #000

    .resize-controller
      position: absolute
      top: calc(0px - $ctrl-short - 1px)
      left: calc(0px - $ctrl-short - 1px)
      width: calc(100% + $ctrl-short * 2)
      height: calc(100% + $ctrl-short * 2)
      pointer-events: none

      .ctrl
        position: absolute
        padding: 0
        margin: 0
        pointer-events: auto
        transform-style: preserve-3d
      .ctrl-left
        left: 0
        top: $ctrl-offset
        height: $ctrl-long
        width: $ctrl-short
        cursor: ew-resize
      .ctrl-top
        top: 0
        left: $ctrl-offset
        width: $ctrl-long
        height: $ctrl-short
        cursor: ns-resize
      .ctrl-right
        right: 0
        top: $ctrl-offset
        width: $ctrl-short
        height: $ctrl-long
        cursor: ew-resize
      .ctrl-bottom
        right: $ctrl-offset
        bottom: 0
        width: $ctrl-long
        height: $ctrl-short
        cursor: ns-resize

      .ctrl-square
        height: $ctrl-short
        width: $ctrl-short
      .ctrl-top-left
        top: 0
        left: 0
        cursor: nwse-resize
      .ctrl-top-right
        top: 0
        right: 0
        cursor: nesw-resize
      .ctrl-bottom-left
        bottom: 0
        left: 0
        cursor: nesw-resize
      .ctrl-bottom-right
        bottom: 0
        right: 0
        cursor: nwse-resize

  .window.focused
    transform-style: preserve-3d

  .window.focused::before
    position: absolute
    display: block
    top: $window-shadow
    left: $window-shadow
    width: 100%
    height: 100%
    background: repeating-linear-gradient(50deg, #000 0px, #000 $window-shadow-stripe, #fff $window-shadow-stripe, #fff 2.2px)
    transform: translateZ(-2px)
    border: $window-shadow-stripe solid #000
    content: ""
</style>
