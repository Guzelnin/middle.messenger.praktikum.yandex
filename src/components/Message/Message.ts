import Block, { type BlockOwnProps } from '../Block/Block'

interface MessageProps extends BlockOwnProps {
  message: {
    isOwn: boolean
    content: string
    time: string
  }
}

export default class Message extends Block<MessageProps> {
  static componentName = 'Message'

  protected template = `<div class="message {{#if message.isOwn}}message--own{{/if}}">
    <p class="message__text">{{message.content}}</p>
    <time class="message__time">{{message.time}}</time>
  </div>`
}
