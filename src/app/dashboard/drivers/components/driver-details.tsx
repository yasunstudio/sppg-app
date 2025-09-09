"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  FileText,
  Activity,
  AlertTriangle,
  Loader2,
  CircleCheck,
  CircleX
} from "lucide-react"
import { useDriverDetails } from "./hooks/use-driver-details"
import { DriverDistributionsCard, DriverDeliveriesCard } from "./driver-details/"

interface DriverDetailsProps {
  driverId: string
}

const formatLicenseType = (licenseType: string) => {
  switch (licenseType) {
    case 'SIM_A':
      return 'SIM A'
    case 'SIM_B1':
      return 'SIM B1'
    case 'SIM_B2':
      return 'SIM B2'
    case 'SIM_C':
      return 'SIM C'
    case 'SIM_D':
      return 'SIM D'
    default:
      return licenseType
  }
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

export default function DriverDetails({ driverId }: DriverDetailsProps) {
  const router = useRouter()
  const { 
    driver, 
    isLoading, 
    error,
    refreshDriver 
  } = useDriverDetails(driverId)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data driver...</span>
      </div>
    )
  }

  // Error state
  if (error || !driver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Driver Tidak Ditemukan</h3>
          <p className="text-muted-foreground">
            {error || 'Data driver tidak dapat dimuat'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refreshDriver} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CircleCheck className="w-4 h-4 text-green-500" />
    ) : (
      <CircleX className="w-4 h-4 text-red-500" />
    )
  }

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Aktif" : "Tidak Aktif"
  }

  const getStatusVariant = (isActive: boolean) => {
    return isActive ? "default" : "destructive"
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <CardTitle>Informasi Driver</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nama Lengkap</p>
                    <p className="text-lg font-semibold">{driver.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ID Karyawan</p>
                    <p className="text-sm">{driver.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">No. Telepon</p>
                    <p className="text-sm">{driver.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(driver.isActive)}
                      <Badge variant={getStatusVariant(driver.isActive)}>
                        {getStatusText(driver.isActive)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-4">
                  {driver.email && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm">{driver.email}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">No. SIM</p>
                    <p className="text-sm">{driver.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Jenis SIM</p>
                    <Badge variant="outline">{formatLicenseType(driver.licenseType)}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Berlaku Hingga</p>
                    <p className="text-sm">{formatDateShort(driver.licenseExpiry)}</p>
                  </div>
                </div>
              </div>

              {driver.address && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Alamat</p>
                    <p className="text-sm">{driver.address}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {(driver.emergencyContact || driver.emergencyPhone) && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <CardTitle>Kontak Darurat</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {driver.emergencyContact && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nama</p>
                        <p className="text-sm">{driver.emergencyContact}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {driver.emergencyPhone && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">No. Telepon</p>
                        <p className="text-sm">{driver.emergencyPhone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {driver.notes && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <CardTitle>Catatan</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{driver.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <CardTitle>Statistik Kinerja</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{driver.totalDeliveries || 0}</div>
                <div className="text-sm text-muted-foreground">Total Pengiriman</div>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dibuat</p>
                <p className="text-sm">{formatDate(driver.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Terakhir Diperbarui</p>
                <p className="text-sm">{formatDate(driver.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Driver Distributions */}
          <DriverDistributionsCard driverId={driverId} />

          {/* Driver Deliveries */}
          <DriverDeliveriesCard driverId={driverId} />
        </div>
      </div>
    </div>
  )
}
