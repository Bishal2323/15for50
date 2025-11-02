import type { ReactNode } from "react"
import { AuthTabs } from "@/components/auth/AuthTabs"

interface AuthLayoutProps {
  active: 'login' | 'signup'
  children: ReactNode
}

export function AuthLayout({ active, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full flex justify-center mb-6">
        <AuthTabs active={active} />
      </div>
      {children}
    </div>
  )
}