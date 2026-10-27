export class User {
  id?: string | number
  username?: string
  name?: string
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  avatar?: string
  title?: string
  role?: 'Admin' | 'Branch Manager' | 'Moderator' | 'Dispatcher' | 'admin' | 'user'
  branchCode?: string
  branchName?: string
  token?: string
}
