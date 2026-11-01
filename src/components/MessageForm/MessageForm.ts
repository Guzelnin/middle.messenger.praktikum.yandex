import paperClipIcon from '../../assets/icons/paper-clip.svg'
import sendIcon from '../../assets/icons/send.svg'

import Block, { type BlockOwnProps } from '../Block/Block'

type MessageFormProps = BlockOwnProps

export default class MessageForm extends Block<MessageFormProps> {
  static componentName = 'MessageForm'

  protected template = `<form class="message-form">
    <button class="message-form__attach-button" type="button" aria-label="Прикрепить файл">
      <img src="${paperClipIcon}" alt="Прикрепить файл" />
    </button>
    <label class="message-form__field">
      <textarea class="message-form__textarea" name="message" rows="2" required></textarea>
    </label>
    <button class="message-form__send" type="submit" aria-label="Отправить сообщение">
      <img src="${sendIcon}" alt="Отправить сообщение" />
    </button>
  </form>`
}
