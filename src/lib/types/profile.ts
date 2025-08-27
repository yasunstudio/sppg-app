export interface Profile {
  id: string
  bio: string | null
  phone: string | null
  address: string | null
  userId: string
  user?: {
    name: string | null
    email: string | null
  }
  createdAt: Date
  updatedAt: Date
}
