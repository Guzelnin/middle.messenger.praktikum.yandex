import Block from '../Block/Block'

export default class Input extends Block {
  static componentName = 'Input'

  protected template = `<input id="{{id}}" name="{{name}}" type="{{type}}" placeholder="{{placeholder}}" value="{{value}}" autocomplete="{{autocomplete}}" class="input" {{#if required}}required{{/if}}>`
}
