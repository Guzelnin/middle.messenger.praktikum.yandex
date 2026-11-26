import Block, { type BlockOwnProps } from '../Block/Block'

interface ChatPreviewProps extends BlockOwnProps {
  chat: {
    id: number
    title: string
    avatarInitials: string
    isActive: boolean
    last_message: { time: string; content: string }
  }
}

export default class ChatPreview extends Block<ChatPreviewProps> {
  static componentName = 'ChatPreview'

  protected template = `
    <li class="chat-preview {{#if chat.isActive}}chat-preview--active{{/if}}" data-action="open-chat" data-chat-id="{{chat.id}}" role="button" tabindex="0" aria-label="Открыть чат {{chat.title}}">
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
