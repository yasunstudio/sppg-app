"use client"

import * as React from "react"

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  action?: React.ReactNode
}

interface ToastState {
  toasts: Toast[]
}

type ToastAction = 
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'UPDATE_TOAST'; id: string; toast: Partial<Toast> }

const ToastContext = React.createContext<{
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
} | null>(null)

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.toast]
      }
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.id)
      }
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(t => 
          t.id === action.id ? { ...t, ...action.toast } : t
        )
      }
    default:
      return state
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] })

  const toast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    dispatch({ type: 'ADD_TOAST', toast: { ...toast, id } })
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', id })
    }, 5000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id })
  }, [])

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={state.toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  
  return {
    toast: (options: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
      context.toast(options)
    },
    dismiss: context.dismiss,
    toasts: context.toasts
  }
}

function ToastContainer({ 
  toasts, 
  onDismiss 
}: { 
  toasts: Toast[]
  onDismiss: (id: string) => void 
}) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            max-w-sm rounded-lg border p-4 shadow-lg animate-in slide-in-from-top-full
            ${toast.variant === 'destructive' 
              ? 'border-red-200 bg-red-50 text-red-900' 
              : 'border-gray-200 bg-white text-gray-900'
            }
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {toast.title && (
                <div className="font-medium">{toast.title}</div>
              )}
              {toast.description && (
                <div className="text-sm opacity-90 mt-1">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          {toast.action && (
            <div className="mt-2">{toast.action}</div>
          )}
        </div>
      ))}
    </div>
  )
}
