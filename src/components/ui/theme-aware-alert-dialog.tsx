import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Re-export all AlertDialog components with theme-aware names
// These are just aliases that use the standard shadcn/ui AlertDialog
// which automatically handles theming via CSS variables
const ThemeAwareAlertDialog = AlertDialog
const ThemeAwareAlertDialogTrigger = AlertDialogTrigger
const ThemeAwareAlertDialogPortal = AlertDialogPortal
const ThemeAwareAlertDialogOverlay = AlertDialogOverlay
const ThemeAwareAlertDialogContent = AlertDialogContent
const ThemeAwareAlertDialogHeader = AlertDialogHeader
const ThemeAwareAlertDialogFooter = AlertDialogFooter
const ThemeAwareAlertDialogTitle = AlertDialogTitle
const ThemeAwareAlertDialogDescription = AlertDialogDescription
const ThemeAwareAlertDialogAction = AlertDialogAction
const ThemeAwareAlertDialogCancel = AlertDialogCancel

export {
  ThemeAwareAlertDialog,
  ThemeAwareAlertDialogPortal,
  ThemeAwareAlertDialogOverlay,
  ThemeAwareAlertDialogTrigger,
  ThemeAwareAlertDialogContent,
  ThemeAwareAlertDialogHeader,
  ThemeAwareAlertDialogFooter,
  ThemeAwareAlertDialogTitle,
  ThemeAwareAlertDialogDescription,
  ThemeAwareAlertDialogAction,
  ThemeAwareAlertDialogCancel,
}
