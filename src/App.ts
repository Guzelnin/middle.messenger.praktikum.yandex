import Handlebars from 'handlebars'
import AuthPage from './pages/AuthPage/AuthPage.hbs?raw'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.hbs?raw'
import ServerErrorPage from './pages/ServerErrorPage/ServerErrorPage.hbs?raw'
import ChatsPage from './pages/ChatsPage/ChatsPage.hbs?raw'
import ProfilePage from './pages/ProfilePage/ProfilePage.hbs?raw'
import EditProfilePage from './pages/EditProfilePage/EditProfilePage.hbs?raw'
import EditPasswordPage from './pages/EditPasswordPage/EditPasswordPage.hbs?raw'

import {
  SIGN_IN_PAGE_PATH,
  SIGN_UP_PAGE_PATH,
  CHATS_PAGE_PATH,
  PROFILE_PAGE_PATH,
  EDIT_PROFILE_PAGE_PATH,
  EDIT_PASSWORD_PAGE_PATH,
  SERVER_ERROR_PAGE_PATH,
  signInFormFields,
  signUnFormFields,
} from './constants'

import Input from './components/Input/Input'
import Label from './components/Label/Label'
import Divider from './components/Divider/Divider'
import ChatSearch from './components/ChatSearch/ChatSearch'
import ChatPreview from './components/ChatPreview/ChatPreview'
import ChatHeader from './components/ChatHeader/ChatHeader'
import MessageForm from './components/MessageForm/MessageForm'
import Message from './components/Message/Message'

Handlebars.registerPartial('Input', Input)
Handlebars.registerPartial('Label', Label)
Handlebars.registerPartial('Divider', Divider)
Handlebars.registerPartial('ChatSearch', ChatSearch)
Handlebars.registerPartial('ChatPreview', ChatPreview)
Handlebars.registerPartial('ChatHeader', ChatHeader)
Handlebars.registerPartial('MessageForm', MessageForm)
Handlebars.registerPartial('Message', Message)

interface AppState {
  appElement: HTMLElement | null
}

export default class App {
  private state: AppState

  constructor() {
    const el = document.getElementById('app')
    if (!el) throw Error('app not found')

    this.state = {
      appElement: el,
    }
  }

  private renderTemplate(
    templateSource: string,
    context: Record<string, unknown> = {},
  ) {
    const template = Handlebars.compile(templateSource)
    const html = template(context)
    const fragment = document.createRange().createContextualFragment(html)
    this.state.appElement?.replaceChildren(fragment)
  }

  render() {
    const path = location.pathname
    const isSignInPage = path === SIGN_IN_PAGE_PATH
    const isSignUpPage = path === SIGN_UP_PAGE_PATH

    if (isSignInPage || isSignUpPage) {
      this.renderTemplate(AuthPage, {
        path,
        formTitle: isSignInPage ? 'Вход' : 'Регистрация',
        formFields: isSignInPage ? signInFormFields : signUnFormFields,
        submitButtonLabel: isSignInPage
          ? 'Авторизоваться'
          : 'Зарегистрироваться',
        redirectButtonLabel: isSignInPage ? 'Нет аккаунта?' : 'Войти',
      })
    } else if (
      path === PROFILE_PAGE_PATH ||
      path === EDIT_PROFILE_PAGE_PATH ||
      path === EDIT_PASSWORD_PAGE_PATH
    ) {
      const pageTemplate =
        path === EDIT_PROFILE_PAGE_PATH
          ? EditProfilePage
          : path === EDIT_PASSWORD_PAGE_PATH
            ? EditPasswordPage
            : ProfilePage
      this.renderTemplate(pageTemplate, {
        user: {
          name: 'Guzel',
          initials: 'GM',
          email: 'guzel@example.com',
          login: 'guzel',
          firstName: 'Guzel',
          lastName: 'M',
          phone: '+7 900 000-00-00',
        },
      })
    } else if (path === CHATS_PAGE_PATH) {
      const mockChat = {
        title: 'Sasha',
        avatarInitials: 'S',
        last_message: {
          time: '12:45',
          content: 'Привет',
        },
      }

      this.renderTemplate(ChatsPage, {
        chats: [mockChat],
        activeChat: mockChat,
        messages: [
          { content: 'Привет', isOwn: true, time: '12:20' },
          { content: 'Привет', isOwn: false, time: '12:45' },
        ],
      })
    } else if (path === SERVER_ERROR_PAGE_PATH) {
      this.renderTemplate(ServerErrorPage)
    } else {
      this.renderTemplate(NotFoundPage)
    }
  }
}
