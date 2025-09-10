'use client'

import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PERMISSION_OPTIONS, PERMISSION_CATEGORIES } from "../../utils/role-schemas"

interface RolePermissionFieldsProps {
  control: Control<any>
  isSubmitting?: boolean
  title?: string
  description?: string
}

export function RolePermissionFields({ 
  control, 
  isSubmitting = false,
  title = "Permissions & Akses",
  description
}: RolePermissionFieldsProps) {
  return (
    <Card className="dark:bg-gray-800/50 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg dark:text-gray-100">{title}</CardTitle>
        {description && (
          <CardDescription className="dark:text-gray-400">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permissions */}
        <FormField
          control={control}
          name="permissions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Pilih Permissions *</FormLabel>
              <FormDescription className="dark:text-gray-400">
                Pilih hak akses yang akan diberikan untuk role ini
              </FormDescription>
              <FormControl>
                <div className="space-y-6">
                  {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                          {category}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-3 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                        {permissions.map((permission) => {
                          const option = PERMISSION_OPTIONS.find(opt => opt.value === permission)
                          if (!option) return null
                          
                          return (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.value?.includes(permission)}
                                disabled={isSubmitting}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), permission]
                                    : (field.value || []).filter((value: string) => value !== permission)
                                  field.onChange(updatedValue)
                                }}
                                className="dark:border-gray-500 dark:data-[state=checked]:bg-blue-600"
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-200">
                                  {option.label}
                                </label>
                                <p className="text-xs text-muted-foreground dark:text-gray-400">
                                  {getPermissionDescription(permission)}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Selected Permissions Summary */}
        <FormField
          control={control}
          name="permissions"
          render={({ field }) => (
            <div className="space-y-2">
              <FormLabel className="dark:text-gray-200">Permissions Terpilih</FormLabel>
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md dark:border-gray-600 dark:bg-gray-700/30">
                {field.value?.length > 0 ? (
                  field.value.map((permission: string) => {
                    const option = PERMISSION_OPTIONS.find(opt => opt.value === permission)
                    return option ? (
                      <Badge key={permission} variant="secondary" className="dark:bg-blue-600/20 dark:text-blue-300 dark:border-blue-500">
                        {option.label}
                      </Badge>
                    ) : null
                  })
                ) : (
                  <span className="text-sm text-muted-foreground dark:text-gray-400">
                    Belum ada permissions yang dipilih
                  </span>
                )}
              </div>
            </div>
          )}
        />
      </CardContent>
    </Card>
  )
}

function getPermissionDescription(permission: string): string {
  const descriptions: Record<string, string> = {
    'manage_users': 'Membuat, mengedit, dan menghapus pengguna',
    'manage_roles': 'Mengelola role dan permissions sistem',
    'manage_schools': 'Mengelola data sekolah dan institusi',
    'manage_students': 'Mengelola data siswa dan profil',
    'manage_suppliers': 'Mengelola data supplier dan vendor',
    'manage_vehicles': 'Mengelola kendaraan distribusi',
    'manage_waste_records': 'Mengelola data dan laporan sampah',
    'manage_system_config': 'Mengatur konfigurasi sistem',
    'view_reports': 'Melihat dan mengakses laporan',
    'view_analytics': 'Melihat dashboard dan analitik'
  }
  
  return descriptions[permission] || 'Deskripsi tidak tersedia'
}
