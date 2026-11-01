import Block, { type BlockOwnProps } from '../Block/Block'

type DividerProps = BlockOwnProps

export default class Divider extends Block<DividerProps> {
  static componentName = 'Divider'

  protected template = `<hr class="divider">`
}
