'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ChevronRight, Truck } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  key: string
  isLast: boolean
  renderIcon?: string
}

interface PageContainerProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
  showBreadcrumb?: boolean
  fullWidth?: boolean
  noPadding?: boolean
  actions?: React.ReactNode
}

export function PageContainer({ 
  children, 
  title,
  description,
  className,
  showBreadcrumb = true,
  fullWidth = false,
  noPadding = false,
  actions
}: PageContainerProps) {
  const pathname = usePathname()
  const [vehicleData, setVehicleData] = useState<{plateNumber: string} | null>(null)

  // Auto-generate dynamic title and description for vehicles pages
  const getPageInfo = () => {
    // Use provided title/description if available, otherwise auto-generate
    if (title || description) {
      return { title, description }
    }

    // Auto-generate for vehicles pages
    if (pathname.includes('/vehicles')) {
      if (pathname === '/vehicles' || pathname === '/dashboard/vehicles') {
        return {
          title: "Manajemen Kendaraan",
          description: "Kelola armada kendaraan, lacak jadwal perawatan, dan monitor status pengiriman."
        }
      }
      
      if (pathname.includes('/create')) {
        return {
          title: "Tambah Kendaraan Baru",
          description: "Daftarkan kendaraan baru ke dalam sistem manajemen armada."
        }
      }
      
      if (pathname.includes('/edit')) {
        return {
          title: vehicleData?.plateNumber ? `Edit ${vehicleData.plateNumber}` : "Edit Kendaraan",
          description: "Perbarui informasi kendaraan dan pengaturan perawatan."
        }
      }
      
      // Detail page with UUID
      const pathParts = pathname.split('/').filter(Boolean)
      const hasUUID = pathParts.some(part => 
        part.match(/^[a-f0-9\-]{36}$/) || part.match(/^[a-z0-9]{25}$/)
      )
      if (hasUUID && !pathname.includes('/edit') && !pathname.includes('/create')) {
        return {
          title: vehicleData?.plateNumber ? `Detail ${vehicleData.plateNumber}` : "Detail Kendaraan",
          description: "Informasi lengkap kendaraan dan riwayat perawatan."
        }
      }
    }

    return { title, description }
  }

  const pageInfo = getPageInfo()

  // Fetch vehicle data for breadcrumb if this is a detail page
  useEffect(() => {
    const paths = pathname.split('/').filter(Boolean)
    
    // Check if this is a vehicles detail or edit page with UUID
    if (paths.includes('vehicles')) {
      const vehicleIndex = paths.indexOf('vehicles')
      const potentialId = paths[vehicleIndex + 1]
      
      // Check if it's a UUID (vehicle detail/edit page) - IMPROVED PATTERN
      if (potentialId && (potentialId.match(/^[a-f0-9\-]{36}$/) || potentialId.match(/^[a-z0-9]{25}$/))) {
        fetch(`/api/vehicles/${potentialId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.data) {
              setVehicleData({ plateNumber: data.data.plateNumber })
            }
          })
          .catch(err => console.error('Error fetching vehicle for breadcrumb:', err))
      }
    }
  }, [pathname])

  // Generate breadcrumb from pathname - Dark/Light Mode Compatible
  const generateBreadcrumb = () => {
    // Helper to check if path is vehicles-related
    const isVehiclesPath = pathname.includes('/vehicles')
    
    if (!isVehiclesPath) {
      return []
    }

    // Vehicles main page - NO BREADCRUMB
    if (pathname === '/vehicles' || pathname === '/dashboard/vehicles') {
      return []
    }
    
    // Create vehicle page
    if (pathname.endsWith('/create') || pathname.includes('/create')) {
      return [
        { label: "Kendaraan", href: "/vehicles", key: "1", isLast: false, renderIcon: "Truck" },
        { label: "Tambah Baru", href: undefined, key: "2", isLast: true, renderIcon: undefined }
      ]
    }
    
    // Edit vehicle page - check for /edit at the end
    if (pathname.endsWith('/edit') || pathname.includes('/edit')) {
      const pathParts = pathname.split('/')
      const vehicleIdIndex = pathParts.findIndex(part => 
        part.match(/^[a-f0-9\-]{36}$/) || part.match(/^[a-z0-9]{25}$/)
      )
      const vehicleId = vehicleIdIndex !== -1 ? pathParts[vehicleIdIndex] : null
      const detailPath = vehicleId ? `/vehicles/${vehicleId}` : undefined
      
      return [
        { label: "Kendaraan", href: "/vehicles", key: "1", isLast: false, renderIcon: "Truck" },
        { label: vehicleData?.plateNumber || "Detail", href: detailPath, key: "2", isLast: false, renderIcon: undefined },
        { label: "Edit", href: undefined, key: "3", isLast: true, renderIcon: undefined }
      ]
    }
    
    // Vehicle detail page - contains UUID but NOT create/edit
    const pathParts = pathname.split('/').filter(Boolean)
    const hasUUID = pathParts.some(part => 
      part.match(/^[a-f0-9\-]{36}$/) || part.match(/^[a-z0-9]{25}$/)
    )
    const isDetailPage = hasUUID && !pathname.includes('/edit') && !pathname.includes('/create')
    
    if (isDetailPage) {
      return [
        { label: "Kendaraan", href: "/vehicles", key: "1", isLast: false, renderIcon: "Truck" },
        { label: vehicleData?.plateNumber || "Detail Kendaraan", href: undefined, key: "2", isLast: true, renderIcon: undefined }
      ]
    }
    
    return []
  }

  const breadcrumbItems = generateBreadcrumb()

  return (
    <div className={cn(
      "space-y-8",
      fullWidth ? "w-full" : "w-full",
      noPadding ? "" : "",
      className
    )}>
      {/* Professional Breadcrumb - Dark/Light Mode Compatible */}
      {showBreadcrumb && breadcrumbItems.length >= 1 && (
        <div className="border-b border-border bg-background">
          <div className="px-6 py-4">
            <nav aria-label="breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbItems.map((item, index) => (
                  <li key={item.key || `breadcrumb-${item.label}-${index}`} className="flex items-center">
                    {/* Icon for first item */}
                    {index === 0 && item.renderIcon === "Truck" && (
                      <Truck className="h-4 w-4 text-primary mr-2" />
                    )}
                    
                    {/* Separator */}
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
                    )}
                    
                    {/* Breadcrumb Link/Text */}
                    {item.isLast ? (
                      <span className="font-medium text-foreground bg-muted px-3 py-1 rounded-md">
                        {item.label}
                      </span>
                    ) : (
                      <Link 
                        href={item.href || '#'} 
                        className="text-muted-foreground hover:text-primary hover:bg-muted px-3 py-1 rounded-md transition-all duration-200 font-medium"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      )}

      {/* Page Header */}
      {(pageInfo.title || pageInfo.description || actions) && (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {pageInfo.title && (
              <h1 className="text-2xl font-semibold tracking-tight">
                {pageInfo.title}
              </h1>
            )}
            {pageInfo.description && (
              <p className="text-sm text-muted-foreground">
                {pageInfo.description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Page Content */}
      <div className={cn(
        fullWidth ? "w-full" : "w-full",
        noPadding ? "" : ""
      )}>
        {children}
      </div>
    </div>
  )
}
