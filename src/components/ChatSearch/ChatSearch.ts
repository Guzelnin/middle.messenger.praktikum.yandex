import magnifyingGlassIcon from '../../assets/icons/magnifying-glass.svg'

import Block from '../Block/Block'

export default class ChatSearch extends Block {
  static componentName = 'ChatSearch'

  protected template = `
    <form class="chat-search">
    <label class="chat-search__field">
      <img class="chat-search__icon" src="${magnifyingGlassIcon}" alt="Поиск" />
      <input class="chat-search__input" type="search" name="search" placeholder="Поиск" autocomplete="off" />
    </label>
  </form>
  `
}
