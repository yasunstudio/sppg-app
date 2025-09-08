"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getInitials, formatDate } from './utils/user-role-formatters'

// Mock data - replace with actual API calls
const mockRoles = [
  { id: '1', name: 'ADMIN', description: 'Administrator dengan akses penuh' },
  { id: '2', name: 'CHEF', description: 'Chef dengan akses dapur dan menu' },
  { id: '3', name: 'NUTRITIONIST', description: 'Ahli gizi untuk rekomendasi nutrisi' },
  { id: '4', name: 'SCHOOL_ADMIN', description: 'Administrator sekolah' },
]

const mockUserRole = {
  id: '1',
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: undefined,
  },
  role: {
    id: '2',
    name: 'CHEF',
    description: 'Chef dengan akses dapur dan menu',
  },
  isActive: true,
  assignedAt: new Date('2024-01-15'),
  assignedByUser: {
    name: 'Admin User',
  },
}

export function EditUserRole() {
  const router = useRouter()
  const params = useParams()
  const [selectedRole, setSelectedRole] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [userRole, setUserRole] = useState(mockUserRole)

  useEffect(() => {
    // Load user role data
    // Replace with actual API call
    setSelectedRole(userRole.role.id)
    setIsActive(userRole.isActive)
  }, [userRole])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Replace with actual API call
      console.log('Updating user role assignment:', {
        id: params.id,
        roleId: selectedRole,
        isActive
      })
      
      router.push('/dashboard/user-roles')
    } catch (error) {
      console.error('Error updating user role:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedRoleData = mockRoles.find(r => r.id === selectedRole)
  const hasChanges = selectedRole !== userRole.role.id || isActive !== userRole.isActive

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Edit Penugasan Role
        </h1>
        <p className="text-muted-foreground">
          Ubah role atau status penugasan untuk pengguna
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Pengguna</CardTitle>
            <CardDescription>
              Detail pengguna yang ditugaskan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userRole.user.avatar} alt={userRole.user.name} />
                <AvatarFallback>
                  {getInitials(userRole.user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userRole.user.name}</p>
                <p className="text-sm text-muted-foreground">{userRole.user.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ditugaskan:</span>
                <span>{formatDate(userRole.assignedAt.toISOString())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Oleh:</span>
                <span>{userRole.assignedByUser?.name || 'System'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Form Edit Penugasan</CardTitle>
            <CardDescription>
              Ubah role atau status yang ditugaskan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Role Info */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Role saat ini: <strong>{userRole.role.name}</strong> - {userRole.role.description}
                </AlertDescription>
              </Alert>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Pilih Role Baru</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role yang akan ditugaskan" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span className="font-medium">{role.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {role.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(checked === true)}
                />
                <label htmlFor="active" className="flex items-center gap-2 text-sm font-medium">
                  Status Aktif
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </label>
              </div>

              {/* Preview */}
              {selectedRoleData && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Preview Perubahan:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Role Baru:</span>
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        <span className="font-medium">{selectedRoleData.name}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </div>
                    {!hasChanges && (
                      <div className="text-amber-600 text-xs">
                        Tidak ada perubahan yang dibuat
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedRole || !hasChanges || isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
