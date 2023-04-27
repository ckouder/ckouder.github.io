<script lang="ts">
  import Window from "../Window.svelte";
  import { switchable } from "../utils/actions";
  import Foldable from "../Foldable.svelte";
  import Item from "./Finder/Item.svelte";

  export let title: string = "Applications";

  export const APP_NAME = 'Finder';

  const HIDE_SEARCH_EP = 1100,
    HIDE_VIEW_EP = 1000,
    DELTA = 30,
    HIDE_MORE = 770,
    HIDE_TAG = HIDE_MORE - DELTA,
    HIDE_SHARE = HIDE_TAG - DELTA,
    HIDE_FILTER = HIDE_SHARE - DELTA,
    HIDE_VIEW = HIDE_FILTER - DELTA - 40,
    SIDEBAR_FOLDABLES = [
      {
        title: "Favorites",
        items: [
          { icon: "assets/images/airdrop@2x.png", title: "AirDrop" },
          { icon: "assets/images/app@2x.png", title: "Applications" },
          {
            icon: "assets/images/menubar.dock.rectangle@2x.png",
            title: "Desktop",
          },
          { icon: "assets/images/doc@2x.png", title: "Documents" },
        ],
      },
      {
        title: "iCloud",
        items: [
          { icon: "assets/images/icloud@2x.png", title: "iCloud Drive" },
          {
            icon: "assets/images/folder.badge.person.crop@2x.png",
            title: "Shared",
          },
        ],
      },
    ];

  let windowWidth = 800;

  function onSidebarItemFocus(e: CustomEvent) {
    title = e.detail.querySelector("span").innerText;
  }

  function onWindowResize(e: CustomEvent) {
    windowWidth = e.detail.data.width;
  }
</script>

<Window
  on:resize={onWindowResize}
  on:ready
  on:destroy
  config={{ x: 100, y: 100, z: 0, width: 800, height: 600 }}
>
  <div class="toolbar" slot="toolbar">
    <button class="btn btn-backwards">
      <img src="assets/images/chevron.backward@2x.png" alt="backward" />
    </button>
    <button class="btn btn-forwards">
      <img src="assets/images/chevron.forward@2x.png" alt="forward" />
    </button>
    <h4>{title}</h4>
    <div class="btn-group-container">
      <div
        class="btn-group btn-group-view mr-40"
        use:switchable={"button"}
        class:no-visibility={windowWidth <= HIDE_VIEW}
      >
        <button class="btn btn-view focused">
          <img src="assets/images/square.grid.2x2@2x.png" alt="square" />
          {#if windowWidth <= HIDE_VIEW_EP}
            <img
              src="assets/images/chevron.up.chevron.down@2x.png"
              alt="view up"
            />
          {/if}
        </button>
        <span class="btn-group" class:no-display={windowWidth <= HIDE_VIEW_EP}>
          <span class="vertical-sep" />
          <button class="btn btn-view-list">
            <img src="assets/images/list.bullet@2x.png" alt="list" />
          </button>
          <span class="vertical-sep" />
          <button class="btn btn-view-panel">
            <img src="assets/images/rectangle.split.3x1@2x.png" alt="split" />
          </button>
          <span class="vertical-sep" />
          <button class="btn btn-view-gallery">
            <img
              src="assets/images/squares.below.rectangle@2x.png"
              alt="gallary"
            />
          </button>
        </span>
      </div>
      <div class="btn-group btn-group-others mr-40">
        <button
          class="btn btn-filter"
          class:no-visibility={windowWidth <= HIDE_FILTER}
        >
          <img
            src="assets/images/square.grid.3x1.below.line.grid.1x2@2x.png"
            alt="panel"
          />
          <img src="assets/images/chevron.down@2x.png" alt="more" />
        </button>
        <button
          class="btn btn-share"
          class:no-visibility={windowWidth <= HIDE_SHARE}
        >
          <img src="assets/images/square.and.arrow.up@2x.png" alt="up" />
        </button>
        <button
          class="btn btn-tag"
          class:no-visibility={windowWidth <= HIDE_TAG}
        >
          <img src="assets/images/tag@2x.png" alt="tag" />
        </button>
        <button
          class="btn btn-more"
          class:no-visibility={windowWidth <= HIDE_MORE}
        >
          <img src="assets/images/ellipsis.circle@2x.png" alt="more" />
          <img src="assets/images/chevron.down@2x.png" alt="more" />
        </button>
      </div>
      {#if windowWidth > HIDE_SEARCH_EP}
        <div class="inflator-lg" />
      {:else}
        <div class="inflator-sm" />
      {/if}
    </div>
    <div class="search-group">
      {#if windowWidth <= HIDE_MORE}
        <button class="btn btn-hide">
          <img src="assets/images/chevron.forward.2@2x.png" alt="forward" />
        </button>
      {/if}
      <button
        class="btn btn-search"
        class:no-display={windowWidth > HIDE_SEARCH_EP}
      >
        <img src="assets/images/magnifyingglass@2x.png" alt="search" />
      </button>
      <div
        class="input-search"
        class:no-display={windowWidth <= HIDE_SEARCH_EP}
      >
        <input type="text" placeholder="Search" />
      </div>
    </div>
  </div>
  <div
    class="sidebar"
    slot="sidebar"
    use:switchable={"li"}
    on:focus={onSidebarItemFocus}
  >
    {#each SIDEBAR_FOLDABLES as foldable}
      <Foldable title={foldable.title}>
        <ul slot="itemsToFold">
          {#each foldable.items as item}
            <li class:focused={title === item.title}>
              <div>
                <img class="sidebar-icon" src={item.icon} alt={item.title} />
              </div>
              <span>{item.title}</span>
            </li>
          {/each}
        </ul>
      </Foldable>
    {/each}
  </div>
  <div slot="content">
    {#if title === "Applications"}
      <div class="content-panel">
        <Item title="chess">
          <img
            src="assets/images/chess-knight-2.png"
            alt="chess"
            slot="icon"
            height="60px"
            width="60px"
          />
        </Item>
      </div>
    {:else if title === "Desktop"}
      <div class="content-panel" />
    {:else}
      <div class="content-panel" />
    {/if}
  </div>
</Window>

<style lang="scss">
  @mixin transition-property {
    transition: opacity 0.3s, transform 0.3s;
  }
  .focused {
    background: #0000001f;
  }
  .no-display,
  .no-display * {
    display: none !important;
  }
  .no-visibility {
    @include transition-property;
    opacity: 0 !important;
    transform: scale(0);
    pointer-events: none;
  }
  .mr-40 {
    margin-right: 40px;
  }
  .btn {
    @include transition-property;
    display: flex;
    gap: 5px;
    height: 26px;
    align-items: center;
    justify-content: center;
    img {
      height: 16px;
      width: auto;
    }
    &.btn-view img:nth-child(2) {
      height: 13px;
      width: 7px;
    }
    &.btn-filter img:nth-child(2),
    &.btn-more img:nth-child(2) {
      height: 6px;
      width: 8px;
    }
  }
  .search-group {
    position: absolute;
    top: 12px;
    right: 13px;
    height: 100%;
    display: flex;
    .input-search {
      position: relative;
      padding: 0;
      margin-top: -1px;
      height: 100%;
      input {
        height: 26px;
        width: 150px;
        border: 1px solid #e1dfe1;
        background: transparent;
        border-radius: 5px;
        margin: 0;
        padding: 0 0 0 20px;
      }
    }
    .input-search::before {
      position: absolute;
      display: block;
      top: 7px;
      left: 5px;
      height: 12px;
      width: 12px;
      background: url("/assets/images/magnifyingglass@2x.png");
      background-size: cover;
      content: "";
    }
  }
  .btn-group {
    @include transition-property;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    &.btn-group-others {
      gap: 7px;
    }
    &.btn-group-view {
      border-radius: 5px;
      &:hover {
        background: rgb(234, 234, 234);
      }
      .vertical-sep {
        height: 18px;
        border-right: 1px solid #e1dfe1;
      }
    }
  }
  .sidebar {
    padding: 7px;
    ul {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 24px;
        border-radius: 5px;
        div {
          width: 24px;
          padding: 3px 3px 3px 10px;
          margin-right: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            max-height: 13px;
            max-width: 13px;
            width: auto;
            height: auto;
          }
        }
      }
      span {
        display: inline-block;
        flex-grow: 2;
        font-size: 12px;
      }
    }
  }
  .toolbar {
    display: flex;
    flex-direction: row;
    margin-top: 12px;
    padding-left: 10px;
    opacity: 0.7;
    overflow: hidden;
    h4 {
      margin-left: 8px;
      line-height: 160%;
      min-width: 215px;
      flex-grow: 1;
    }
    .btn-group-container {
      display: flex;
      flex-shrink: 1;
      .inflator-lg {
        width: 150px;
      }
      .inflator-sm {
        width: 40px;
      }
    }
    button {
      -webkit-appearance: none;
      appearance: none;
      padding: 3px 5px;
      text-align: center;
      background-color: transparent;
      border: none;
      border-radius: 5px;
      z-index: 1001;
      &:hover {
        background-color: rgb(209, 209, 209);
      }
      &:active {
        background-color: rgb(197, 197, 197);
      }
      &.focused {
        background-color: rgb(209, 209, 209);
      }
    }
    .btn-backwards,
    .btn-forwards {
      padding: 5px 10px;
    }
  }
  div[slot="content"] {
    display: flex;
  }
</style>
