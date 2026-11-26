import { type ProfileFormField } from '../types/profile-form-field'

export const editPasswordFormFields: ProfileFormField[] = [
  {
    id: 'old-password',
    name: 'oldPassword',
    label: 'Текущий пароль',
    type: 'password',
    required: true,
  },
  {
    id: 'password',
    name: 'newPassword',
    label: 'Новый пароль',
    type: 'password',
    required: true,
  },
  {
    id: 'password-check',
    name: 'newPasswordCheck',
    label: 'Повторите новый пароль',
    type: 'password',
    required: true,
  },
]
