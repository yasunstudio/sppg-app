// School form component for creating and editing schools
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

const schoolSchema = z.object({
  name: z.string().min(1, 'Nama sekolah harus diisi'),
  type: z.enum(['SD', 'SMP', 'SMA', 'SMK'], {
    message: 'Jenis sekolah harus dipilih'
  }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING'], {
    message: 'Status harus dipilih'
  }),
  address: z.string().min(1, 'Alamat harus diisi'),
  phone: z.string().optional(),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  principalName: z.string().optional(),
  description: z.string().optional(),
})

type SchoolFormData = z.infer<typeof schoolSchema>

interface School {
  id: string
  name: string
  type: 'SD' | 'SMP' | 'SMA' | 'SMK'
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  address: string
  phone?: string
  email?: string
  principalName?: string
  description?: string
}

interface SchoolFormProps {
  school?: School
  onSuccess: () => void
}

export function SchoolForm({ school, onSuccess }: SchoolFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: school?.name || '',
      type: school?.type || 'SD',
      status: school?.status || 'ACTIVE',
      address: school?.address || '',
      phone: school?.phone || '',
      email: school?.email || '',
      principalName: school?.principalName || '',
      description: school?.description || '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: SchoolFormData) => {
      const url = school ? `/api/schools/${school.id}` : '/api/schools'
      const method = school ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Gagal menyimpan sekolah')
      }
      
      return response.json()
    },
    onSuccess: () => {
      toast({
        open: true,
        onOpenChange: () => {},
        title: 'Berhasil',
        description: school ? 'Sekolah berhasil diperbarui' : 'Sekolah berhasil ditambahkan',
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

  const onSubmit = async (data: SchoolFormData) => {
    setIsSubmitting(true)
    try {
      await mutation.mutateAsync(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const schoolTypes = [
    { value: 'SD', label: 'Sekolah Dasar' },
    { value: 'SMP', label: 'SMP' },
    { value: 'SMA', label: 'SMA' },
    { value: 'SMK', label: 'SMK' },
  ]

  const statusOptions = [
    { value: 'ACTIVE', label: 'Aktif' },
    { value: 'INACTIVE', label: 'Tidak Aktif' },
    { value: 'PENDING', label: 'Pending' },
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
                <FormLabel>Nama Sekolah *</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama sekolah" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Sekolah *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis sekolah" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {schoolTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
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
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
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
            name="principalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kepala Sekolah</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama kepala sekolah" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nomor telepon" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Masukkan email sekolah" 
                    {...field} 
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
              <FormLabel>Alamat *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Masukkan alamat lengkap sekolah"
                  className="min-h-[80px]"
                  {...field} 
                />
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
                  placeholder="Masukkan deskripsi atau catatan tambahan"
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
              school ? 'Perbarui' : 'Simpan'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
