<div>
    <ul>
        <slot/>
    </ul>
</div>

<style lang="sass">
  :global(ul)
    list-style: none

  :global(li)
    display: inline-block
    padding: 5px 10px

  :global(a)
    color: black
    text-decoration: none
</style>