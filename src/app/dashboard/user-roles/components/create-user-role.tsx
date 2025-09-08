"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { ArrowLeft, Shield, User, Search } from 'lucide-react'
import { getInitials } from './utils/user-role-formatters'

// Mock data - replace with actual API calls
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: undefined },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: undefined },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', avatar: undefined },
]

const mockRoles = [
  { id: '1', name: 'ADMIN', description: 'Administrator dengan akses penuh' },
  { id: '2', name: 'CHEF', description: 'Chef dengan akses dapur dan menu' },
  { id: '3', name: 'NUTRITIONIST', description: 'Ahli gizi untuk rekomendasi nutrisi' },
  { id: '4', name: 'SCHOOL_ADMIN', description: 'Administrator sekolah' },
]

export function CreateUserRole() {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [userSearch, setUserSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !selectedRole) return

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Replace with actual API call
      console.log('Creating user role assignment:', {
        userId: selectedUser,
        roleId: selectedRole,
        isActive
      })
      
      router.push('/dashboard/user-roles')
    } catch (error) {
      console.error('Error creating user role:', error)
    } finally {
      setIsLoading(false)
    }
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
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Tugaskan Role ke Pengguna
        </h1>
        <p className="text-muted-foreground">
          Tugaskan role baru kepada pengguna untuk memberikan akses dan permissions
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Form Penugasan Role</CardTitle>
          <CardDescription>
            Pilih pengguna dan role yang akan ditugaskan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Selection */}
            <div className="space-y-2">
              <Label htmlFor="user">Pilih Pengguna</Label>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari pengguna..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="border rounded-lg max-h-40 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <User className="h-8 w-8 mx-auto mb-2" />
                      <p>Tidak ada pengguna ditemukan</p>
                    </div>
                  ) : (
                    <div className="space-y-1 p-2">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedUser === user.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedUser(user.id)}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm opacity-70">{user.email}</p>
                          </div>
                          {selectedUser === user.id && (
                            <div className="w-2 h-2 bg-current rounded-full" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Pilih Role</Label>
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
              <Label htmlFor="active" className="flex items-center gap-2">
                Status Aktif
                <Badge variant={isActive ? "default" : "secondary"}>
                  {isActive ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </Label>
            </div>

            {/* Preview */}
            {selectedUser && selectedRole && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Preview Penugasan:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Pengguna:</span>
                    <span className="font-medium">
                      {filteredUsers.find(u => u.id === selectedUser)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Role:</span>
                    <span className="font-medium">
                      {mockRoles.find(r => r.id === selectedRole)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {isActive ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                  </div>
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
                disabled={!selectedUser || !selectedRole || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Menyimpan...' : 'Tugaskan Role'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
