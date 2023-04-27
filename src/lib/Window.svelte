<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { mouseTracker } from "./utils/actions";
  import { FULL_WINDOW_MARGIN, MIN_SIZE, TRANSITION } from "./utils/constants";
  import type { WindowConfig } from "./utils/types";
  import { currentWindow, topZIndex } from "./stores/windows";
  import { get } from "svelte/store";

  export let config: WindowConfig = undefined;
  export let disabled: boolean = false;
  export let blur: boolean = false;
  export let noResize: boolean = false;
  
  export const ID = Math.random().toString(36).substring(2, 9);
  export const transformAPI = {
    transform: (str: string, withAnimation: boolean = true) => {
      doWithAnimation(withAnimation, () => {
        w.style.transform = str;
      });
    },
    reset: (withAnimation: boolean = true) => {
      doWithAnimation(withAnimation, () => {
        w.style.transform = "";
      });
    },
  };

  type WindowSize = {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };

  let w: HTMLDivElement;
  let resizeEl: HTMLElement;
  let windowSize: WindowSize = {
    left: 200,
    right: 200,
    top: 100,
    bottom: 100,
  };
  let previousWindowSize: WindowSize = {} as WindowSize;
  let repositionOffset = {
    left: 0,
    top: 0,
  };
  let focused = false;

  const dispatch = createEventDispatcher();
  const HIDE_SIDEBAR_EP = 500;

  onMount(() => {
    saveCurrentWindowSize();
    if (config !== undefined) {
      resize(
        {
          top: config.y,
          left: config.x,
          bottom: window.innerHeight - config.y - config.height,
          right: window.innerWidth - config.x - config.width,
        },
        false,
        false
      );
      reposition(config.x, config.y, false);
      saveCurrentWindowSize();
    }
    windowSize = { ...previousWindowSize };
    setTimeout(() => {
      dispatch('ready', w);
    });
  });

  $: width = window.innerWidth - windowSize.left - windowSize.right;
  $: height = window.innerHeight - windowSize.top - windowSize.bottom;
  $: resizeDisabled = disabled || noResize;

  currentWindow.subscribe((v) => {
    focused = v === w;
    if (v === w) {
      w.style.zIndex = `${get(topZIndex) + 1}`;
      topZIndex.update((v) => v + 1);
    }
  })

  export function getWindowSize() {
    return { ...windowSize };
  }

  export function resize(
    size: WindowSize,
    withAnimation: boolean = false,
    triggerEvent: boolean = true
  ) {
    doWithAnimation(withAnimation, () => {
      w.style.top = `${size.top}px`;
      w.style.right = `${size.right}px`;
      w.style.bottom = `${size.bottom}px`;
      w.style.left = `${size.left}px`;
    });
    windowSize = { ...size };

    if (triggerEvent) {
      dispatch("resize", {
        target: w,
        data: {
          x: size.left,
          y: size.top,
          width: window.innerWidth - size.left - size.right,
          height: window.innerHeight - size.top - size.bottom,
        },
      });
    }
  }

  export function repositionZ(z: number) {
    w.style.zIndex = `${z}`;
  }

  export function reposition(
    x: number,
    y: number,
    triggerEvent: boolean = true
  ) {
    const height = window.innerHeight - windowSize.top - windowSize.bottom,
      width = window.innerWidth - windowSize.left - windowSize.right;

    windowSize.top = y;
    windowSize.left = x;
    windowSize.right = window.innerWidth - width - x;
    windowSize.bottom = window.innerHeight - height - y;

    w.style.top = `${windowSize.top}px`;
    w.style.bottom = `${windowSize.bottom}px`;
    w.style.left = `${windowSize.left}px`;
    w.style.right = `${windowSize.right}px`;

    if (triggerEvent) {
      dispatch("reposition", {
        target: w,
        data: { x, y },
      });
    }
  }

  export function saveCurrentWindowSize() {
    previousWindowSize.top = w.getBoundingClientRect().top;
    previousWindowSize.left = w.getBoundingClientRect().left;
    previousWindowSize.bottom =
      window.innerHeight - w.getBoundingClientRect().bottom;
    previousWindowSize.right =
      window.innerWidth - w.getBoundingClientRect().right;
  }

  function doWithAnimation(yes: boolean, block: () => void) {
    if (yes) {
      w.style.transition = `all ${TRANSITION}s`;
    }
    block();
    if (yes) {
      setTimeout(() => {
        w.style.transition = ``;
      }, TRANSITION * 1000);
    }
  }

  function onWindowClicked() {
    currentWindow.set(w);
  }

  function onCloseBtnClicked() {
    dispatch('destroy');
  }

  function onMinBtnClicked() {
    if (resizeDisabled) return;
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

  function onMaxBtnClicked() {
    if (resizeDisabled) return;
    resize(
      {
        top: FULL_WINDOW_MARGIN,
        left: FULL_WINDOW_MARGIN,
        right: FULL_WINDOW_MARGIN,
        bottom: FULL_WINDOW_MARGIN,
      },
      true
    );
  }

  function resizeHandler(e: MouseEvent) {
    function tick(e: MouseEvent) {
      if (resizeDisabled) return;
      if (resizeEl === undefined) return;
      let r = window.innerWidth - e.clientX,
        b = window.innerHeight - e.clientY;

      let size = {
        top: resizeEl.dataset["tag"].includes("top")
          ? e.clientY
          : windowSize.top,
        left: resizeEl.dataset["tag"].includes("left")
          ? e.clientX
          : windowSize.left,
        right: resizeEl.dataset["tag"].includes("right") ? r : windowSize.right,
        bottom: resizeEl.dataset["tag"].includes("bottom")
          ? b
          : windowSize.bottom,
      };

      if (window.innerWidth - size.right - size.left < MIN_SIZE) {
        if (resizeEl.dataset["tag"].includes("right")) {
          size.right = windowSize.right;
        } else {
          size.left = windowSize.left;
        }
      }

      if (window.innerHeight - size.bottom - size.top < MIN_SIZE) {
        if (resizeEl.dataset["tag"].includes("top")) {
          size.top = windowSize.top;
        } else {
          size.bottom = windowSize.bottom;
        }
      }

      resize(size);
    };

    function end(e: MouseEvent) {
      if (resizeEl !== undefined) {
        resizeEl.style.transform = `scale(1, 1) translateZ(0px)`;
      }
      resizeEl = undefined;
      dispatch("resizeEnd", {
        target: w,
        DOMEvent: e,
      });
    };

    if (resizeDisabled) return;
    resizeEl = e.target as HTMLElement;
    window.onmousemove = (e: MouseEvent) => {
      tick(e);
    };
    window.onmouseup = (e: MouseEvent) => {
      end(e);
      window.onmouseup = undefined;
      window.onmousemove = undefined;
    };
    saveCurrentWindowSize();
    dispatch("resizeStart", {
      target: w,
      DOMEvent: e,
    });
  };

  function onRepositionStart(e: CustomEvent) {
    if (disabled) return;
    saveCurrentWindowSize();
    repositionOffset.left = windowSize.left - e.detail.x;
    repositionOffset.top = windowSize.top - e.detail.y;
    dispatch("repositionStart", {
      target: w,
      DOMEvent: e,
    });
  };

  function onReposition(e: CustomEvent) {
    if (disabled) return;
    reposition(
      e.detail.x + repositionOffset.left,
      e.detail.y + repositionOffset.top
    );
  };

  function onRepositionEnd(e: CustomEvent) {
    if (disabled) return;
    dispatch("repositionEnd", {
      target: w,
      DOMEvent: e,
    });
  };
</script>

<div
  bind:this={w}
  class="window-container"
  transition:fade
  use:mouseTracker={"reposition-controller"}
  on:trackStart={onRepositionStart}
  on:trackUpdate={onReposition}
  on:trackEnd={onRepositionEnd}
>
  <div class="window" class:nofocus={!focused} on:mousedown={onWindowClicked}>
    <div class="toolbar">
      <div id="reposition-controller" />
      <div class="btn-container">
        <div class="btn btn-close" on:mouseup={onCloseBtnClicked} />
        <div
          class="btn btn-min"
          on:mouseup={onMinBtnClicked}
          class:disabled={noResize}
          aria-disabled={noResize}
        />
        <div
          class="btn btn-max"
          on:mouseup={onMaxBtnClicked}
          class:disabled={noResize}
          aria-disabled={noResize}
        />
      </div>
      <div
        class="customized-toolbar"
        class:blur
        class:full-width={width <= HIDE_SIDEBAR_EP}
        class:pl-80={width <= HIDE_SIDEBAR_EP}
      >
        <slot name="toolbar" />
      </div>
    </div>
    <div class="sidebar-container" hidden={width <= HIDE_SIDEBAR_EP}>
      <slot name="sidebar" />
    </div>
    <div class="content-container" class:full-width={width <= HIDE_SIDEBAR_EP}>
      <div class="content" class:blur>
        <slot name="content" />
      </div>
    </div>
    <div class="statusbar">
      <!-- empty -->
    </div>
  </div>
  <div class="resize-controller" hidden={resizeDisabled}>
    <div
      class="ctrl ctrl-left"
      data-tag="left"
      use:mouseTracker
      on:trackStart={resizeHandler}
    />
    <div class="ctrl ctrl-top" data-tag="top" on:mousedown={resizeHandler} />
    <div
      class="ctrl ctrl-right"
      data-tag="right"
      on:mousedown={resizeHandler}
    />
    <div
      class="ctrl ctrl-bottom"
      data-tag="bottom"
      on:mousedown={resizeHandler}
    />
    <div
      class="ctrl ctrl-square ctrl-top-left"
      data-tag="top-left"
      on:mousedown={resizeHandler}
    />
    <div
      class="ctrl ctrl-square ctrl-top-right"
      data-tag="top-right"
      on:mousedown={resizeHandler}
    />
    <div
      class="ctrl ctrl-square ctrl-bottom-left"
      data-tag="bottom-left"
      on:mousedown={resizeHandler}
    />
    <div
      class="ctrl ctrl-square ctrl-bottom-right"
      data-tag="bottom-right"
      on:mousedown={resizeHandler}
    />
  </div>
</div>

<style lang="scss">
  $window-border: 1px;
  $window-shadow: calc(3 * $window-border);
  $window-shadow-stripe: 0.8px;
  $toolbar-height: 52px;
  $toolbar-color: #fafafa;
  $content-margin: 5px;
  $ctrl-short: 10px;
  $ctrl-long: calc(100% - $ctrl-short * 2);
  $ctrl-offset: calc(1px - $window-border + $ctrl-short);
  $sidebar-width: 200px;
  $border-color: #0000002f;
  $border-radius: 15px;

  $window-z: 0;
  $base-z: calc(1 + $window-z);
  $toolbar-z: calc(1 + $base-z);
  $reposition-z: calc(1 + $toolbar-z);
  $toolbar-el-z: calc(1 + $reposition-z);

  @mixin grid-layout {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 52px 1fr;
  }

  @mixin sidebar-grid {
    grid-column: 1;
    grid-row: 1 / 4;
  }

  @mixin content-grid {
    grid-column: 2 / 4;
    grid-row: 1 / 4;
  }

  @mixin blur-effect {
    background: #f5f5f5a5 !important;
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
  }

  :global(*) {
    font-family: "San Francisco", "Helvetica Neue", serif;
  }

  .full-width {
    grid-column: 1 / 4 !important;
  }

  .pl-80 {
    padding-left: 80px;
  }

  .blur {
    @include blur-effect;
  }

  #reposition-controller {
    position: absolute;
    top: 0;
    left: 0;
    height: $toolbar-height;
    width: 100%;
    z-index: $reposition-z;
  }

  .resize-controller {
    position: absolute;
    left: -$ctrl-short;
    top: -$ctrl-short;
    height: calc(100% + 2 * $ctrl-short);
    width: calc(100% + 2 * $ctrl-short);
    z-index: 1000;
    pointer-events: none;

    .ctrl {
      position: absolute;
      padding: 0;
      margin: 0;
      pointer-events: auto;
      transform-style: preserve-3d;
    }

    .ctrl-left {
      left: 0;
      top: $ctrl-offset;
      height: $ctrl-long;
      width: $ctrl-short;
      cursor: ew-resize;
    }

    .ctrl-top {
      top: 0;
      left: $ctrl-offset;
      width: $ctrl-long;
      height: $ctrl-short;
      cursor: ns-resize;
    }

    .ctrl-right {
      right: 0;
      top: $ctrl-offset;
      width: $ctrl-short;
      height: $ctrl-long;
      cursor: ew-resize;
    }

    .ctrl-bottom {
      right: $ctrl-offset;
      bottom: 0;
      width: $ctrl-long;
      height: $ctrl-short;
      cursor: ns-resize;
    }

    .ctrl-square {
      height: $ctrl-short;
      width: $ctrl-short;
    }

    .ctrl-top-left {
      top: 0;
      left: 0;
      cursor: nwse-resize;
    }

    .ctrl-top-right {
      top: 0;
      right: 0;
      cursor: nesw-resize;
    }

    .ctrl-bottom-left {
      bottom: 0;
      left: 0;
      cursor: nesw-resize;
    }

    .ctrl-bottom-right {
      bottom: 0;
      right: 0;
      cursor: nwse-resize;
    }
  }

  .window-container {
    position: absolute;
    top: 40vh;
    left: 40vw;
    bottom: 40vh;
    right: 40vw;
    z-index: 1;
    box-shadow: 0 0 40px -5px $border-color;
    border: solid $window-border $border-color;
    border-radius: $border-radius;
    background: transparent;
  }

  .window {
    @include grid-layout;
    position: relative;
    height: 100%;
    width: 100%;
    background: transparent;
    transform-origin: top left;
    border-radius: $border-radius;
    user-select: none;
    overflow: hidden;
    z-index: $window-z;

    .sidebar-container,
    .content-container {
      padding-top: $toolbar-height;
      z-index: $base-z;
    }

    .sidebar-container {
      @include sidebar-grid;
      @include blur-effect;
      border-right: 0.5px solid $border-color;
      box-shadow: inset $border-color -8px 0 10px -10px;
      border-radius: $border-radius 0 0 $border-radius;
    }

    .content-container {
      @include content-grid;
      border-bottom-right-radius: $border-radius;
      overflow: hidden;

      .content {
        height: 100%;
        width: 100%;
        background-color: white;
      }
    }

    .toolbar {
      @include grid-layout;
      grid-column: 1 / 4;
      grid-row: 1;
      height: $toolbar-height;
      width: 100%;
      border-radius: $border-radius $border-radius 0 0;
      user-select: none;
      z-index: $toolbar-z;

      :global(.btn) {
        pointer-events: auto;
      }

      .btn-container {
        @include sidebar-grid;
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        min-width: $sidebar-width;
        padding: 0 0 0 calc($toolbar-height / 3);
        border-radius: $border-radius 0 0 0;
        pointer-events: none;
        z-index: $toolbar-el-z + 1;
      }

      .customized-toolbar {
        @include content-grid;
        background-color: white;
        border-radius: 0 $border-radius 0 0;
        border-bottom: solid 1px transparent;
        transition: background-color 0.3s, border-bottom 0.3s, box-shadow 0.3s;
        transition-delay: 0s;
        pointer-events: none;
        z-index: $toolbar-el-z;

        &:hover {
          background-color: $toolbar-color;
          border-bottom: solid 0.5px rgba(197, 197, 197, 0.3);
          box-shadow: 0 1px 1px 0 rgba(100, 100, 100, 0.2);
          transition-delay: 0.3s;
        }
      }

      .btn {
        display: inline-block;
        text-align: center;
        margin: 0 8px 0 0;
        user-select: none;

        &.disabled {
          background: rgb(216, 216, 216) !important;
        }
      }

      .btn:hover {
        cursor: pointer;
      }

      .btn-max,
      .btn-min,
      .btn-close {
        box-sizing: content-box;
        line-height: 100%;
        height: 11px;
        width: 11px;
        border-radius: 50%;
        border: 1px solid #00000022;
      }

      .btn-max {
        background: #00ca4e;
      }

      .btn-min {
        background: #ffbd44;
      }

      .btn-close {
        background: #ff605c;
      }
    }
  }

  .window.nofocus {
    transform-style: preserve-3d;
    z-index: 1000;
    background: #ececec;
  }
</style>
