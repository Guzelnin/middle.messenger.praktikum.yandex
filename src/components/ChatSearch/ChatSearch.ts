import magnifyingGlassIcon from '../../assets/icons/magnifying-glass.svg'

import Block, { type BlockOwnProps } from '../Block/Block'

type ChatSearchProps = BlockOwnProps

export default class ChatSearch extends Block<ChatSearchProps> {
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
