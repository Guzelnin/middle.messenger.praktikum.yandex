import Route, { type RouteHandler } from './Route'

export default class Router {
  private static instance: Router
  private routes: Route[] = []
  private started = false
  private authenticated = false
  private publicPaths = new Set(['/', '/sign-up'])

  static getInstance() {
    if (!Router.instance) Router.instance = new Router()
    return Router.instance
  }

  use(pathname: string, handler: RouteHandler) {
    this.routes.push(new Route(pathname, handler))
    return this
  }

  start() {
    if (this.started) return
    this.started = true
    window.addEventListener('popstate', () => this.onRoute(location.pathname))
    document.addEventListener('click', this.handleLinkClick)
    this.onRoute(location.pathname)
  }

  go(pathname: string) {
    if (pathname === location.pathname) return
    history.pushState({}, '', pathname)
    this.onRoute(pathname)
  }

  setAuthenticated(value: boolean) {
    this.authenticated = value
  }

  private handleLinkClick = (event: MouseEvent) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    const target = event.target
    if (!(target instanceof Element)) return
    const link = target.closest('a[href]')
    if (
      !(link instanceof HTMLAnchorElement) ||
      link.target ||
      link.origin !== location.origin
    )
      return
    event.preventDefault()
    this.go(link.pathname)
  }

  private onRoute(pathname: string) {
    if (this.authenticated && this.publicPaths.has(pathname)) {
      history.replaceState({}, '', '/messenger')
      pathname = '/messenger'
    }
    if (!this.authenticated && !this.publicPaths.has(pathname)) {
      if (location.pathname !== '/') history.replaceState({}, '', '/')
      pathname = '/'
    }
    const route =
      this.routes.find((item) => item.match(pathname)) ??
      this.routes.find((item) => item.match('/404'))
    route?.render()
  }
}
