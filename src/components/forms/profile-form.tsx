import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Profile } from "@/lib/types/profile"

const profileFormSchema = z.object({
  bio: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  profile?: Profile
  onSubmit: (data: ProfileFormValues) => Promise<void>
}

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: profile?.bio || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-1">
          Bio
        </label>
        <textarea
          {...form.register("bio")}
          id="bio"
          rows={4}
          className="w-full rounded-md border px-3 py-2"
        />
        {form.formState.errors.bio && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.bio.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone
        </label>
        <input
          {...form.register("phone")}
          type="tel"
          id="phone"
          className="w-full rounded-md border px-3 py-2"
        />
        {form.formState.errors.phone && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Address
        </label>
        <textarea
          {...form.register("address")}
          id="address"
          rows={3}
          className="w-full rounded-md border px-3 py-2"
        />
        {form.formState.errors.address && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.address.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
      >
        {profile ? "Update Profile" : "Create Profile"}
      </button>
    </form>
  )
}
