import Block, { type BlockOwnProps } from '../Block/Block'

interface ChatHeaderProps extends BlockOwnProps {
  title: string
  avatarInitials: string
  id: number
}

export default class ChatHeader extends Block<ChatHeaderProps> {
  static componentName = 'ChatHeader'

  protected template = `
    <header class="chat__header">
    <div class="chat__user">
      <div class="chat__avatar" aria-hidden="true">{{avatarInitials}}</div>
      <div class="chat__user-info">
        <h2 class="chat__name">{{title}}</h2>
      </div>
    </div>
    <div class="chat__menu-wrap">
      <button class="chat__menu-button" type="button" aria-label="Открыть меню" data-action="toggle-chat-menu" aria-expanded="false">⋮</button>
      <div class="chat__menu" data-chat-menu hidden>
        <button type="button" data-action="open-delete-chat" data-chat-id="{{id}}">Удалить чат</button>
      </div>
    </div>
  </header>
  `
}
