import { Metadata } from "next"
import { RawMaterialDetails } from "../components/raw-material-details"

export const metadata: Metadata = {
  title: "Raw Material Details | SPPG",
  description: "View raw material details and nutritional information",
}

export default async function RawMaterialDetailsPage() {
  return <RawMaterialDetails />
}
