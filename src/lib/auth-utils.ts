import { Session } from "next-auth"

/**
 * Get user roles from session
 */
export function getUserRoles(session: Session | null): string[] {
  if (!session?.user?.roles) return []
  return session.user.roles.map(userRole => userRole.role.name)
}

/**
 * Get primary role (first role) from session
 */
export function getPrimaryRole(session: Session | null): string | null {
  const roles = getUserRoles(session)
  return roles.length > 0 ? roles[0] : null
}

/**
 * Check if user has specific role
 */
export function hasRole(session: Session | null, role: string): boolean {
  const roles = getUserRoles(session)
  return roles.includes(role)
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(session: Session | null, roles: string[]): boolean {
  const userRoles = getUserRoles(session)
  return userRoles.some(role => roles.includes(role))
}

/**
 * Check if user is admin
 */
export function isAdmin(session: Session | null): boolean {
  return hasRole(session, "ADMIN")
}

/**
 * Check if user is authorized for admin functions
 */
export function isAuthorizedAdmin(session: Session | null): boolean {
  return hasAnyRole(session, ["ADMIN", "KEPALA_SPPG"])
}
