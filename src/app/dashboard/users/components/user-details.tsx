"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  User,
  Shield,
  CircleCheck,
  CircleX,
  Calendar,
  FileText,
  Activity,
  MapPin,
  Timer,
  AlertTriangle,
  Loader2,
  Mail,
  Phone,
  Building
} from "lucide-react"
import { useUserDetails } from "./hooks/use-user-details"

interface UserDetailsProps {
  userId: string
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const formatDateShort = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString))
}

const statusTranslations = {
  "ACTIVE": "Aktif",
  "INACTIVE": "Tidak Aktif",
  "SUSPENDED": "Suspended",
  "PENDING": "Menunggu"
}

export default function UserDetails({ userId }: UserDetailsProps) {
  const router = useRouter()
  const { 
    user, 
    activities, 
    isLoading, 
    isActivitiesLoading, 
    error,
    refreshUser 
  } = useUserDetails(userId)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data pengguna...</span>
      </div>
    )
  }

  // Error state
  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Pengguna Tidak Ditemukan</h3>
          <p className="text-muted-foreground">
            {error || 'Data pengguna tidak dapat dimuat'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refreshUser} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? (
          <>
            <CircleCheck className="h-3 w-3 mr-1" />
            Aktif
          </>
        ) : (
          <>
            <CircleX className="h-3 w-3 mr-1" />
            Tidak Aktif
          </>
        )}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user.fullName}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
            {getStatusBadge(user.isActive)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Informasi Kontak
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telepon:</span>
                    <span className="font-medium">{user.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  {getStatusBadge(user.isActive)}
                </div>
              </div>
            </div>

            {/* Role Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Peran & Izin
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground">Peran:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.roles && user.roles.map((userRole, index) => (
                      <Badge key={index} variant="outline">
                        {userRole.role.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Account Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Informasi Akun
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dibuat:</span>
                  <span className="font-medium">{formatDateShort(user.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diperbarui:</span>
                  <span className="font-medium">{formatDateShort(user.updatedAt)}</span>
                </div>
                {user.lastLogin && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Login Terakhir:</span>
                    <span className="font-medium">{formatDate(user.lastLogin)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Statistik
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Login:</span>
                  <span className="font-medium">{user.loginCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aktivitas Terakhir:</span>
                  <span className="font-medium">
                    {user.lastActivity ? formatDate(user.lastActivity) : 'Tidak ada'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Aktivitas Terbaru
          </CardTitle>
          <CardDescription>
            Riwayat aktivitas pengguna terbaru
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isActivitiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Memuat aktivitas...</span>
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.slice(0, 10).map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                  <div className="p-2 rounded-lg bg-muted">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada aktivitas terbaru</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
