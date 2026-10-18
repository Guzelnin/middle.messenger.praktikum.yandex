import magnifyingGlassIcon from '../../assets/icons/magnifying-glass.svg'

export default `
  <form class="chat-search">
    <label class="chat-search__field">
      <img class="chat-search__icon" src="${magnifyingGlassIcon}" alt="" />
      <input class="chat-search__input" type="search" name="search" placeholder="Поиск" autocomplete="off" />
    </label>
  </form>
`
