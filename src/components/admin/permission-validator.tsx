'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Temporary stub until we fix the full component
export function PermissionValidator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission Validator</CardTitle>
        <CardDescription>
          Component temporarily disabled during migration to database-driven permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This component will be re-enabled after permission hooks are fully migrated.
        </p>
      </CardContent>
    </Card>
  )
}
