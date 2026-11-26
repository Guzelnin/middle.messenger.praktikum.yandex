import './styles/index.pcss'
import AppController from './controllers/AppController'
import Router from './utils/Router'
import { AuthAPI } from './api/API'
import {
  SIGN_IN_PAGE_PATH,
  SIGN_UP_PAGE_PATH,
  CHATS_PAGE_PATH,
  PROFILE_PAGE_PATH,
  EDIT_PROFILE_PAGE_PATH,
  EDIT_PASSWORD_PAGE_PATH,
  NOT_FOUND_PAGE_PATH,
  SERVER_ERROR_PAGE_PATH,
} from './constants'

document.addEventListener('DOMContentLoaded', () => {
  const app = new AppController()
  const router = Router.getInstance()
  const render = (path: string) => {
    void app.render(path)
  }

  router
    .use(SIGN_IN_PAGE_PATH, () => render(SIGN_IN_PAGE_PATH))
    .use(SIGN_UP_PAGE_PATH, () => render(SIGN_UP_PAGE_PATH))
    .use(CHATS_PAGE_PATH, () => render(CHATS_PAGE_PATH))
    .use(PROFILE_PAGE_PATH, () => render(PROFILE_PAGE_PATH))
    .use(EDIT_PROFILE_PAGE_PATH, () => render(EDIT_PROFILE_PAGE_PATH))
    .use(EDIT_PASSWORD_PAGE_PATH, () => render(EDIT_PASSWORD_PAGE_PATH))
    .use(NOT_FOUND_PAGE_PATH, () => render(NOT_FOUND_PAGE_PATH))
    .use(SERVER_ERROR_PAGE_PATH, () => render(SERVER_ERROR_PAGE_PATH))

  void AuthAPI.current()
    .then(() => router.setAuthenticated(true))
    .catch(() => router.setAuthenticated(false))
    .finally(() => router.start())
})
