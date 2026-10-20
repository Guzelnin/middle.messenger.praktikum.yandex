import paperClipIcon from '../../assets/icons/paper-clip.svg'
import sendIcon from '../../assets/icons/send.svg'

export default `
  <form class="message-form">
    <button class="message-form__attach-button" type="button" aria-label="Прикрепить файл">
      <img src="${paperClipIcon}" alt="Прикрепить файл" />
    </button>
    <textarea class="message-form__textarea" name="message" rows="2"></textarea>
    <button class="message-form__send" type="submit" aria-label="Отправить сообщение">
      <img src="${sendIcon}" alt="Отправить сообщение" />
    </button>
  </form>
`
