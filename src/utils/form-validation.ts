type FormField = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

let errorId = 0

const fieldRules: Record<string, { pattern: RegExp; message: string }> = {
  first_name: {
    pattern: /^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё-]*$/u,
    message: 'Начните с заглавной буквы; используйте только буквы и дефис',
  },
  second_name: {
    pattern: /^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё-]*$/u,
    message: 'Начните с заглавной буквы; используйте только буквы и дефис',
  },
  login: {
    pattern: /^(?=.*[A-Za-z])[A-Za-z0-9_-]{3,20}$/,
    message:
      'Логин: 3–20 символов, латинские буквы, цифры, дефис или подчёркивание',
  },
  email: {
    pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z]+\.[A-Za-z0-9.-]+$/,
    message: 'Введите корректный email с буквами между @ и точкой',
  },
  password: {
    pattern: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    message: 'Пароль: 8–40 символов, минимум одна заглавная буква и цифра',
  },
  'old-password': {
    pattern: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    message: 'Пароль: 8–40 символов, минимум одна заглавная буква и цифра',
  },
  phone: {
    pattern: /^\+?\d{10,15}$/,
    message: 'Введите от 10 до 15 цифр; в начале можно поставить +',
  },
}

function validateField(
  field: FormField,
  form: HTMLFormElement,
  requiredOnly = false,
): boolean {
  const name = field.name
  const value = field.value
  const trimmedValue = value.trim()
  const isEmpty =
    field instanceof HTMLInputElement && field.type === 'checkbox'
      ? !field.checked
      : field instanceof HTMLInputElement && field.type === 'radio'
        ? !Array.from(
            form.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
          ).some((radio) => radio.name === name && radio.checked)
        : field instanceof HTMLInputElement && field.type === 'file'
          ? !field.files?.length
          : !trimmedValue
  let error = ''

  if (requiredOnly) {
    if (isEmpty && field.required) error = 'Заполните это поле'
  } else if (name === 'message') {
    if (!trimmedValue) error = 'Сообщение не должно быть пустым'
  } else if (isEmpty) {
    if (field.required) error = 'Заполните это поле'
  } else if (name === 'password-check' || name === 'password_check') {
    const password = form.querySelector<FormField>('[name="password"]')
    if (password && value !== password.value) error = 'Пароли не совпадают'
  } else {
    const rule = fieldRules[name]
    if (rule && !rule.pattern.test(value)) error = rule.message
  }

  field.setAttribute('aria-invalid', String(Boolean(error)))
  let errorElement = field.nextElementSibling

  if (
    !(errorElement instanceof HTMLElement) ||
    !errorElement.classList.contains('form-field-error')
  ) {
    errorElement = document.createElement('span')
    errorElement.className = 'form-field-error'
    errorElement.id = `form-field-error-${++errorId}`
    field.insertAdjacentElement('afterend', errorElement)
  }

  errorElement.textContent = error
  const describedBy = (field.getAttribute('aria-describedby') || '')
    .split(' ')
    .filter(Boolean)
    .filter((id) => id !== errorElement.id)

  if (error) describedBy.push(errorElement.id)
  if (describedBy.length)
    field.setAttribute('aria-describedby', describedBy.join(' '))
  else field.removeAttribute('aria-describedby')

  return !error
}

function collectFormValues(form: HTMLFormElement) {
  const values: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {}

  for (const [name, value] of new FormData(form).entries()) {
    if (value === '') continue
    if (value instanceof File && !value.name) continue

    const previousValue = values[name]
    if (previousValue === undefined) {
      values[name] = value
    } else if (Array.isArray(previousValue)) {
      previousValue.push(value)
    } else {
      values[name] = [previousValue, value]
    }
  }

  return values
}

export { collectFormValues, validateField }
export type { FormField }
