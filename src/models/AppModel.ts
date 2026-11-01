export interface User {
  name: string
  initials: string
  email: string
  login: string
  firstName: string
  lastName: string
  phone: string
}

export interface Chat {
  title: string
  avatarInitials: string
  last_message: {
    time: string
    content: string
  }
}

export interface Message {
  content: string
  isOwn: boolean
  time: string
}

export default class AppModel {
  private readonly user: User = {
    name: 'Guzel',
    initials: 'GM',
    email: 'guzel@example.com',
    login: 'guzel',
    firstName: 'Guzel',
    lastName: 'M',
    phone: '+79000000000',
  }

  private readonly chats: Chat[] = [
    {
      title: 'Sasha',
      avatarInitials: 'S',
      last_message: {
        time: '12:45',
        content: 'Привет',
      },
    },
  ]

  private readonly messages: Message[] = [
    { content: 'Привет', isOwn: true, time: '12:20' },
    { content: 'Привет', isOwn: false, time: '12:45' },
  ]

  getUser(): User {
    return { ...this.user }
  }

  getChats(): Chat[] {
    return this.chats.map((chat) => ({
      ...chat,
      last_message: { ...chat.last_message },
    }))
  }

  getMessages(): Message[] {
    return this.messages.map((message) => ({ ...message }))
  }
}
