'use client'

import { RoutePlanning } from '../components/route-planning'

export default function RoutesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Route Planning</h1>
        <p className="text-muted-foreground">
          Plan and optimize delivery routes for maximum efficiency
        </p>
      </div>
      <RoutePlanning />
    </div>
  )
}
