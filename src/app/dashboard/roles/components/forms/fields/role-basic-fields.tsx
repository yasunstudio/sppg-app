'use client'

import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RoleBasicFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function RoleBasicFields({ 
  control, 
  isSubmitting = false,
  title = "Informasi Dasar",
  description
}: RoleBasicFieldsProps) {
  return (
    <Card className="dark:bg-gray-800/50 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg dark:text-gray-100">{title}</CardTitle>
        {description && (
          <CardDescription className="dark:text-gray-400">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Role Name */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Nama Role *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Admin, Chef, Nutritionist"
                  disabled={isSubmitting}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  {...field}
                />
              </FormControl>
              <FormDescription className="dark:text-gray-400">
                Nama role harus unik dan mudah diidentifikasi
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deskripsi singkat tentang role ini..."
                  disabled={isSubmitting}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription className="dark:text-gray-400">
                Jelaskan fungsi dan tanggung jawab role ini (opsional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
