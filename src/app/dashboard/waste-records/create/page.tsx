import { WasteCreatePageClient } from "../components/waste-create-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add New Waste Record - Waste Management | SPPG Management System",
  description: "Create a new waste management record to track waste generation, types, sources, and disposal methods for SPPG food production facilities.",
  keywords: [
    // Primary keywords
    "add waste record", "new waste entry", "waste tracking", "waste documentation",
    // Indonesian keywords
    "tambah catatan limbah", "pencatatan limbah baru", "pelacakan limbah", "dokumentasi limbah",
    // SPPG specific
    "SPPG waste management", "food production waste", "kitchen waste tracking",
    // Technical keywords
    "waste management system", "waste database", "waste type classification",
    // Process keywords
    "waste monitoring", "waste reporting", "environmental compliance",
    // Feature keywords
    "organic waste", "inorganic waste", "packaging waste", "school leftover tracking"
  ],
  openGraph: {
    title: "Add New Waste Record - SPPG Waste Management",
    description: "Track and document waste generation from SPPG food production and distribution processes.",
    type: "website",
    siteName: "SPPG Management System",
    locale: "id_ID",
    url: "/dashboard/waste-management/create",
  },
  twitter: {
    card: "summary_large_image",
    title: "Add New Waste Record - SPPG Waste Management",
    description: "Track and document waste generation from SPPG food production processes.",
  },
  alternates: {
    canonical: "/dashboard/waste-management/create"
  },
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  }
}

export default function CreateWasteRecordPage() {
  return (
    <PermissionGuard permission="waste.create" redirectTo="/dashboard/waste-management">
      <WasteCreatePageClient />
    </PermissionGuard>
  )
}
