import { type AuthFormFields } from '../types/auth-form-fields'

export const signUnFormFields: AuthFormFields[] = [
  {
    name: 'email',
    label: 'Почта',
    type: 'email',
    required: true,
  },
  {
    name: 'login',
    label: 'Логин',
    type: 'text',
    required: true,
  },
  {
    name: 'first_name',
    label: 'Имя',
    type: 'text',
    required: true,
  },
  {
    name: 'second_name',
    label: 'Фамилия',
    type: 'text',
    required: true,
  },
  {
    name: 'phone',
    label: 'Телефон',
    type: 'tel',
    required: true,
  },
  {
    name: 'password',
    label: 'Пароль',
    type: 'password',
    required: true,
  },
  {
    name: 'password_check',
    label: 'Пароль (еще раз)',
    type: 'password',
    required: true,
  },
]
