import Handlebars from 'handlebars'
import AuthPage from '../pages/AuthPage/AuthPage.hbs?raw'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage.hbs?raw'
import ServerErrorPage from '../pages/ServerErrorPage/ServerErrorPage.hbs?raw'
import ChatsPage from '../pages/ChatsPage/ChatsPage.hbs?raw'
import ProfilePage from '../pages/ProfilePage/ProfilePage.hbs?raw'
import EditProfilePage from '../pages/EditProfilePage/EditProfilePage.hbs?raw'
import EditPasswordPage from '../pages/EditPasswordPage/EditPasswordPage.hbs?raw'
import { registerComponent } from '../utils'

import Input from '../components/Input/Input'
import Label from '../components/Label/Label'
import Divider from '../components/Divider/Divider'
import ChatSearch from '../components/ChatSearch/ChatSearch'
import ChatPreview from '../components/ChatPreview/ChatPreview'
import ChatHeader from '../components/ChatHeader/ChatHeader'
import MessageForm from '../components/MessageForm/MessageForm'
import Message from '../components/Message/Message'

registerComponent(Input)
registerComponent(Label)
registerComponent(Divider)
registerComponent(ChatSearch)
registerComponent(ChatPreview)
registerComponent(ChatHeader)
registerComponent(MessageForm)
registerComponent(Message)

type PageName =
  | 'auth'
  | 'chats'
  | 'profile'
  | 'editProfile'
  | 'editPassword'
  | 'serverError'
  | 'notFound'

const pageTemplates: Record<PageName, string> = {
  auth: AuthPage,
  chats: ChatsPage,
  profile: ProfilePage,
  editProfile: EditProfilePage,
  editPassword: EditPasswordPage,
  serverError: ServerErrorPage,
  notFound: NotFoundPage,
}

export default class AppView {
  private readonly appElement: HTMLElement

  constructor(appElement: HTMLElement) {
    this.appElement = appElement
  }

  render(page: PageName, context: Record<string, unknown> = {}): void {
    const template = Handlebars.compile(pageTemplates[page])
    const html = template(context)
    const fragment = document.createRange().createContextualFragment(html)
    this.appElement.replaceChildren(fragment)
  }
}
