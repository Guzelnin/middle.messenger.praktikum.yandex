import { type ProfileFormField } from '../types/profile-form-field'

export const editProfileFormFields = (user: {
  email: string
  login: string
  firstName: string
  lastName: string
  phone: string
  displayName: string
}): ProfileFormField[] => [
  {
    id: 'display-name',
    name: 'display_name',
    label: 'Имя в чате',
    type: 'text',
    value: user.displayName,
  },
  {
    id: 'email',
    name: 'email',
    label: 'Почта',
    type: 'email',
    value: user.email,
    required: true,
  },
  {
    id: 'login',
    name: 'login',
    label: 'Логин',
    type: 'text',
    value: user.login,
    required: true,
  },
  {
    id: 'first-name',
    name: 'first_name',
    label: 'Имя',
    type: 'text',
    value: user.firstName,
    required: true,
  },
  {
    id: 'second-name',
    name: 'second_name',
    label: 'Фамилия',
    type: 'text',
    value: user.lastName,
    required: true,
  },
  {
    id: 'phone',
    name: 'phone',
    label: 'Телефон',
    type: 'tel',
    value: user.phone,
    required: true,
  },
]
