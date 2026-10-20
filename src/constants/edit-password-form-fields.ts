import { type ProfileFormField } from '../types/profile-form-field'

export const editPasswordFormFields: ProfileFormField[] = [
  {
    id: 'old-password',
    name: 'old-password',
    label: 'Текущий пароль',
    type: 'password',
    required: true,
  },
  {
    id: 'password',
    name: 'password',
    label: 'Новый пароль',
    type: 'password',
    required: true,
  },
  {
    id: 'password-check',
    name: 'password-check',
    label: 'Повторите новый пароль',
    type: 'password',
    required: true,
  },
]
