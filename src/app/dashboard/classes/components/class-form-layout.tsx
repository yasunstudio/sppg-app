"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ClassFormLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export function ClassFormLayout({ title, description, children, actions }: ClassFormLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>

      {/* Form Content */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kelas</CardTitle>
            <CardDescription>
              Lengkapi form berikut untuk mengelola data kelas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
