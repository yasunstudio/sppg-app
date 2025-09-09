// Simple permission hook - can be enhanced later with real permission system
export const usePermission = (permission: string) => {
  // For now, return true for all permissions
  // This can be enhanced later to check user roles and permissions
  return true
}
