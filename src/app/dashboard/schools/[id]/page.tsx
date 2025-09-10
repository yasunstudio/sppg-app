import { SchoolDetails } from "../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { PageContainer } from "@/components/layout"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

interface SchoolDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: SchoolDetailPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    // Fetch school data for dynamic metadata
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/schools/${id}`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data) {
        const school = result.data
        return {
          title: `${school.name} - Detail Sekolah | SPPG Management System`,
          description: `Detail lengkap sekolah ${school.name} dengan kepala sekolah ${school.principalName}. Lihat informasi lokasi, jumlah siswa ${school.studentCount} orang, dan data lengkap untuk sistem manajemen pendidikan SPPG.`,
          keywords: [
            // Primary keywords
            "detail sekolah", "informasi sekolah", school.name, school.principalName,
            "data sekolah", "profil sekolah", "manajemen sekolah SPPG",
            
            // Location-based keywords
            school.address, school.district, school.city, school.province,
            "sekolah " + school.district, "pendidikan " + school.city,
            
            // Educational keywords
            "sistem pendidikan", "manajemen pendidikan", "database sekolah",
            "informasi pendidikan", "data siswa", "administrasi sekolah",
            
            // SPPG specific
            "SPPG school", "sistem pendidikan nasional", "manajemen sekolah digital",
            "platform pendidikan", "database sekolah nasional"
          ],
          openGraph: {
            title: `${school.name} - Detail Sekolah | SPPG Management System`,
            description: `Detail lengkap sekolah ${school.name} dengan kepala sekolah ${school.principalName}. ${school.studentCount} siswa terdaftar di sistem SPPG.`,
            type: 'website',
            siteName: 'SPPG Management System',
          },
          twitter: {
            card: 'summary',
            title: `${school.name} - Detail Sekolah`,
            description: `Detail sekolah ${school.name}, ${school.studentCount} siswa.`,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching school data for metadata:', error)
  }
  
  // Fallback metadata
  return {
    title: "Detail Sekolah - SPPG Management System",
    description: "Lihat detail lengkap informasi sekolah dalam sistem manajemen pendidikan SPPG.",
    keywords: [
      "detail sekolah", "informasi sekolah", "data sekolah", "profil sekolah",
      "manajemen sekolah", "sistem pendidikan", "SPPG", "administrasi sekolah"
    ]
  }
}

export default async function SchoolDetailPage({ params }: SchoolDetailPageProps) {
  const { id } = await params

  return (
    <PermissionGuard 
      permission="schools.view"
      fallback={<div>Anda tidak memiliki akses untuk melihat detail sekolah.</div>}
    >
      <PageContainer>
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/schools">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Daftar
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Detail Sekolah</h1>
            </div>
            
            <Button asChild>
              <Link href={`/dashboard/schools/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Sekolah
              </Link>
            </Button>
          </div>

          {/* School Details Component */}
          <SchoolDetails schoolId={id} />
        </div>
      </PageContainer>
    </PermissionGuard>
  )
}
