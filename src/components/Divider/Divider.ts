import Block from '../Block/Block'

export default class Divider extends Block {
  static componentName = 'Divider'

  protected template = `<hr class="divider">`
}
