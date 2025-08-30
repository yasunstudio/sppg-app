"use client"

import { useTransition, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff, UserPlus, Shield } from "lucide-react"
import { createUser, updateUser } from "../actions"
import { USER_ROLES } from "@/lib/permissions"

interface User {
  id: string
  name: string
  email: string
  username?: string | null
  phone?: string | null
  address?: string | null
  avatar?: string | null
  role: string
  isActive: boolean
  emailVerified: boolean
}

interface Props {
  user?: User
  onSuccess?: () => void
}

const userFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .min(2, { message: "Name must be at least 2 characters" })
      .max(100, { message: "Name must not exceed 100 characters" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" })
      .max(255, { message: "Email must not exceed 255 characters" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(50, { message: "Username must not exceed 50 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(72, { message: "Password must not exceed 72 characters" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .optional(),
    phone: z
      .string()
      .regex(/^[+]?[0-9\s\-()]+$/, { message: "Invalid phone number format" })
      .min(10, { message: "Phone number must be at least 10 digits" })
      .max(20, { message: "Phone number must not exceed 20 characters" })
      .optional()
      .or(z.literal("")),
    address: z
      .string()
      .max(500, { message: "Address must not exceed 500 characters" })
      .optional()
      .or(z.literal("")),
    role: z.enum(
      Object.keys(USER_ROLES) as [keyof typeof USER_ROLES, ...Array<keyof typeof USER_ROLES>],
      { message: "Please select a valid role" }
    ),
    isActive: z.boolean(),
    avatar: z.any().optional(), // File input
  })
  .refine(
    (data) => {
      // Password is required for new users only
      return data.password || data.password === undefined
    },
    {
      message: "Password is required for new users",
      path: ["password"],
    }
  )

type UserFormValues = z.infer<typeof userFormSchema>

export function UserForm({ user, onSuccess }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      username: user?.username ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      role: (user?.role as keyof typeof USER_ROLES) ?? "VOLUNTEER",
      isActive: user?.isActive ?? true,
      password: "", // Always start with empty string for controlled input
    },
    mode: "onChange",
  })

  
  const handleSubmit = form.handleSubmit(async (data) => {
    // Validate password for new users
    if (!user?.id && !data.password) {
      form.setError("password", { message: "Password is required for new users" })
      return
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("name", data.name.trim())
        formData.append("email", data.email.trim().toLowerCase())
        formData.append("role", data.role)
        formData.append("isActive", data.isActive.toString())
        
        // Keep existing avatar if user is being updated
        if (user?.avatar) {
          formData.append("avatar", user.avatar)
        }
        if (data.username) {
          formData.append("username", data.username.trim())
        }
        if (data.phone) {
          formData.append("phone", data.phone.trim())
        }
        if (data.address) {
          formData.append("address", data.address.trim())
        }
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
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-blue-600" />
              Basic Information
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Enter the user's personal and contact information.
            </p>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter full name" 
                      {...field} 
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email Address <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="name@example.com" 
                      {...field} 
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter username (optional)" 
                      {...field}
                      value={field.value || ""} 
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Optional. Must be unique and contain only letters, numbers, and underscores.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter phone number (optional)" 
                      {...field}
                      value={field.value || ""} 
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter address (optional)" 
                    {...field}
                    value={field.value || ""} 
                    disabled={isPending}
                    rows={3}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Security Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Security & Access
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure login credentials and system permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password {!user?.id && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder={user?.id ? "Leave blank to keep current password" : "Enter password"}
                        {...field}
                        value={field.value || ""} 
                        disabled={isPending}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    {user?.id 
                      ? "Leave blank to keep the current password"
                      : "Must contain at least 6 characters with uppercase, lowercase, and numbers"
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Role <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(USER_ROLES).map(([key, role]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex flex-col py-1">
                            <span className="font-medium">{role.name}</span>
                            <span className="text-xs text-muted-foreground">{role.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Account Status */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Active Account</FormLabel>
                    <FormDescription>
                      When enabled, the user can access the system and perform actions based on their role.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/users")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {user?.id ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
