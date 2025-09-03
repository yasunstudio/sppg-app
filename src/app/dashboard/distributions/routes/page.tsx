'use client'

import { RoutePlanning } from '../components/route-planning'
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PermissionGuard } from '@/components/guards/permission-guard'

export default function RoutesPage() {
  return (
    <PermissionGuard permission="distributions.view">
      <RoutePlanning />
    </PermissionGuard>
  )
}
