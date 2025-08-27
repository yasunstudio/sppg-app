// Class form component for creating and editing classes
// Export for TypeScript module resolution
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

const classSchema = z.object({
  name: z.string().min(1, 'Nama kelas harus diisi'),
  grade: z.number().min(1).max(12, 'Tingkat kelas harus antara 1-12'),
  capacity: z.number().min(1, 'Kapasitas minimal 1 siswa'),
  teacherName: z.string().optional(),
  schedule: z.string().optional(),
  room: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    message: 'Status harus dipilih'
  }),
})

type ClassFormData = z.infer<typeof classSchema>

interface Class {
  id: string
  name: string
  grade: number
  capacity: number
  currentStudents: number
  teacherName?: string
  schedule?: string
  room?: string
  description?: string
  status: 'ACTIVE' | 'INACTIVE'
}

interface ClassFormProps {
  class?: Class
  schoolId: string
  onSuccess: () => void
}

export function ClassForm({ class: classData, schoolId, onSuccess }: ClassFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: classData?.name || '',
      grade: classData?.grade || 1,
      capacity: classData?.capacity || 30,
      teacherName: classData?.teacherName || '',
      schedule: classData?.schedule || '',
      room: classData?.room || '',
      description: classData?.description || '',
      status: classData?.status || 'ACTIVE',
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: ClassFormData & { schoolId: string }) => {
      const url = classData ? `/api/classes/${classData.id}` : '/api/classes'
      const method = classData ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Gagal menyimpan kelas')
      }
      
      return response.json()
    },
    onSuccess: () => {
      toast({
        open: true,
        onOpenChange: () => {},
        title: 'Berhasil',
        description: classData ? 'Kelas berhasil diperbarui' : 'Kelas berhasil ditambahkan',
      })
      onSuccess()
    },
    onError: (error: Error) => {
      toast({
        open: true,
        onOpenChange: () => {},
        title: 'Error',
        description: error.message,
      })
    },
  })

  const onSubmit = async (data: ClassFormData) => {
    setIsSubmitting(true)
    try {
      await mutation.mutateAsync({
        ...data,
        schoolId,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const gradeOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Kelas ${i + 1}`
  }))

  const scheduleTemplates = [
    'Senin - Jumat, 07:00 - 12:00',
    'Senin - Jumat, 13:00 - 17:00',
    'Senin - Sabtu, 07:00 - 12:00',
    'Senin - Sabtu, 13:00 - 16:00',
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kelas *</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: A, B, IPA 1, IPS 2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tingkat Kelas *</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat kelas" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gradeOptions.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value.toString()}>
                        {grade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kapasitas *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="30" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teacherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wali Kelas</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama wali kelas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ruang Kelas</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: R-101, Lab Komputer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Aktif</SelectItem>
                    <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jadwal Kelas</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input 
                    placeholder="Masukkan jadwal kelas"
                    {...field} 
                  />
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Template cepat:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {scheduleTemplates.map((template, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => field.onChange(template)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                        >
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Masukkan deskripsi atau catatan tambahan tentang kelas"
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              classData ? 'Perbarui' : 'Simpan'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
