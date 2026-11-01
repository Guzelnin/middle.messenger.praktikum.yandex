import Block from '../Block/Block'

export default class Message extends Block {
  static componentName = 'Message'

  protected template = `<div class="message {{#if message.isOwn}}message--own{{/if}}">
    <p class="message__text">{{message.content}}</p>
    <time class="message__time">{{message.time}}</time>
  </div>`
}
