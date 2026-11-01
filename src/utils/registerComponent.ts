import Handlebars from 'handlebars'
import { type HelperOptions } from 'handlebars'

type ComponentToRegister<Props = unknown> = {
  componentName: string
  new (props: Props): {
    element(): Element | null
  }
}

function registerComponent<Props>(Component: ComponentToRegister<Props>) {
  Handlebars.registerHelper(
    Component.componentName,
    function (this: unknown, { hash, data }: HelperOptions) {
      const component = new Component(hash as Props)
      const element = component.element()

      if (!element) {
        throw new Error(
          `Component ${Component.componentName} did not render an element`,
        )
      }

      if ('ref' in hash) {
        ;(data.root.__refs = data.root.__refs || {})[hash.ref] = element
      }

      return new Handlebars.SafeString(element.outerHTML)
    },
  )
}

export { registerComponent }
