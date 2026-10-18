export default `
  <li class="chat-preview">
    <img class="chat-preview__avatar" src="{{avatar}}" />
    <div class="chat-preview__content">
      <div class="chat-preview__header">
        <span class="chat-preview__name">{{title}}</span>
        <span class="chat-preview__time">{{last_message.time}}</span>
      </div>
      <div class="chat-preview__footer">
        <p class="chat-preview__message">{{last_message.content}}</p>
      </div>
    </div>
  </li>
`
