import { type AuthFormFields } from '../types/auth-form-fields'

export const signInFormFields: AuthFormFields[] = [
  {
    name: 'login',
    label: 'Логин',
    type: 'text',
    required: true,
  },
  {
    name: 'password',
    label: 'Пароль',
    type: 'password',
    required: true,
  },
]
