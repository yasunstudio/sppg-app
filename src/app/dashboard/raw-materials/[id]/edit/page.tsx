import { Metadata } from "next"
import { RawMaterialEdit } from "../../components/raw-material-edit"

export const metadata: Metadata = {
  title: "Edit Raw Material | SPPG",
  description: "Edit raw material information and nutritional data",
}

export default async function RawMaterialEditPage() {
  return <RawMaterialEdit />
}
