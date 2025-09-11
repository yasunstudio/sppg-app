"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react"

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground text-lg">
              We encountered an unexpected error while processing your request.
            </p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 border">
            <p className="text-sm text-muted-foreground">
              This error has been automatically logged. If the problem persists, 
              please contact technical support with the error details below.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          
          <Button asChild>
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Error Code: 500 - Internal Server Error
          </p>
        </div>
      </div>
    </div>
  )
}
