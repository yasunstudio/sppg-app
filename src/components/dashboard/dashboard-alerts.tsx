'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export function DashboardAlerts() {
  const searchParams = useSearchParams()
  const [showAlert, setShowAlert] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const errorParam = searchParams.get('error')
    const messageParam = searchParams.get('message')
    
    if (errorParam) {
      setError(errorParam)
      setMessage(messageParam || 'An error occurred')
      setShowAlert(true)
      
      // Clear URL parameters after showing alert
      if (window.history.replaceState) {
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [searchParams])

  if (!showAlert) return null

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
          <div className="mt-1 text-sm text-red-700 flex items-center justify-between">
            <span>{message}</span>
            <button
              onClick={() => setShowAlert(false)}
              className="ml-4 inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
