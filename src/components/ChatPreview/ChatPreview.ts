import Block, { type BlockOwnProps } from '../Block/Block'

interface ChatPreviewProps extends BlockOwnProps {
  chat: {
    avatarInitials: string
    title: string
    last_message: {
      time: string
      content: string
    }
  }
}

export default class ChatPreview extends Block<ChatPreviewProps> {
  static componentName = 'ChatPreview'

  protected template = `
    <li class="chat-preview">
    <span class="chat-preview__avatar" aria-hidden="true">{{chat.avatarInitials}}</span>
    <div class="chat-preview__content">
      <div class="chat-preview__header">
        <span class="chat-preview__name">{{chat.title}}</span>
        <span class="chat-preview__time">{{chat.last_message.time}}</span>
      </div>
      <div class="chat-preview__footer">
        <p class="chat-preview__message">{{chat.last_message.content}}</p>
      </div>
    </div>
  </li>
  `
}
