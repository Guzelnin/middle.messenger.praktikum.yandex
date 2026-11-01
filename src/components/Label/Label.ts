import Block from '../Block/Block'

export default class Label extends Block {
  static componentName = 'Label'

  protected template = `<label for="{{forAttr}}" class="label">{{text}}</label>`
}
