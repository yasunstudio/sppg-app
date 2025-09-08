"use client"

import { Suspense } from "react"
import { PageContainer } from "@/components/layout/page-container"
import { CreateWasteRecord } from "./create-waste-record"
import { WasteCreateActions } from "./waste-create-actions"
import { Recycle } from "lucide-react"

function CreateWasteRecordSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-muted animate-pulse rounded-lg h-16" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-muted animate-pulse rounded-lg h-96" />
        <div className="bg-muted animate-pulse rounded-lg h-96" />
      </div>
    </div>
  )
}

export function WasteCreatePageClient() {
  return (
    <PageContainer
      title="Create New Waste Record"
      description="Add a new waste management record to track waste generation and disposal"
      showBreadcrumb={true}
    >
      <Suspense fallback={<CreateWasteRecordSkeleton />}>
        <CreateWasteRecord />
      </Suspense>
    </PageContainer>
  )
}
