import { SupplierCreatePageClient } from "../components/supplier-create-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add New Supplier - Supply Chain Management | SPPG Management System",
  description: "Register a new supplier to your supply chain management system. Add complete supplier details including contact information, business specifications, and partnership parameters for SPPG food distribution network.",
  keywords: [
    // Primary keywords
    "add supplier", "new supplier registration", "supplier form", "supply chain expansion",
    // Indonesian keywords
    "tambah supplier", "registrasi supplier baru", "form supplier", "ekspansi rantai pasok",
    // SPPG specific
    "SPPG supplier registration", "food distribution supplier", "meal provider registration",
    // Technical keywords
    "supplier management system", "supply chain database", "supplier specifications",
    // Process keywords
    "supplier onboarding", "supply chain registration process", "supplier documentation",
    // Feature keywords
    "partnership management", "supplier tracking setup", "business parameters"
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
    title: "Add New Supplier | SPPG Management System",
    description: "Register a new supplier with complete business details and contact information for efficient supply chain management.",
    type: "website",
    siteName: "SPPG Management System",
  },
  twitter: {
    card: "summary",
    title: "Add New Supplier | SPPG Management System",
    description: "Register a new supplier with complete business details and contact information for efficient supply chain management.",
  }
}

export default async function SupplierCreatePage() {
  return (
    <PermissionGuard permission="production.view">
      <SupplierCreatePageClient />
    </PermissionGuard>
  )
}
