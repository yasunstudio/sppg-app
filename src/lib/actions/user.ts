import { z } from "zod"

export const UserValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["USER", "ADMIN"]),
})

export type UserValidationType = z.infer<typeof UserValidation>

export const userAPI = {
  getUsers: async () => {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }

    return response.json()
  },

  getUser: async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user")
    }

    return response.json()
  },

  createUser: async (data: UserValidationType) => {
    const validatedFields = UserValidation.parse(data)

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields),
    })

    if (!response.ok) {
      throw new Error("Failed to create user")
    }

    return response.json()
  },

  updateUser: async (userId: string, data: Partial<UserValidationType>) => {
    const validatedFields = UserValidation.partial().parse(data)

    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields),
    })

    if (!response.ok) {
      throw new Error("Failed to update user")
    }

    return response.json()
  },

  deleteUser: async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete user")
    }
  },
}
