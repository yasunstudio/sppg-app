import { z } from "zod"

export const ProfileValidation = z.object({
  bio: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  userId: z.string(),
})

export type ProfileValidationType = z.infer<typeof ProfileValidation>

export const profileAPI = {
  getProfiles: async () => {
    const response = await fetch("/api/profiles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch profiles")
    }

    return response.json()
  },

  getProfile: async (profileId: string) => {
    const response = await fetch(`/api/profiles/${profileId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch profile")
    }

    return response.json()
  },

  createProfile: async (data: ProfileValidationType) => {
    const validatedFields = ProfileValidation.parse(data)

    const response = await fetch("/api/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields),
    })

    if (!response.ok) {
      throw new Error("Failed to create profile")
    }

    return response.json()
  },

  updateProfile: async (profileId: string, data: Partial<ProfileValidationType>) => {
    const validatedFields = ProfileValidation.partial().parse(data)

    const response = await fetch(`/api/profiles/${profileId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields),
    })

    if (!response.ok) {
      throw new Error("Failed to update profile")
    }

    return response.json()
  },

  deleteProfile: async (profileId: string) => {
    const response = await fetch(`/api/profiles/${profileId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete profile")
    }
  },
}
