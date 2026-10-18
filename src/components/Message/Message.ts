export default `
  <div class="message {{#if isOwn}}message--own{{/if}}">
    <p class="message__text">{{content}}</p>
    <time class="message__time">{{time}}</time>
  </div>
`
