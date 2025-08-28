import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"

const ForceStyleAlertDialog = AlertDialogPrimitive.Root

const ForceStyleAlertDialogTrigger = AlertDialogPrimitive.Trigger

const ForceStyleAlertDialogPortal = AlertDialogPrimitive.Portal

const ForceStyleAlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    style={{
      backgroundColor: 'rgba(0, 0, 0, 0.8)'
    }}
    {...props}
    ref={ref}
  />
))
ForceStyleAlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const ForceStyleAlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ForceStyleAlertDialogPortal>
    <ForceStyleAlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        borderColor: '#e2e8f0',
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
      {...props}
    />
  </ForceStyleAlertDialogPortal>
))
ForceStyleAlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const ForceStyleAlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    style={{ color: '#0f172a' }}
    {...props}
  />
)
ForceStyleAlertDialogHeader.displayName = "ForceStyleAlertDialogHeader"

const ForceStyleAlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
ForceStyleAlertDialogFooter.displayName = "ForceStyleAlertDialogFooter"

const ForceStyleAlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    style={{ color: '#0f172a' }}
    {...props}
  />
))
ForceStyleAlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const ForceStyleAlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm", className)}
    style={{ color: '#64748b' }}
    {...props}
  />
))
ForceStyleAlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const ForceStyleAlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    style={{
      backgroundColor: '#dc2626',
      color: '#ffffff'
    }}
    {...props}
  />
))
ForceStyleAlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const ForceStyleAlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      "mt-2 inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:mt-0",
      className
    )}
    style={{
      backgroundColor: '#f1f5f9',
      color: '#0f172a',
      borderColor: '#cbd5e1'
    }}
    {...props}
  />
))
ForceStyleAlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  ForceStyleAlertDialog,
  ForceStyleAlertDialogPortal,
  ForceStyleAlertDialogOverlay,
  ForceStyleAlertDialogTrigger,
  ForceStyleAlertDialogContent,
  ForceStyleAlertDialogHeader,
  ForceStyleAlertDialogFooter,
  ForceStyleAlertDialogTitle,
  ForceStyleAlertDialogDescription,
  ForceStyleAlertDialogAction,
  ForceStyleAlertDialogCancel,
}
