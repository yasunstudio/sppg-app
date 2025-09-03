'use client'

import { DistributionTracking } from '../components/distribution-tracking'
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PermissionGuard } from '@/components/guards/permission-guard'

export default function TrackingPage() {
  return (
    <PermissionGuard permission="distributions.track">
      <DistributionTracking />
    </PermissionGuard>
  )
}
