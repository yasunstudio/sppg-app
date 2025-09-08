"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { ArrowLeft, Edit, Trash2, UserIcon, Mail, Phone, Building, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import type { User } from "./utils/user-types"
import { formatUserRole, formatUserStatus, getUserRoleColor, getUserStatusColor, formatDate, getInitials } from "./utils/user-formatters"

interface UserDetailsProps {
  userId: string
}

export function UserDetails({ userId }: UserDetailsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`)
        if (!response.ok) throw new Error('Failed to fetch user')
        
        const userData: User = await response.json()
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
        toast.error('Gagal memuat data pengguna')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      toast.success('Pengguna berhasil dihapus')
      router.push('/dashboard/users')
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Gagal menghapus pengguna')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">Memuat data pengguna...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Pengguna Tidak Ditemukan</h1>
            <p className="text-muted-foreground">Data pengguna tidak dapat ditemukan</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Detail Pengguna</h1>
            <p className="text-muted-foreground">Informasi lengkap pengguna</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/dashboard/users/${userId}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge className={getUserRoleColor(user.role)}>
                {formatUserRole(user.role)}
              </Badge>
              <Badge className={getUserStatusColor(user.status)}>
                {formatUserStatus(user.status)}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Informasi Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Nomor Telepon</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.school && (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Sekolah</p>
                      <p className="text-sm text-muted-foreground">{user.school.name}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Tanggal Dibuat</p>
                    <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Terakhir Diperbarui</p>
                    <p className="text-sm text-muted-foreground">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
