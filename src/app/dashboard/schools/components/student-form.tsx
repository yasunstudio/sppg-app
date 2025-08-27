// Student form component for creating and editing students
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

const studentSchema = z.object({
  name: z.string().min(1, 'Nama siswa harus diisi'),
  nisn: z.string().min(1, 'NISN harus diisi'),
  age: z.number().min(5).max(18, 'Umur harus antara 5-18 tahun'),
  grade: z.string().min(1, 'Kelas harus diisi'),
  gender: z.enum(['MALE', 'FEMALE'], {
    message: 'Jenis kelamin harus dipilih'
  }),
  parentName: z.string().min(1, 'Nama orang tua harus diisi'),
  notes: z.string().optional(),
})

type StudentFormData = z.infer<typeof studentSchema>

interface Student {
  id: string
  name: string
  nisn: string
  age: number
  grade: string
  gender: 'MALE' | 'FEMALE'
  parentName: string
  notes?: string | null
  schoolId: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

interface StudentFormProps {
  student?: Student
  schoolId: string
  onSuccess: () => void
}

function StudentForm({ student, schoolId, onSuccess }: StudentFormProps) {
  const { toast } = useToast()
  
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student?.name || '',
      nisn: student?.nisn || '',
      age: student?.age || 6,
      grade: student?.grade || '',
      gender: student?.gender || 'MALE',
      parentName: student?.parentName || '',
      notes: student?.notes || '',
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          schoolId,
        }),
      })
      if (!response.ok) throw new Error('Failed to create student')
      return response.json()
    },
    onSuccess: () => {
      toast({
        open: true,
        onOpenChange: () => {},
        title: 'Berhasil',
        description: 'Siswa berhasil ditambahkan',
      })
      onSuccess()
    },
    onError: () => {
      toast({
        open: true,
        onOpenChange: () => {},
        title: 'Error',
        description: 'Gagal menambahkan siswa',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      const response = await fetch(`/api/students/${student?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update student')
      return response.json()
    },
    onSuccess: () => {
      toast({
        open: true,
        onOpenChange: () => {},
        title: 'Berhasil',
        description: 'Data siswa berhasil diperbarui',
      })
      onSuccess()
    },
    onError: () => {
      toast({
        open: true,
        onOpenChange: () => {},
        title: 'Error',
        description: 'Gagal memperbarui data siswa',
      })
    },
  })

  const onSubmit = async (data: StudentFormData) => {
    if (student) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Nama Siswa */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* NISN */}
          <FormField
            control={form.control}
            name="nisn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NISN</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan NISN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Umur */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Umur</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Masukkan umur"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Kelas */}
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kelas</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: 1A, 2B, dst" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Jenis Kelamin */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">Laki-laki</SelectItem>
                    <SelectItem value="FEMALE">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nama Orang Tua */}
          <FormField
            control={form.control}
            name="parentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Orang Tua</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama orang tua" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Catatan */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Catatan tambahan tentang siswa..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {student ? 'Perbarui' : 'Tambah'} Siswa
          </Button>
        </div>
      </form>
    </div>
  )
}

export { StudentForm }
export default StudentForm
