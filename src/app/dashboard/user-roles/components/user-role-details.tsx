"use client"

import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Shield, 
  User, 
  Calendar, 
  Clock,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { getInitials, formatDate, formatRoleName, getRoleColor, getStatusColor } from './utils/user-role-formatters'

// Mock data - replace with actual API calls
const mockUserRole = {
  id: '1',
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: undefined,
    createdAt: new Date('2023-06-15'),
  },
  role: {
    id: '2',
    name: 'CHEF',
    description: 'Chef dengan akses dapur dan menu management',
    permissions: [
      'kitchen.view',
      'menu.create',
      'menu.edit',
      'menu.delete',
      'ingredients.view',
      'recipes.manage',
    ],
  },
  isActive: true,
  assignedAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
  assignedByUser: {
    name: 'Admin User',
    email: 'admin@example.com',
  },
}

const permissionLabels: Record<string, string> = {
  'kitchen.view': 'Lihat Dapur',
  'menu.create': 'Buat Menu',
  'menu.edit': 'Edit Menu',
  'menu.delete': 'Hapus Menu',
  'ingredients.view': 'Lihat Bahan',
  'recipes.manage': 'Kelola Resep',
}

export function UserRoleDetails() {
  const router = useRouter()
  const params = useParams()
  const userRole = mockUserRole

  const handleEdit = () => {
    router.push(`/dashboard/user-roles/${params.id}/edit`)
  }

  const handleDelete = () => {
    // Implement delete functionality
    console.log('Delete user role:', params.id)
  }

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Detail Penugasan Role
            </h1>
            <p className="text-muted-foreground">
              Informasi lengkap tentang penugasan role pengguna
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informasi Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userRole.user.avatar} alt={userRole.user.name} />
                <AvatarFallback className="text-lg">
                  {getInitials(userRole.user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{userRole.user.name}</h3>
                <p className="text-muted-foreground">{userRole.user.email}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">User ID:</span>
                <span className="font-mono">{userRole.user.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Bergabung:</span>
                <span>{formatDate(userRole.user.createdAt.toISOString())}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Informasi Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Badge className={`${getRoleColor(userRole.role.name)} text-base px-3 py-1`}>
                  <Shield className="mr-2 h-4 w-4" />
                  {formatRoleName(userRole.role.name)}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Deskripsi:</h4>
                <p className="text-sm text-muted-foreground">
                  {userRole.role.description}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Permissions:</h4>
                <div className="space-y-1">
                  {userRole.role.permissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{permissionLabels[permission] || permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informasi Penugasan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Status:</h4>
                <Badge className={getStatusColor(userRole.isActive)}>
                  {userRole.isActive ? (
                    <CheckCircle className="mr-2 h-3 w-3" />
                  ) : (
                    <XCircle className="mr-2 h-3 w-3" />
                  )}
                  {userRole.isActive ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ditugaskan:</span>
                  <span>{formatDate(userRole.assignedAt.toISOString())}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Diperbarui:</span>
                  <span>{formatDate(userRole.updatedAt.toISOString())}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Ditugaskan oleh:</span>
                  <div className="pl-2 border-l-2 border-muted">
                    <p className="font-medium">{userRole.assignedByUser?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {userRole.assignedByUser?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Riwayat Penugasan
          </CardTitle>
          <CardDescription>
            Timeline perubahan role dan status pengguna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock history items */}
            <div className="flex items-start gap-3 pb-4 border-b last:border-b-0">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Role diperbarui</p>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(userRole.updatedAt.toISOString())}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Status diubah menjadi aktif oleh Admin User
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 pb-4 border-b last:border-b-0">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Role ditugaskan</p>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(userRole.assignedAt.toISOString())}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Role CHEF ditugaskan kepada {userRole.user.name} oleh {userRole.assignedByUser?.name}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
