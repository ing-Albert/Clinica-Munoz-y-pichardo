import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isAdminAuthenticated } from '../lib/auth'

export function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  return isAdminAuthenticated() ? children : <Navigate to="/admin/acceso" replace />
}
