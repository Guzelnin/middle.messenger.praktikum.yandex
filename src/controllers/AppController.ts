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
  editProfileFormFields,
  editPasswordFormFields,
} from '../constants'
import AppView from '../views/AppView'
import { validateField, type FormField } from '../utils/form-validation'
import { APIError } from '../api/HTTPTransport'
import {
  AuthAPI,
  ChatAPI,
  UserAPI,
  UserSearchAPI,
  type Chat,
  type User,
} from '../api/API'
import Router from '../utils/Router'

export default class AppController {
  private readonly view: AppView
  private readonly appElement: HTMLElement
  private selectedChatId: number | null = null
  private pendingChat: { login: string; chatId: number } | null = null
  private avatarFile: File | null = null

  private readonly formSelector = [
    'form#my-form',
    'form.profile-page__form',
    'form.message-form',
    'form[data-form="add-user"]',
    'form[data-form="delete-chat"]',
  ].join(', ')

  private handleFieldBlur = (event: FocusEvent) => {
    const field = event.target
    if (!(
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement ||
      field instanceof HTMLSelectElement
    ))
      return
    const form = field.form
    if (form?.matches(this.formSelector)) {
      validateField(field, form, form.dataset.authMode === 'sign-in')
    }
  }

  private handleFieldInput = (event: Event) => {
    const field = event.target
    if (
      !(field instanceof HTMLInputElement) ||
      !['first_name', 'second_name'].includes(field.name) ||
      (event instanceof InputEvent && event.isComposing)
    )
      return
    const firstCharacter = Array.from(field.value)[0]
    if (!firstCharacter) return
    const capitalizedCharacter = firstCharacter.toLocaleUpperCase()
    if (firstCharacter === capitalizedCharacter) return
    const selectionStart = field.selectionStart ?? field.value.length
    const selectionEnd = field.selectionEnd ?? field.value.length
    field.value =
      capitalizedCharacter + field.value.slice(firstCharacter.length)
    const cursorOffset = capitalizedCharacter.length - firstCharacter.length
    field.setSelectionRange(
      selectionStart + cursorOffset,
      selectionEnd + cursorOffset,
    )
  }

  private handleFormSubmit = async (event: SubmitEvent) => {
    const form = event.target
    if (!(form instanceof HTMLFormElement) || !form.matches(this.formSelector))
      return
    event.preventDefault()
    const fields = Array.from(
      form.querySelectorAll<FormField>(
        'input[name], textarea[name], select[name]',
      ),
    )
    const requiredOnly = form.dataset.authMode === 'sign-in'
    const valid = fields
      .map((field) => validateField(field, form, requiredOnly))
      .every(Boolean)
    if (!valid) {
      fields
        .find((field) => field.getAttribute('aria-invalid') === 'true')
        ?.focus()
      return
    }
    if (form.classList.contains('message-form')) return

    const values = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >
    try {
      if (form.dataset.form === 'add-user') {
        await this.addUser(values.login.trim())
      } else if (form.dataset.form === 'delete-chat') {
        const chatId = Number(form.dataset.chatId)
        await ChatAPI.delete(chatId)
        this.selectedChatId = null
        this.closeChatModal('delete-chat')
        await this.render(CHATS_PAGE_PATH)
      } else if (location.pathname === SIGN_IN_PAGE_PATH) {
        await AuthAPI.signIn(values)
        Router.getInstance().setAuthenticated(true)
        Router.getInstance().go(CHATS_PAGE_PATH)
      } else if (location.pathname === SIGN_UP_PAGE_PATH) {
        if (values.password !== values.password_check)
          throw new Error('Пароли не совпадают')
        const credentials = { login: values.login, password: values.password }
        delete values.password_check
        await AuthAPI.signUp(values)
        try {
          await AuthAPI.current()
        } catch (error) {
          if (!(error instanceof APIError) || error.status !== 401) throw error
          await AuthAPI.signIn(credentials)
        }
        Router.getInstance().setAuthenticated(true)
        Router.getInstance().go(CHATS_PAGE_PATH)
      } else if (form.dataset.form === 'profile') {
        await UserAPI.update(values)
        Router.getInstance().go(PROFILE_PAGE_PATH)
      } else if (form.dataset.form === 'password') {
        if (values.newPassword !== values.newPasswordCheck)
          throw new Error('Пароли не совпадают')
        await UserAPI.updatePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        })
        Router.getInstance().go(PROFILE_PAGE_PATH)
      }
    } catch (error) {
      if (
        form.dataset.form === 'add-user' ||
        form.dataset.form === 'delete-chat'
      ) {
        this.showModalError(
          form,
          error instanceof Error
            ? error.message
            : 'Не удалось выполнить запрос',
        )
      } else {
        this.showFormError(
          form,
          error instanceof Error
            ? error.message
            : 'Не удалось выполнить запрос',
        )
      }
    }
  }

  private handleClick = async (event: MouseEvent) => {
    const target = event.target
    if (!(target instanceof Element)) return
    for (const kind of ['add-user', 'delete-chat'] as const) {
      const modal = this.appElement.querySelector<HTMLElement>(
        `[data-${kind}-modal]`,
      )
      if (modal && target === modal) {
        this.closeChatModal(kind)
        return
      }
    }
    const avatarModal = this.appElement.querySelector<HTMLElement>(
      '[data-avatar-modal]',
    )
    if (avatarModal && target === avatarModal) {
      this.closeAvatarModal()
      return
    }
    const actionElement = target.closest<HTMLElement>('[data-action]')
    if (!actionElement) return
    const action = actionElement.dataset.action
    try {
      if (action === 'logout') {
        await AuthAPI.logout()
        Router.getInstance().setAuthenticated(false)
        Router.getInstance().go(SIGN_IN_PAGE_PATH)
      } else if (action === 'open-chat') {
        this.selectedChatId = Number(actionElement.dataset.chatId)
        await this.render(CHATS_PAGE_PATH)
      } else if (action === 'open-add-user') {
        this.openChatModal('add-user')
      } else if (action === 'close-add-user') {
        this.closeChatModal('add-user')
      } else if (action === 'close-delete-chat') {
        this.closeChatModal('delete-chat')
      } else if (action === 'toggle-chat-menu') {
        const menu =
          actionElement.parentElement?.querySelector<HTMLElement>(
            '[data-chat-menu]',
          )
        const expanded = actionElement.getAttribute('aria-expanded') === 'true'
        if (menu) menu.hidden = expanded
        actionElement.setAttribute('aria-expanded', String(!expanded))
      } else if (action === 'open-delete-chat') {
        const chatId = Number(actionElement.dataset.chatId)
        this.openChatModal('delete-chat')
        const form = this.appElement.querySelector<HTMLFormElement>(
          '[data-form="delete-chat"]',
        )
        if (form) form.dataset.chatId = String(chatId)
      } else if (action === 'open-avatar-modal') {
        this.appElement
          .querySelector<HTMLElement>('[data-avatar-modal]')
          ?.removeAttribute('hidden')
      } else if (action === 'close-avatar-modal') {
        this.closeAvatarModal()
      } else if (action === 'upload-avatar') {
        await this.uploadAvatar()
      }
    } catch (error) {
      window.alert(
        error instanceof APIError
          ? error.message
          : 'Не удалось выполнить запрос',
      )
    }
  }

  private handleChange = (event: Event) => {
    const input = event.target
    if (
      !(input instanceof HTMLInputElement) ||
      input.dataset.action !== 'avatar-file'
    )
      return
    const file = input.files?.[0]
    if (!file) return
    this.avatarFile = file
    const filename = this.appElement.querySelector<HTMLElement>(
      '[data-avatar-filename]',
    )
    if (filename) filename.textContent = file.name
    const submit = this.appElement.querySelector<HTMLButtonElement>(
      '[data-action="upload-avatar"]',
    )
    if (submit) submit.disabled = false
    const error = this.appElement.querySelector<HTMLElement>(
      '[data-avatar-error]',
    )
    if (error) {
      error.textContent = ''
      error.hidden = true
    }
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (
      (event.key === 'Enter' || event.key === ' ') &&
      event.target instanceof HTMLElement &&
      event.target.matches('[data-action="open-chat"]')
    ) {
      event.preventDefault()
      event.target.click()
    }
    if (event.key !== 'Escape') return
    if (this.appElement.querySelector('[data-avatar-modal]:not([hidden])'))
      this.closeAvatarModal()
    if (this.appElement.querySelector('[data-add-user-modal]:not([hidden])'))
      this.closeChatModal('add-user')
    if (this.appElement.querySelector('[data-delete-chat-modal]:not([hidden])'))
      this.closeChatModal('delete-chat')
  }

  constructor() {
    const element = document.getElementById('app')
    if (!element) throw Error('app not found')
    this.appElement = element
    this.view = new AppView(element)
    element.addEventListener('blur', this.handleFieldBlur, true)
    element.addEventListener('input', this.handleFieldInput)
    element.addEventListener('submit', this.handleFormSubmit)
    element.addEventListener('click', this.handleClick)
    element.addEventListener('change', this.handleChange)
    element.addEventListener('keydown', this.handleKeydown)
  }

  async render(path = location.pathname): Promise<void> {
    try {
      const isSignInPage = path === SIGN_IN_PAGE_PATH
      const isSignUpPage = path === SIGN_UP_PAGE_PATH
      if (isSignInPage || isSignUpPage) {
        this.view.render('auth', {
          formTitle: isSignInPage ? 'Вход' : 'Регистрация',
          formFields: isSignInPage ? signInFormFields : signUnFormFields,
          submitButtonLabel: isSignInPage
            ? 'Авторизоваться'
            : 'Зарегистрироваться',
          redirectButtonLabel: isSignInPage ? 'Нет аккаунта?' : 'Войти',
          redirectPath: isSignInPage ? SIGN_UP_PAGE_PATH : SIGN_IN_PAGE_PATH,
          authMode: isSignInPage ? 'sign-in' : 'sign-up',
        })
      } else if (path === PROFILE_PAGE_PATH) {
        this.view.render('profile', {
          user: this.profileView(await AuthAPI.current()),
        })
      } else if (path === EDIT_PROFILE_PAGE_PATH) {
        const user = await AuthAPI.current()
        this.view.render('editProfile', {
          formFields: editProfileFormFields({
            email: user.email,
            login: user.login,
            firstName: user.first_name,
            lastName: user.second_name,
            phone: user.phone,
          }),
        })
      } else if (path === EDIT_PASSWORD_PAGE_PATH) {
        this.view.render('editPassword', { formFields: editPasswordFormFields })
      } else if (path === CHATS_PAGE_PATH) {
        const chats = await ChatAPI.list()
        if (
          this.selectedChatId !== null &&
          !chats.some((chat) => chat.id === this.selectedChatId)
        )
          this.selectedChatId = null
        const activeChat = chats.find((chat) => chat.id === this.selectedChatId)
        this.view.render('chats', {
          chats: chats.map((chat) => this.chatView(chat)),
          activeChat: activeChat ? this.chatView(activeChat) : null,
          messages: [],
        })
      } else if (path === SERVER_ERROR_PAGE_PATH) {
        this.view.render('serverError')
      } else {
        this.view.render('notFound')
      }
      this.appElement
        .querySelectorAll<HTMLFormElement>(this.formSelector)
        .forEach((form) => {
          form.noValidate = true
        })
    } catch (error) {
      if (path !== SERVER_ERROR_PAGE_PATH) this.view.render('serverError')
      else throw error
    }
  }

  private profileView(user: User) {
    const displayName =
      user.display_name || `${user.first_name} ${user.second_name}`
    return {
      name: displayName,
      initials: `${user.first_name?.[0] ?? ''}${user.second_name?.[0] ?? ''}`,
      email: user.email,
      login: user.login,
      firstName: user.first_name,
      lastName: user.second_name,
      phone: user.phone,
      avatarUrl: user.avatar
        ? `https://ya-praktikum.tech/api/v2/resources${user.avatar}`
        : '',
    }
  }

  private chatView(chat: Chat) {
    return {
      id: chat.id,
      title: chat.title,
      avatarInitials: chat.title.slice(0, 1).toUpperCase(),
      isActive: chat.id === this.selectedChatId,
      last_message: chat.last_message ?? { time: '', content: 'Нет сообщений' },
    }
  }

  private async addUser(login: string) {
    const users = await UserSearchAPI.byLogin(login)
    const user = users.find(
      (item) => item.login.toLocaleLowerCase() === login.toLocaleLowerCase(),
    )
    if (!user) throw new Error('Пользователь с таким логином не найден')
    if (!this.pendingChat || this.pendingChat.login !== login) {
      const title =
        user.display_name ||
        `${user.first_name} ${user.second_name}` ||
        user.login
      const chat = await ChatAPI.create(title)
      this.pendingChat = { login, chatId: chat.id }
    }
    await ChatAPI.addUsers(this.pendingChat.chatId, [user.id])
    this.selectedChatId = this.pendingChat.chatId
    this.pendingChat = null
    this.closeChatModal('add-user')
    await this.render(CHATS_PAGE_PATH)
  }

  private showFormError(form: HTMLFormElement, message: string) {
    let error = form.querySelector<HTMLElement>('[data-error]')
    if (!error) {
      error = document.createElement('p')
      error.dataset.error = 'true'
      error.className = 'form-error'
      error.setAttribute('role', 'alert')
      form.append(error)
    }
    error.textContent = message
  }

  private showModalError(form: HTMLFormElement, message: string) {
    const error = form.querySelector<HTMLElement>('[data-modal-error]')
    if (error) {
      error.textContent = message
      error.hidden = false
    }
  }

  private openChatModal(kind: 'add-user' | 'delete-chat') {
    const modal = this.appElement.querySelector<HTMLElement>(
      `[data-${kind}-modal]`,
    )
    if (!modal) return
    modal.hidden = false
    const form = modal.querySelector<HTMLFormElement>('form')
    const error = form?.querySelector<HTMLElement>('[data-modal-error]')
    if (error) {
      error.textContent = ''
      error.hidden = true
    }
    if (kind === 'add-user')
      form?.querySelector<HTMLInputElement>('input[name="login"]')?.focus()
  }

  private closeChatModal(kind: 'add-user' | 'delete-chat') {
    const modal = this.appElement.querySelector<HTMLElement>(
      `[data-${kind}-modal]`,
    )
    if (modal) modal.hidden = true
    const form = modal?.querySelector<HTMLFormElement>('form')
    form?.reset()
    const error = form?.querySelector<HTMLElement>('[data-modal-error]')
    if (error) {
      error.textContent = ''
      error.hidden = true
    }
    if (kind === 'delete-chat' && form) delete form.dataset.chatId
  }

  private closeAvatarModal() {
    this.appElement
      .querySelector<HTMLElement>('[data-avatar-modal]')
      ?.setAttribute('hidden', '')
    this.resetAvatarSelection()
  }

  private resetAvatarSelection() {
    this.avatarFile = null
    const input = this.appElement.querySelector<HTMLInputElement>(
      '[data-action="avatar-file"]',
    )
    if (input) input.value = ''
    const filename = this.appElement.querySelector<HTMLElement>(
      '[data-avatar-filename]',
    )
    if (filename) filename.textContent = 'Выбрать файл на компьютере'
    const submit = this.appElement.querySelector<HTMLButtonElement>(
      '[data-action="upload-avatar"]',
    )
    if (submit) submit.disabled = true
    const error = this.appElement.querySelector<HTMLElement>(
      '[data-avatar-error]',
    )
    if (error) {
      error.textContent = ''
      error.hidden = true
    }
  }

  private async uploadAvatar() {
    if (!this.avatarFile) return
    const body = new FormData()
    body.append('avatar', this.avatarFile)
    const error = this.appElement.querySelector<HTMLElement>(
      '[data-avatar-error]',
    )
    try {
      await UserAPI.updateAvatar(body)
      this.avatarFile = null
      await this.render(PROFILE_PAGE_PATH)
    } catch (reason) {
      this.resetAvatarSelection()
      if (error) {
        error.textContent =
          reason instanceof Error ? reason.message : 'Не удалось загрузить файл'
        error.hidden = false
      }
    }
  }
}
