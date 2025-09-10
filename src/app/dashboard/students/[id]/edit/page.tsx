import { EditStudent } from "../../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { PageContainer } from "@/components/layout"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditStudentPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: EditStudentPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    // Fetch student data for dynamic metadata
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/students/${id}`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data) {
        const student = result.data
        return {
          title: `Edit ${student.name} - Manajemen Siswa | SPPG Management System`,
          description: `Edit informasi lengkap siswa ${student.name} kelas ${student.grade} dari ${student.school?.name || 'sekolah'}. Perbarui data kelas, alergi makanan, dan informasi administrasi untuk sistem manajemen pendidikan SPPG.`,
          keywords: [
            // Primary edit keywords
            "edit siswa", "ubah data siswa", "perbarui informasi siswa", student.name,
            "edit " + student.name, "update siswa", "modifikasi data siswa",
            
            // Educational keywords
            `edit kelas ${student.grade}`, "siswa kelas " + student.grade,
            "data pendidikan", "informasi pendidikan", "administrasi siswa",
            
            // Health-related keywords
            student.allergies ? "edit alergi makanan" : "data kesehatan siswa",
            "kesehatan siswa", "update data kesehatan", "informasi medis siswa",
            
            // School-specific keywords
            student.school?.name, "sekolah " + student.school?.name,
            
            // SPPG specific
            "SPPG student management", "sistem pendidikan", "manajemen siswa digital",
            "platform pendidikan", "edit data pendidikan", "update sistem siswa"
          ],
          openGraph: {
            title: `Edit ${student.name} - SPPG Student Management`,
            description: `Edit comprehensive student information for ${student.name}. Update grade, allergy information, school data, and administrative details.`,
            type: "website",
            siteName: "SPPG Management System",
            locale: "id_ID",
          },
          twitter: {
            card: "summary_large_image",
            title: `Edit ${student.name} - SPPG Student Management`,
            description: `Edit comprehensive student information for ${student.name}. Update grade, allergy information, school data, and administrative details.`,
          },
          robots: {
            index: false, // Edit pages typically shouldn't be indexed
            follow: true,
            noarchive: true,
            nosnippet: true,
            noimageindex: true,
          },
          alternates: {
            canonical: `${process.env.NEXTAUTH_URL}/dashboard/students/${id}/edit`,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching student data for metadata:', error)
  }
  
  // Fallback metadata
  return {
    title: "Edit Siswa - SPPG Management System",
    description: "Edit informasi siswa dalam sistem manajemen pendidikan SPPG. Perbarui data kelas, alergi, dan informasi pendidikan.",
    robots: {
      index: false,
      follow: true,
    }
  }
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params

  return (
    <PermissionGuard permission={['students.manage']}>
      <PageContainer
        title="Edit Siswa"
        description="Perbarui informasi siswa dalam sistem"
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link href={`/dashboard/students/${id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Detail
              </Link>
            </Button>
          </div>
        }
      >
        <EditStudent studentId={id} />
      </PageContainer>
    </PermissionGuard>
  )
}
