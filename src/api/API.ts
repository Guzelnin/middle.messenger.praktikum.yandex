import HTTPTransport from './HTTPTransport'

const api = new HTTPTransport('https://ya-praktikum.tech/api/v2')

export interface User {
  id: number
  first_name: string
  second_name: string
  display_name: string | null
  login: string
  email: string
  phone: string
  avatar: string | null
}

export interface Chat {
  id: number
  title: string
  avatar: string | null
  unread_count: number
  last_message: { content: string; time: string; user?: User } | null
}

export const AuthAPI = {
  signUp: (data: Record<string, unknown>) =>
    api.post<{ id: number }>('/auth/signup', data),
  signIn: (data: Record<string, unknown>) =>
    api.post<void>('/auth/signin', data),
  logout: () => api.post<void>('/auth/logout'),
  current: () => api.get<User>('/auth/user'),
}

export const UserAPI = {
  update: (data: Record<string, unknown>) =>
    api.put<User>('/user/profile', data),
  updatePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.put<void>('/user/password', data),
  updateAvatar: (data: FormData) => api.put<User>('/user/profile/avatar', data),
}

export const ChatAPI = {
  list: () => api.get<Chat[]>('/chats'),
  create: (title: string) => api.post<{ id: number }>('/chats', { title }),
  users: (chatId: number) => api.get<User[]>(`/chats/${chatId}/users`),
  addUsers: (chatId: number, users: number[]) =>
    api.put<void>('/chats/users', { chatId, users }),
  delete: (chatId: number) => api.delete<void>('/chats', { chatId }),
}

export const UserSearchAPI = {
  byLogin: (login: string) => api.post<User[]>('/user/search', { login }),
}
