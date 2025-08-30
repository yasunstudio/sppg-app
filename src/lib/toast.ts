// Toast utility for backward compatibility
import { toast as sonnerToast } from "sonner"

interface LegacyToastOptions {
  open?: boolean
  onOpenChange?: () => void
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function toast(options: LegacyToastOptions | string) {
  if (typeof options === "string") {
    sonnerToast(options)
    return
  }

  const { title, description, variant } = options

  const message = title && description ? `${title}: ${description}` : title || description || "Notification"

  if (variant === "destructive") {
    sonnerToast.error(message)
  } else {
    sonnerToast.success(message)
  }
}

toast.success = sonnerToast.success
toast.error = sonnerToast.error
toast.info = sonnerToast.info
toast.warning = sonnerToast.warning
