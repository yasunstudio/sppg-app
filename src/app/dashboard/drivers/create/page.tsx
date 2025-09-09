import { DriverCreatePageClient } from "../components/driver-create-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add New Driver - Transportation Management | SPPG Management System",
  description: "Register a new driver to your transportation management system. Add complete driver details including licenses, contact information, emergency contacts, and operational parameters for SPPG food distribution network.",
  keywords: [
    // Primary keywords
    "add driver", "new driver registration", "driver form", "transportation expansion",
    // Indonesian keywords
    "tambah driver", "registrasi driver baru", "form driver", "ekspansi transportasi",
    // SPPG specific
    "SPPG driver registration", "food distribution driver", "delivery driver registration",
    // Technical keywords
    "driver management system", "transportation database", "driver licenses",
    // Process keywords
    "driver onboarding", "transportation registration process", "driver documentation",
    // Feature keywords
    "license management", "driver tracking setup", "emergency contacts"
  ],
  openGraph: {
    title: "Add New Driver - SPPG Transportation Management",
    description: "Register a new driver for SPPG food distribution network. Complete driver registration with licenses and contact information.",
    type: "website",
    siteName: "SPPG Management System",
    locale: "id_ID",
    url: "/dashboard/drivers/create",
  },
  twitter: {
    card: "summary",
    title: "Add New Driver - SPPG Transportation Management",
    description: "Register a new driver for SPPG food distribution network.",
  },
  robots: {
    index: false, // Private admin form
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  alternates: {
    canonical: "/dashboard/drivers/create",
  },
  other: {
    "application-name": "SPPG Management System",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SPPG Driver Registration",
  }
}

export default function CreateDriverPage() {
  return (
    <PermissionGuard permission="production.view" redirectTo="/dashboard/drivers">
      <DriverCreatePageClient />
    </PermissionGuard>
  )
}
