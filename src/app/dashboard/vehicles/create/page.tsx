import { VehicleCreatePageClient } from "../components/vehicle-create-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add New Vehicle - Fleet Management | SPPG Management System",
  description: "Register a new vehicle to your fleet management system. Add complete vehicle details including specifications, documentation, maintenance schedules, and operational parameters for SPPG food distribution network.",
  keywords: [
    // Primary keywords
    "add vehicle", "new vehicle registration", "vehicle form", "fleet expansion",
    // Indonesian keywords
    "tambah kendaraan", "registrasi kendaraan baru", "form kendaraan", "ekspansi armada",
    // SPPG specific
    "SPPG vehicle registration", "food distribution vehicle", "delivery truck registration",
    // Technical keywords
    "vehicle management system", "fleet database", "vehicle specifications",
    // Process keywords
    "vehicle onboarding", "fleet registration process", "vehicle documentation",
    // Feature keywords
    "maintenance scheduling", "vehicle tracking setup", "operational parameters"
  ],
  openGraph: {
    title: "Add New Vehicle - SPPG Fleet Management",
    description: "Register a new vehicle for SPPG food distribution network. Complete vehicle registration with specifications and maintenance setup.",
    type: "website",
    siteName: "SPPG Management System",
    locale: "id_ID",
    url: "/dashboard/vehicles/create",
  },
  twitter: {
    card: "summary",
    title: "Add New Vehicle - SPPG Fleet Management",
    description: "Register a new vehicle for SPPG food distribution network.",
  },
  robots: {
    index: false, // Private admin form
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  alternates: {
    canonical: "/dashboard/vehicles/create",
  },
  other: {
    "application-name": "SPPG Management System",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SPPG Vehicle Registration",
  }
}

export default function CreateVehiclePage() {
  return (
    <PermissionGuard permission="production.view" redirectTo="/dashboard/vehicles">
      <VehicleCreatePageClient />
    </PermissionGuard>
  )
}
