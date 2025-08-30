"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { createUser, updateUser } from "../actions"
import type { User } from "@/lib/types/user"

interface Props {
  user?: User
  onSuccess?: () => void
}

export function UserForm({ user, onSuccess }: Props) {
  const userFormSchema = z
    .object({
      name: z
        .string()
        .min(1, { message: "Name is required" })
        .min(2, { message: "Name must be at least 2 characters" })
        .max(100, { message: "Name must not exceed 100 characters" })
        .regex(/^[a-zA-Z\s]+$/, { message: "Name must contain only letters and spaces" }),
      email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" })
        .max(255, { message: "Email must not exceed 255 characters" }),
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(72, { message: "Password must not exceed 72 characters" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .optional(),
      role: z.enum(["USER", "ADMIN"], { message: "Please select a valid role" }),
    })
    .refine(
      (data) => {
        // Password is required for new users
        if (!data.password && !user?.id) {
          return false
        }
        return true
      },
      {
        message: "Password is required for new users",
        path: ["password"],
      }
    )

  type UserFormValues = z.infer<typeof userFormSchema>

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: (user?.role as "USER" | "ADMIN") || "USER",
    },
    mode: "onChange",
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("name", data.name.trim())
        formData.append("email", data.email.trim().toLowerCase())
        formData.append("role", data.role)
        if (data.password) {
          formData.append("password", data.password)
        }

        if (user?.id) {
          await updateUser(user.id, formData)
        } else {
          await createUser(formData)
        }

        toast.success(user
          ? "User has been updated successfully."
          : "User has been created successfully.")

        form.reset()
        
        if (onSuccess) {
          onSuccess()
        } else {
          // Navigate back to users list
          router.push("/dashboard/users")
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong")
      }
    })
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-foreground">Name</Label>
          <Input
            id="name"
            placeholder="Enter name"
            type="text"
            autoCapitalize="none"
            autoComplete="name"
            autoCorrect="off"
            disabled={isPending}
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isPending}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password" className="text-foreground">
            Password {!user?.id && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="password"
            placeholder={user?.id ? "Leave blank to keep current password" : "Enter password"}
            type="password"
            autoCapitalize="none"
            autoComplete={user?.id ? "new-password" : "current-password"}
            autoCorrect="off"
            disabled={isPending}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="role" className="text-foreground">Role</Label>
          <Select
            disabled={isPending}
            onValueChange={(value: "USER" | "ADMIN") =>
              form.setValue("role", value)
            }
            defaultValue={form.getValues("role")}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.role && (
            <p className="text-sm text-destructive">
              {form.formState.errors.role.message}
            </p>
          )}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {user?.id ? "Update user" : "Create user"}
      </Button>
    </form>
  )
}
