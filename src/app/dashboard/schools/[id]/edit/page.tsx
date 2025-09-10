import { EditSchool } from "../../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { PageContainer } from "@/components/layout"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditSchoolPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: EditSchoolPageProps): Promise<Metadata> {
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
          title: `Edit ${school.name} - Manajemen Sekolah | SPPG Management System`,
          description: `Edit informasi lengkap sekolah ${school.name} dengan kepala sekolah ${school.principalName}. Perbarui data alamat, jumlah siswa, kontak, dan informasi administrasi untuk sistem manajemen pendidikan SPPG.`,
          keywords: [
            // Primary edit keywords
            "edit sekolah", "ubah data sekolah", "perbarui informasi sekolah", school.name,
            "edit " + school.name, "update sekolah", "modifikasi data sekolah",
            
            // Administrative keywords
            "administrasi sekolah", "manajemen data sekolah", "sistem sekolah",
            "database sekolah", "informasi sekolah", "profil sekolah",
            
            // Location-based keywords
            school.address, school.district, school.city, school.province,
            "sekolah " + school.district, "pendidikan " + school.city,
            
            // SPPG specific
            "SPPG school management", "sistem pendidikan", "manajemen sekolah digital",
            "platform pendidikan", "edit data pendidikan", "update sistem sekolah"
          ],
          openGraph: {
            title: `Edit ${school.name} - SPPG School Management`,
            description: `Edit comprehensive school information for ${school.name}. Update principal details, student count, contact information, and administrative data.`,
            type: "website",
            siteName: "SPPG Management System",
            locale: "id_ID",
          },
          twitter: {
            card: "summary_large_image",
            title: `Edit ${school.name} - SPPG School Management`,
            description: `Edit comprehensive school information for ${school.name}. Update principal details, student count, contact information, and administrative data.`,
          },
          robots: {
            index: false, // Edit pages typically shouldn't be indexed
            follow: true,
            noarchive: true,
            nosnippet: true,
            noimageindex: true,
          },
          alternates: {
            canonical: `${process.env.NEXTAUTH_URL}/dashboard/schools/${id}/edit`,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching school data for metadata:', error)
  }
  
  // Fallback metadata
  return {
    title: "Edit Sekolah - SPPG Management System",
    description: "Edit informasi sekolah dalam sistem manajemen pendidikan SPPG. Perbarui data administratif, kontak, dan informasi pendidikan.",
    robots: {
      index: false,
      follow: true,
    }
  }
}

export default async function EditSchoolPage({ params }: EditSchoolPageProps) {
  const { id } = await params

  return (
    <PermissionGuard permission={['schools.manage']}>
      <PageContainer
        title="Edit Sekolah"
        description="Perbarui informasi sekolah dalam sistem"
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link href={`/dashboard/schools/${id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Detail
              </Link>
            </Button>
          </div>
        }
      >
        <EditSchool schoolId={id} />
      </PageContainer>
    </PermissionGuard>
  )
}
