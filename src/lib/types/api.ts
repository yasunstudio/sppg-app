export interface ApiUser {
  id: string
  name: string
  email: string
  roles: {
    role: {
      name: string
    }
  }[]
  createdAt: Date
  updatedAt: Date
}

export type ApiUserCreateInput = {
  name: string
  email: string
  role: string
}

export type ApiUserUpdateInput = {
  name?: string
  email?: string
  role?: string
}
