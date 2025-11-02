import { Navigate } from "react-router-dom"
import { useUserStore } from "@/store/userStore"
import type { UserRole } from "../../types/user"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useUserStore()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to user's default dashboard if they don't have permission
    return <Navigate to={`/${user.role}`} replace />
  }

  return <>{children}</>
}