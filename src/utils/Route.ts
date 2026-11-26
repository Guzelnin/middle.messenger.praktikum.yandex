export type RouteHandler = () => void

export default class Route {
  private readonly pathname: string
  private readonly handler: RouteHandler

  constructor(pathname: string, handler: RouteHandler) {
    this.pathname = pathname
    this.handler = handler
  }

  match(pathname: string) {
    return pathname === this.pathname
  }

  render() {
    this.handler()
  }
}
