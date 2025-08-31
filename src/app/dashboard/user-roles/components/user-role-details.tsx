"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  User,
  Shield,
  Mail,
  Calendar,
  Edit,
  RefreshCw
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  createdAt: string
  roles: {
    role: {
      id: string
      name: string
      description: string | null
      permissions: string[]
    }
    assignedAt: string
  }[]
}

interface UserRoleDetailsProps {
  userId: string
}

export function UserRoleDetails({ userId }: UserRoleDetailsProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserDetails = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/users/${userId}?include=roles`)
      if (response.ok) {
        const result = await response.json()
        setUser(result.user || result.data)
      } else if (response.status === 404) {
        setError('User not found')
      } else {
        setError('Failed to fetch user details')
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      setError('Error fetching user details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [userId])

  const handleRefresh = () => {
    setLoading(true)
    fetchUserDetails()
  }

  const handleEditRoles = () => {
    router.push(`/dashboard/user-roles/${userId}/edit`)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading user details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-lg">⚠️</div>
            <p className="text-red-600">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">User not found</p>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <User className="w-8 h-8" />
              User Role Details
            </h1>
            <p className="text-muted-foreground">
              View detailed role information for this user
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleEditRoles}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Roles
          </Button>
        </div>
      </div>

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="text-lg">
                  {user.name?.charAt(0) || user.email.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Assigned Roles ({user.roles.length})
          </CardTitle>
          <CardDescription>
            Roles and permissions assigned to this user
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.roles.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No roles assigned to this user</p>
              <Button 
                className="mt-4" 
                onClick={handleEditRoles}
              >
                <Edit className="h-4 w-4 mr-2" />
                Assign Roles
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {user.roles.map((userRole, index) => (
                <div key={userRole.role.id}>
                  <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default" className="font-medium">
                          {userRole.role.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Assigned {new Date(userRole.assignedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {userRole.role.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {userRole.role.description}
                        </p>
                      )}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Permissions:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {userRole.role.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < user.roles.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleEditRoles}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Roles
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/user-roles">
                View All Users
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/roles">
                Manage Roles
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
