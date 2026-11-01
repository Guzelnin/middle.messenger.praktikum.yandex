import Block, { type BlockOwnProps } from '../Block/Block'

interface InputProps extends BlockOwnProps {
  id?: string
  name: string
  type: string
  placeholder?: string
  value?: string
  autocomplete?: string
  required?: boolean
}

export default class Input extends Block<InputProps> {
  static componentName = 'Input'

  protected template = `<input id="{{id}}" name="{{name}}" type="{{type}}" placeholder="{{placeholder}}" value="{{value}}" autocomplete="{{autocomplete}}" class="input" {{#if required}}required{{/if}}>`
}
