'use client'

import { DistributionTracking } from '../components/distribution-tracking'

export default function TrackingPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Distribution Tracking</h1>
        <p className="text-muted-foreground">
          Monitor real-time delivery progress and status
        </p>
      </div>
      <DistributionTracking />
    </div>
  )
}
