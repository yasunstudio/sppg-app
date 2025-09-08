import { WastePageClient } from "./components/waste-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Waste Management - Environmental Operations | SPPG Management System",
  description: "Comprehensive waste management dashboard for SPPG food distribution network. Monitor waste generation, track reduction initiatives, manage disposal operations, and oversee environmental compliance with advanced analytics and reporting.",
  keywords: [
    // Primary keywords
    "waste management", "environmental management", "waste dashboard", "waste operations",
    "waste tracking", "waste reduction", "environmental compliance", "waste analytics",
    
    // Secondary keywords
    "food waste management", "waste monitoring", "disposal tracking", "waste reporting",
    "sustainability metrics", "waste optimization", "environmental impact", "waste control",
    
    // SPPG specific
    "SPPG waste management", "school food waste", "institutional waste tracking",
    "food service waste", "kitchen waste management", "cafeteria waste monitoring",
    
    // Technical keywords
    "waste management system", "waste tracking software", "environmental dashboard",
    "waste data analytics", "waste management platform", "sustainability reporting"
  ],
  openGraph: {
    title: "Waste Management Dashboard - SPPG Management System",
    description: "Monitor and manage waste operations with comprehensive tracking, analytics, and reporting tools for sustainable food service operations.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function WasteManagementPage() {
  return (
    <PermissionGuard permission="waste.view" redirectTo="/dashboard">
      <WastePageClient />
    </PermissionGuard>
  )
}
