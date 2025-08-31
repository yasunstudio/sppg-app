// ============================================================================
// PERMISSION VALIDATION DASHBOARD (src/components/admin/permission-validator.tsx)
// ============================================================================

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { RefreshCw, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { usePermissionValidation } from '@/hooks/use-dynamic-permissions'
import { formatDistanceToNow } from 'date-fns'

export function PermissionValidator() {
  const {
    validation,
    loading,
    error,
    validatePermissions,
    refreshPermissions,
    isSuperAdmin
  } = usePermissionValidation()

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permission Validator
          </CardTitle>
          <CardDescription>
            Monitor and validate permission synchronization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You need SUPER_ADMIN privileges to access this feature.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permission Validator
          </CardTitle>
          <CardDescription>
            Monitor and validate permission synchronization between file and database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={validatePermissions} 
              disabled={loading}
              variant="outline"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Validate Permissions
            </Button>
            <Button 
              onClick={refreshPermissions} 
              disabled={loading}
              variant="default"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh & Validate
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validation && (
        <>
          {/* Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Permission Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {validation.stats.totalPermissions}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Permissions
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {validation.stats.totalRoles}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Roles
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(validation.stats.cacheAge / 1000)}s
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cache Age
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xs text-muted-foreground">
                    Last Update
                  </div>
                  <div className="text-sm font-medium">
                    {formatDistanceToNow(new Date(validation.stats.lastUpdate), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {validation.validation.isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                Validation Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {validation.validation.isValid ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Permissions Synchronized</AlertTitle>
                  <AlertDescription>
                    All permissions are properly synchronized between file and database.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Permission Mismatches Detected</AlertTitle>
                  <AlertDescription>
                    Found {validation.validation.mismatches.length} permission mismatches that need attention.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Mismatches Detail */}
          {!validation.validation.isValid && validation.validation.mismatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Permission Mismatches</CardTitle>
                <CardDescription>
                  Detailed breakdown of permission synchronization issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {validation.validation.mismatches.map((mismatch: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {mismatch.permission}
                        </Badge>
                        <Badge 
                          variant={
                            mismatch.type === 'missing_in_file' ? 'destructive' :
                            mismatch.type === 'missing_in_db' ? 'secondary' : 'default'
                          }
                        >
                          {mismatch.type.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground mb-1">
                            File Permissions:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {mismatch.fileRoles.length > 0 ? (
                              mismatch.fileRoles.map((role: string) => (
                                <Badge key={role} variant="outline" className="text-xs">
                                  {role}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-xs">None</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium text-muted-foreground mb-1">
                            Database Permissions:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {mismatch.dbRoles.length > 0 ? (
                              mismatch.dbRoles.map((role: string) => (
                                <Badge key={role} variant="default" className="text-xs">
                                  {role}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-xs">None</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Suggested Actions */}
                      <Separator className="my-3" />
                      <div className="text-sm">
                        <div className="font-medium text-muted-foreground mb-1">
                          Suggested Action:
                        </div>
                        {mismatch.type === 'missing_in_file' && (
                          <div className="text-orange-600">
                            Add this permission to the static permissions file
                          </div>
                        )}
                        {mismatch.type === 'missing_in_db' && (
                          <div className="text-blue-600">
                            Update database roles to include this permission
                          </div>
                        )}
                        {mismatch.type === 'role_mismatch' && (
                          <div className="text-purple-600">
                            Synchronize roles between file and database
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
