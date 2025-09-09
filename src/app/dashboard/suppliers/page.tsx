import { Metadata } from "next"
import { SupplierPageClient } from "./components/supplier-page-client"
import { PermissionGuard } from '@/components/guards/permission-guard'

export const metadata: Metadata = {
  title: "Supplier Management - Supply Chain | SPPG Management System",
  description: "Comprehensive supplier management system for SPPG with advanced search, filtering, and pagination capabilities. Manage supplier partnerships, contact information, and business relationships for efficient food distribution network.",
  keywords: [
    // Primary keywords
    "supplier management", "supply chain", "supplier database", "business partnerships",
    // Indonesian keywords
    "manajemen supplier", "rantai pasok", "database supplier", "kemitraan bisnis",
    // SPPG specific
    "SPPG suppliers", "food distribution suppliers", "meal provider management",
    // Technical keywords
    "supplier system", "supply chain management", "business directory",
    // Feature keywords
    "supplier search", "contact management", "partnership tracking", "supplier filtering"
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
    title: "Supplier Management | SPPG Management System",
    description: "Comprehensive supplier management for efficient food distribution and supply chain operations.",
    type: "website",
    siteName: "SPPG Management System",
  },
  twitter: {
    card: "summary",
    title: "Supplier Management | SPPG Management System",
    description: "Comprehensive supplier management for efficient food distribution and supply chain operations.",
  }
}

export default async function SuppliersPage() {
  return (
    <PermissionGuard permission="suppliers.view">
      <SupplierPageClient />
    </PermissionGuard>
  )
}
