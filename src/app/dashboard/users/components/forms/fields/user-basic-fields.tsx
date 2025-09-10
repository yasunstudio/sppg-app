"use client"

import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

interface UserBasicFieldsProps {
  control: Control<any>
  isLoading?: boolean
}

export function UserBasicFields({ control, isLoading }: UserBasicFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <FormField
          control={control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan nama lengkap"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Masukkan email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Username */}
        <FormField
          control={control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username (Opsional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan username"
                  disabled={isLoading}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon (Opsional)</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Masukkan nomor telepon"
                  disabled={isLoading}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Address */}
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alamat (Opsional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Masukkan alamat"
                disabled={isLoading}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Status */}
      <FormField
        control={control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Status Aktif</FormLabel>
              <div className="text-sm text-muted-foreground">
                Pengguna dapat login dan mengakses sistem
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
