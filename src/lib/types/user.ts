export interface User {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
  password?: string
  role?: string
}
