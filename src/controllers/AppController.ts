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
import AppModel from '../models/AppModel'
import AppView from '../views/AppView'
import {
  collectFormValues,
  validateField,
  type FormField,
} from '../utils/form-validation'

export default class AppController {
  private readonly model = new AppModel()
  private readonly view: AppView
  private readonly appElement: HTMLElement

  private readonly formSelector =
    'form#my-form, form.profile-page__form, form.message-form'

  private handleFieldBlur = (event: FocusEvent) => {
    const field = event.target
    if (!(
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement ||
      field instanceof HTMLSelectElement
    )) {
      return
    }

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
    ) {
      return
    }

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

  private handleFormSubmit = (event: SubmitEvent) => {
    const form = event.target
    if (
      !(form instanceof HTMLFormElement) ||
      !form.matches(this.formSelector)
    ) {
      return
    }

    event.preventDefault()
    const fields = Array.from(
      form.querySelectorAll<FormField>(
        'input[name], textarea[name], select[name]',
      ),
    )
    const requiredOnly = form.dataset.authMode === 'sign-in'
    const isValid = fields
      .map((field) => validateField(field, form, requiredOnly))
      .every(Boolean)

    if (!isValid) {
      fields
        .find((field) => field.getAttribute('aria-invalid') === 'true')
        ?.focus()
      return
    }

    console.log(collectFormValues(form))
  }

  constructor() {
    const element = document.getElementById('app')
    if (!element) throw Error('app not found')

    this.appElement = element
    this.view = new AppView(element)

    element.addEventListener('blur', this.handleFieldBlur, true)
    element.addEventListener('input', this.handleFieldInput)
    element.addEventListener('submit', this.handleFormSubmit)
  }

  render(): void {
    const path = location.pathname
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
        authMode: isSignInPage ? 'sign-in' : 'sign-up',
      })
    } else if (path === PROFILE_PAGE_PATH) {
      this.view.render('profile', { user: this.model.getUser() })
    } else if (path === EDIT_PROFILE_PAGE_PATH) {
      this.view.render('editProfile', {
        formFields: editProfileFormFields(this.model.getUser()),
      })
    } else if (path === EDIT_PASSWORD_PAGE_PATH) {
      this.view.render('editPassword', {
        formFields: editPasswordFormFields,
      })
    } else if (path === CHATS_PAGE_PATH) {
      const chats = this.model.getChats()
      this.view.render('chats', {
        chats,
        activeChat: chats[0],
        messages: this.model.getMessages(),
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
  }
}
