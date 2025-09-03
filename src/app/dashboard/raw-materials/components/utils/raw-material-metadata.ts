import { Metadata } from "next"

interface RawMaterialMetadataParams {
  id?: string
  name?: string
  category?: string
  description?: string
}

export function generateRawMaterialMetadata(
  type: 'list' | 'detail' | 'create' | 'edit',
  params?: RawMaterialMetadataParams
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sppg-app.com'
  
  switch (type) {
    case 'list':
      return {
        title: "Manajemen Bahan Baku | SPPG",
        description: "Sistem manajemen bahan baku komprehensif untuk aplikasi SPPG dengan fitur pencarian, filter, dan pagination.",
        keywords: ["bahan baku", "raw materials", "manajemen", "SPPG", "sekolah", "inventori", "stok"],
        openGraph: {
          title: "Manajemen Bahan Baku | SPPG",
          description: "Kelola data bahan baku untuk produksi makanan sekolah",
          type: "website",
          url: `${baseUrl}/dashboard/raw-materials`,
        },
        robots: {
          index: false, // Internal app pages should not be indexed
          follow: false,
        },
        alternates: {
          canonical: `${baseUrl}/dashboard/raw-materials`,
        }
      }

    case 'detail':
      const detailTitle = params?.name 
        ? `${params.name} - Detail Bahan Baku | SPPG`
        : "Detail Bahan Baku | SPPG"
      
      const detailDescription = params?.name && params?.category
        ? `Detail lengkap bahan baku ${params.name} kategori ${params.category} termasuk informasi nutrisi, stok, dan riwayat penggunaan`
        : "Lihat detail lengkap bahan baku termasuk informasi nutrisi, stok, dan riwayat penggunaan"

      return {
        title: detailTitle,
        description: detailDescription,
        keywords: [
          "detail bahan baku", 
          "informasi nutrisi", 
          "stok", 
          "SPPG",
          ...(params?.name ? [params.name] : []),
          ...(params?.category ? [params.category] : [])
        ],
        openGraph: {
          title: detailTitle,
          description: detailDescription,
          type: "website",
          url: params?.id ? `${baseUrl}/dashboard/raw-materials/${params.id}` : undefined,
        },
        robots: {
          index: false,
          follow: false,
        }
      }

    case 'create':
      return {
        title: "Tambah Bahan Baku Baru | SPPG",
        description: "Tambah bahan baku baru dengan informasi nutrisi yang lengkap untuk produksi makanan sekolah",
        keywords: ["tambah bahan baku", "raw material baru", "nutrisi", "SPPG", "inventori"],
        openGraph: {
          title: "Tambah Bahan Baku Baru | SPPG",
          description: "Form untuk menambahkan bahan baku baru ke sistem SPPG",
          type: "website",
          url: `${baseUrl}/dashboard/raw-materials/create`,
        },
        robots: {
          index: false,
          follow: false,
        }
      }

    case 'edit':
      const editTitle = params?.name 
        ? `Edit ${params.name} - Bahan Baku | SPPG`
        : "Edit Bahan Baku | SPPG"
      
      const editDescription = params?.name
        ? `Edit informasi bahan baku ${params.name} dan data nutrisi untuk produksi makanan sekolah`
        : "Edit informasi bahan baku dan data nutrisi untuk produksi makanan sekolah"

      return {
        title: editTitle,
        description: editDescription,
        keywords: [
          "edit bahan baku", 
          "update nutrisi", 
          "SPPG", 
          "inventori",
          ...(params?.name ? [params.name] : [])
        ],
        openGraph: {
          title: editTitle,
          description: editDescription,
          type: "website",
          url: params?.id ? `${baseUrl}/dashboard/raw-materials/${params.id}/edit` : undefined,
        },
        robots: {
          index: false,
          follow: false,
        }
      }

    default:
      return {
        title: "Bahan Baku | SPPG",
        description: "Sistem manajemen bahan baku SPPG",
      }
  }
}

// SEO-friendly utilities
export function generateRawMaterialBreadcrumbs(
  type: 'list' | 'detail' | 'create' | 'edit',
  params?: RawMaterialMetadataParams
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sppg-app.com'
  
  const breadcrumbs = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Dashboard",
      "item": `${baseUrl}/dashboard`
    },
    {
      "@type": "ListItem", 
      "position": 2,
      "name": "Bahan Baku",
      "item": `${baseUrl}/dashboard/raw-materials`
    }
  ]

  switch (type) {
    case 'detail':
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 3,
        "name": params?.name || "Detail",
        "item": params?.id ? `${baseUrl}/dashboard/raw-materials/${params.id}` : ""
      })
      break
      
    case 'create':
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 3,
        "name": "Tambah Baru",
        "item": `${baseUrl}/dashboard/raw-materials/create`
      })
      break
      
    case 'edit':
      if (params?.id && params?.name) {
        breadcrumbs.push(
          {
            "@type": "ListItem",
            "position": 3,
            "name": params.name,
            "item": `${baseUrl}/dashboard/raw-materials/${params.id}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Edit",
            "item": `${baseUrl}/dashboard/raw-materials/${params.id}/edit`
          }
        )
      }
      break
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs
  }
}

export function generateRawMaterialStructuredData(params?: RawMaterialMetadataParams) {
  if (!params?.name) return null

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": params.name,
    "description": params.description || `Bahan baku ${params.name} untuk produksi makanan sekolah`,
    "category": params.category || "Bahan Baku",
    "brand": {
      "@type": "Organization", 
      "name": "SPPG"
    }
  }
}
