import { EditSystemConfig } from "../components/edit-system-config"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Edit System Configuration - System Management | SPPG Management System",
  description: "Edit and update system configuration settings for SPPG application. Modify configuration values, descriptions, and status to maintain optimal system performance.",
  keywords: [
    // Primary keywords
    "edit system config", "update system configuration", "modify system settings", "config management",
    // Indonesian keywords
    "edit konfigurasi sistem", "update pengaturan sistem", "ubah konfigurasi", "manajemen config",
    // SPPG specific
    "SPPG system config edit", "school system settings", "application parameters", "system admin",
    // Management keywords
    "configuration management", "system administration", "config modification", "settings update",
    // Action keywords
    "update configurations", "modify system settings", "edit configs", "change parameters",
    // Feature keywords
    "database config edit", "email settings update", "security config modification", "notification settings"
  ],
  openGraph: {
    title: "Edit System Configuration - SPPG",
    description: "Edit and update system configuration settings for optimal SPPG application performance.",
    type: "website",
  },
  alternates: {
    canonical: "/dashboard/system-config/edit",
  },
  other: {
    "application-name": "SPPG Management System",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SPPG Config Edit",
  }
}

interface SystemConfigEditPageProps {
  params: Promise<{ id: string }>
}

export default async function SystemConfigEditPage({ params }: SystemConfigEditPageProps) {
  const { id } = await params
  return (
    <PermissionGuard permission="production.view">
      <EditSystemConfig configId={id} />
    </PermissionGuard>
  )
}
