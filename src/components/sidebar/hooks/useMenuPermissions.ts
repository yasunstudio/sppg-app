"use client"

import { useSession } from 'next-auth/react'
import { usePermission } from "@/hooks/use-permission"

export function useMenuPermissions() {
  const { data: session } = useSession()
  
  // Updated permissions list to match new permission templates
  const permissions = [
    'dashboard:view',
    'users:read', 'roles:view', 
    'schools:view', 'classes:view', 'students:view',
    'raw_materials:view', 'recipes:view', 'menu_planning:view', 
    'production_batches:view', 'production_resources:view', 
    'inventory:view', 'suppliers:view', 'purchase_orders:view',
    'distribution:view', 'vehicles:view', 'drivers:view', 
    'quality_standards:view', 'quality_checks:view', 'quality_checkpoints:view',
    'food_samples:view', 'nutrition_consultations:view',
    'notifications:view', 'analytics:view', 'monitoring:view', 
    'performance:view', 'financial:view', 'admin:access',
    'audit_logs:view', 'waste.view', 'items:view'
  ]
  
  const { hasPermission, isLoading } = usePermission(permissions)
  
  return {
    hasPermission,
    isLoading,
    isAuthenticated: !!session
  }
}
