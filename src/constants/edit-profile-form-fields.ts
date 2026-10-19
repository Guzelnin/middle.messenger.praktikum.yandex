import { type ProfileFormField } from '../types/profile-form-field'

export const editProfileFormFields = (user: {
  email: string
  login: string
  firstName: string
  lastName: string
  phone: string
}): ProfileFormField[] => [
  {
    id: 'email',
    name: 'email',
    label: 'Почта',
    type: 'email',
    value: user.email,
  },
  {
    id: 'login',
    name: 'login',
    label: 'Логин',
    type: 'text',
    value: user.login,
  },
  {
    id: 'first-name',
    name: 'first_name',
    label: 'Имя',
    type: 'text',
    value: user.firstName,
  },
  {
    id: 'second-name',
    name: 'second_name',
    label: 'Фамилия',
    type: 'text',
    value: user.lastName,
  },
  {
    id: 'phone',
    name: 'phone',
    label: 'Телефон',
    type: 'tel',
    value: user.phone,
  },
]
