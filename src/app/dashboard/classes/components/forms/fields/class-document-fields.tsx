import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Control } from 'react-hook-form'

interface ClassSchoolFieldsProps {
  control: Control<any>
  isSubmitting: boolean
  title: string
  description: string
}

export function ClassSchoolFields({ control, isSubmitting, title, description }: ClassSchoolFieldsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* School Selection */}
        <FormField
          control={control}
          name="schoolId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sekolah *</FormLabel>
              <FormControl>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sekolah" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: Load schools from API */}
                    <SelectItem value="school-1">SD Negeri 1</SelectItem>
                    <SelectItem value="school-2">SMP Negeri 2</SelectItem>
                    <SelectItem value="school-3">SMA Negeri 3</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Teacher Name */}
        <FormField
          control={control}
          name="teacherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Wali Kelas</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Budi Santoso, S.Pd"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
