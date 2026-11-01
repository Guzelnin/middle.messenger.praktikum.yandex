import Block, { type BlockOwnProps } from '../Block/Block'

interface LabelProps extends BlockOwnProps {
  forAttr: string
  text: string
}

export default class Label extends Block<LabelProps> {
  static componentName = 'Label'

  protected template = `<label for="{{forAttr}}" class="label">{{text}}</label>`
}
