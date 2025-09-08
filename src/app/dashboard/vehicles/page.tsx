import { VehiclePageClient } from "./components/vehicle-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vehicle Management - Fleet Operations | SPPG Management System",
  description: "Comprehensive fleet management dashboard for SPPG food distribution network. Monitor vehicle status, track maintenance schedules, manage delivery operations, and oversee the complete vehicle lifecycle with advanced analytics and reporting.",
  keywords: [
    // Primary keywords
    "vehicle management", "fleet management", "vehicle dashboard", "fleet operations",
    // Indonesian keywords
    "manajemen kendaraan", "manajemen armada", "dashboard kendaraan", "operasi armada",
    // SPPG specific
    "SPPG fleet", "food distribution vehicles", "delivery management", "SPPG logistics",
    // Technical keywords
    "vehicle tracking", "maintenance scheduling", "fleet analytics", "vehicle monitoring",
    // Process keywords
    "delivery operations", "route optimization", "vehicle status", "fleet performance",
    // Feature keywords
    "real-time tracking", "maintenance alerts", "operational efficiency", "fleet reporting"
  ],
  openGraph: {
    title: "Vehicle Management - SPPG Fleet Operations",
    description: "Manage your complete fleet of vehicles for SPPG food distribution network with advanced tracking, maintenance, and operational tools.",
    type: "website",
    siteName: "SPPG Management System",
    locale: "id_ID",
    url: "/dashboard/vehicles",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vehicle Management - SPPG Fleet Operations",
    description: "Comprehensive fleet management for food distribution network.",
  },
  robots: {
    index: false, // Private admin dashboard
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  alternates: {
    canonical: "/dashboard/vehicles",
  },
  other: {
    "application-name": "SPPG Management System",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SPPG Fleet Dashboard",
  }
}

export default function VehiclesPage() {
  return (
    <PermissionGuard permission="production.view" redirectTo="/dashboard">
      <VehiclePageClient />
    </PermissionGuard>
  )
}
