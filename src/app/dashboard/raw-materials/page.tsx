import { Metadata } from "next"
import { RawMaterialsManagement } from "./components/raw-materials-management"

export const metadata: Metadata = {
  title: "Raw Materials Management | SPPG",
  description: "Comprehensive raw materials management system for SPPG application.",
}

export default async function RawMaterialsPage() {
  return <RawMaterialsManagement />
}
