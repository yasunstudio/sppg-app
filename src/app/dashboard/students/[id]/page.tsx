import { StudentDetails } from "../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { PageContainer } from "@/components/layout"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

interface StudentDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: StudentDetailPageProps): Promise<Metadata> {
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
          title: `${student.name} - Detail Siswa | SPPG Management System`,
          description: `Detail lengkap siswa ${student.name} dari ${student.school?.name || 'sekolah'}. Lihat informasi kelas ${student.grade}, status alergi, dan data lengkap untuk sistem manajemen pendidikan SPPG.`,
          keywords: [
            // Primary keywords
            "detail siswa", "informasi siswa", student.name, student.school?.name,
            "data siswa", "profil siswa", "manajemen siswa SPPG",
            
            // Educational keywords
            `kelas ${student.grade}`, "siswa kelas " + student.grade,
            "data pendidikan", "informasi pendidikan", "administrasi siswa",
            
            // Health-related keywords
            student.allergies ? "alergi makanan" : "tanpa alergi",
            "kesehatan siswa", "data kesehatan", "informasi medis siswa",
            
            // SPPG specific
            "SPPG student", "sistem pendidikan nasional", "manajemen siswa digital",
            "platform pendidikan", "database siswa nasional", "SPPG nutrition"
          ],
          openGraph: {
            title: `${student.name} - Detail Siswa | SPPG Management System`,
            description: `Detail lengkap siswa ${student.name} kelas ${student.grade} dari ${student.school?.name || 'sekolah'}. ${student.allergies ? 'Memiliki alergi makanan' : 'Tidak ada alergi makanan'}.`,
            type: 'website',
            siteName: 'SPPG Management System',
          },
          twitter: {
            card: 'summary',
            title: `${student.name} - Detail Siswa`,
            description: `Detail siswa ${student.name}, kelas ${student.grade}.`,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching student data for metadata:', error)
  }
  
  // Fallback metadata
  return {
    title: "Detail Siswa - SPPG Management System",
    description: "Lihat detail lengkap informasi siswa dalam sistem manajemen pendidikan SPPG.",
    keywords: [
      "detail siswa", "informasi siswa", "data siswa", "profil siswa",
      "manajemen siswa", "sistem pendidikan", "SPPG", "administrasi siswa"
    ]
  }
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params

  return (
    <PermissionGuard 
      permission="students.view"
      fallback={<div>Anda tidak memiliki akses untuk melihat detail siswa.</div>}
    >
      <PageContainer>
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/students">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Daftar
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Detail Siswa</h1>
            </div>
            
            <Button asChild>
              <Link href={`/dashboard/students/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Siswa
              </Link>
            </Button>
          </div>

          {/* Student Details Component */}
          <StudentDetails studentId={id} />
        </div>
      </PageContainer>
    </PermissionGuard>
  )
}
