"use client"

import { useState } from "react"
import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface UserSecurityFieldsProps {
  control: Control<any>
  isLoading?: boolean
  isEdit?: boolean
}

export function UserSecurityFields({ control, isLoading, isEdit = false }: UserSecurityFieldsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  if (isEdit) {
    // For edit mode, password change is optional and handled separately
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password */}
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    disabled={isLoading}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi password"
                    disabled={isLoading}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Password harus memenuhi kriteria berikut:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Minimal 8 karakter</li>
          <li>Mengandung huruf kecil</li>
          <li>Mengandung huruf besar</li>
          <li>Mengandung angka</li>
        </ul>
      </div>
    </div>
  )
}
