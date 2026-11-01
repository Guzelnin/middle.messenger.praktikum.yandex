import Block from '../Block/Block'

export default class ChatPreview extends Block {
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
