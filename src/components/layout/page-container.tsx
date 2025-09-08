"use client"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

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

  // Generate breadcrumb from pathname
  const generateBreadcrumb = () => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbItems = []

    // Add dashboard home
    breadcrumbItems.push({
      href: '/dashboard',
      label: 'Dashboard',
      isHome: true
    })

    let currentPath = ''
    for (let i = 1; i < paths.length; i++) {
      currentPath += `/${paths[i]}`
      const isLast = i === paths.length - 1
      
      breadcrumbItems.push({
        href: currentPath,
        label: paths[i].charAt(0).toUpperCase() + paths[i].slice(1).replace(/-/g, ' '),
        isLast
      })
    }

    return breadcrumbItems
  }

  const breadcrumbItems = generateBreadcrumb()

  return (
    <div className={cn(
      "space-y-8",
      fullWidth ? "w-full" : "w-full",
      noPadding ? "" : "",
      className
    )}>
      {/* Simple Breadcrumb */}
      {showBreadcrumb && breadcrumbItems.length > 1 && (
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
            {breadcrumbItems.map((item, index) => (
              <li key={item.href} className="inline-flex items-center gap-1.5">
                {index > 0 && (
                  <span role="presentation" aria-hidden="true" className="[&>svg]:size-3.5">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
                {item.isLast ? (
                  <span 
                    role="link" 
                    aria-disabled="true" 
                    aria-current="page" 
                    className="font-medium text-foreground"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    href={item.href} 
                    className="flex items-center gap-1.5 transition-colors hover:text-foreground focus:text-foreground focus:outline-none"
                  >
                    {item.isHome && <Home className="h-4 w-4" />}
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header Section */}
      {(title || actions) && (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            {title && (
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3 shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="space-y-8">
        {children}
      </div>
    </div>
  )
}
