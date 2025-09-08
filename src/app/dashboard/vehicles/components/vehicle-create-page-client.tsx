"use client"

import { CreateVehicle } from "./create-vehicle"
import { PageContainer } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function VehicleCreatePageClient() {
  return (
    <PageContainer
      title="Add New Vehicle"
      description="Register a new vehicle to your fleet management system."
      showBreadcrumb={true}
      actions={
        <Link href="/dashboard/vehicles">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </Link>
      }
    >
      <CreateVehicle />
    </PageContainer>
  )
}
