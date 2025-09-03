import { Metadata } from 'next'
import { DistributionSchoolsList } from '../components'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { PermissionGuard } from '@/components/guards/permission-guard'

export const metadata: Metadata = {
  title: 'Distribution Schools | SPPG Dashboard',
  description: 'Manage school-specific distribution tracking and delivery confirmation'
}

export default function DistributionSchoolsPage() {
  return (
    <PermissionGuard permission="distributions.view">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Distribution Schools</h1>
            <p className="text-muted-foreground">
              Manage school-specific distribution tracking and delivery confirmation
            </p>
          </div>
          <PermissionGuard permission="distributions.create">
            <Link href="/dashboard/distributions/schools/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Distribution Schools
              </Button>
            </Link>
          </PermissionGuard>
        </div>

        {/* Main Content */}
        <DistributionSchoolsList />
      </div>
    </PermissionGuard>
  )
}
