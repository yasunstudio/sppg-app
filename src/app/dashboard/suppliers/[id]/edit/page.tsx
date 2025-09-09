import { EditSupplier } from "../../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { PageContainer } from "@/components/layout"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditSupplierPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: EditSupplierPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    // Fetch supplier data for dynamic metadata
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/suppliers/${id}`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data) {
        const supplier = result.data
        return {
          title: `Edit ${supplier.name} - Supplier Management | SPPG Supply Chain System`,
          description: `Edit comprehensive supplier information for ${supplier.name}. Update contact details, business specifications, partnership status, and operational parameters for SPPG food distribution network.`,
          keywords: [
            // Primary keywords
            "edit supplier", "supplier management", "business details", "contact information",
            // Indonesian keywords
            "edit supplier", "manajemen supplier", "detail bisnis", "informasi kontak",
            // SPPG specific
            `edit ${supplier.name}`, "SPPG supplier update", "supply chain management",
            // Technical keywords
            "supplier database", "business partnership", "contact management",
            // Process keywords
            "supplier modification", "business information update", "partnership management"
          ],
          authors: [{ name: "SPPG Management System" }],
          creator: "SPPG Management System",
          publisher: "SPPG Management System",
          robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
              index: false,
              follow: false,
              noimageindex: true,
            },
          },
          openGraph: {
            title: `Edit ${supplier.name} | SPPG Management System`,
            description: `Update comprehensive supplier information and business details for ${supplier.name} in the SPPG supply chain management system.`,
            type: "website",
            siteName: "SPPG Management System",
          },
          twitter: {
            card: "summary",
            title: `Edit ${supplier.name} | SPPG Management System`,
            description: `Update comprehensive supplier information and business details for ${supplier.name} in the SPPG supply chain management system.`,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching supplier for metadata:', error)
  }
  
  // Fallback metadata
  return {
    title: "Edit Supplier - Supply Chain Management | SPPG Management System",
    description: "Edit and update supplier information, contact details, and business specifications in the SPPG supply chain management system.",
    keywords: [
      // Primary keywords
      "edit supplier", "supplier management", "business details", "contact information",
      // Indonesian keywords
      "edit supplier", "manajemen supplier", "detail bisnis", "informasi kontak",
      // SPPG specific
      "SPPG supplier update", "supply chain management", "business partnership",
      // Technical keywords
      "supplier database", "business modification", "contact management",
      // Process keywords
      "supplier update", "business information change", "partnership management"
    ],
    authors: [{ name: "SPPG Management System" }],
    creator: "SPPG Management System",
    publisher: "SPPG Management System",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
    openGraph: {
      title: "Edit Supplier | SPPG Management System",
      description: "Edit and update supplier information, contact details, and business specifications in the SPPG supply chain management system.",
      type: "website",
      siteName: "SPPG Management System",
    },
    twitter: {
      card: "summary",
      title: "Edit Supplier | SPPG Management System",
      description: "Edit and update supplier information, contact details, and business specifications in the SPPG supply chain management system.",
    }
  }
}

export default async function SupplierEditPage({ params }: EditSupplierPageProps) {
  const { id } = await params
  
  return (
    <PermissionGuard permission="suppliers.manage">
      <PageContainer
        title="Edit Supplier"
        description="Perbarui informasi supplier dan detail kemitraan bisnis."
        showBreadcrumb={true}
        actions={
          <Link href="/suppliers">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar
            </Button>
          </Link>
        }
      >
        <EditSupplier supplierId={id} />
      </PageContainer>
    </PermissionGuard>
  )
}
