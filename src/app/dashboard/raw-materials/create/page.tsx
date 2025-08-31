import { Metadata } from "next"
import { RawMaterialCreate } from "../components/raw-material-create"

export const metadata: Metadata = {
  title: "Create Raw Material | SPPG",
  description: "Create a new raw material with nutritional information",
}

export default async function RawMaterialCreatePage() {
  return <RawMaterialCreate />
}
